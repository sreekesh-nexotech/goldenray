"""Admin-managed configuration behind the EMI calculator.

Everything the calculator used to hard-code — system sizes and their per-kW
price, the PM Surya Ghar subsidy, interest-rate policy, loan/tenure bounds and
the bank comparison table — lives here so the Content Studio can change it
without a frontend deploy.

The calculation itself is in goldenray/utils/emi.py; these models are pure
configuration.
"""

from django.core.validators import MinValueValidator
from django.db import models


class EmiSystemSize(models.Model):
    """One tile in the calculator's "System Size" row.

    System cost is always derived as ``price_per_kw * capacity_kw`` — never
    stored as a lump sum — so editing the per-kW rate re-prices every size
    consistently.
    """

    label = models.CharField(
        max_length=32,
        help_text='Shown on the tile, e.g. "3kW".',
    )
    capacity_kw = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        unique=True,
        validators=[MinValueValidator(0.01)],
    )
    price_per_kw = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="₹ per kW. System cost = this × capacity.",
    )
    monthly_bill_reference = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text=(
            "Typical monthly electricity bill for this size. Drives the "
            "savings comparison, not the EMI."
        ),
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emi_system_size"
        ordering = ["sort_order", "capacity_kw"]
        verbose_name = "EMI system size"
        verbose_name_plural = "EMI system sizes"

    def __str__(self):
        return f"{self.label} @ ₹{self.price_per_kw}/kW"

    @property
    def system_cost(self):
        return self.price_per_kw * self.capacity_kw


class EmiSubsidyRule(models.Model):
    """Subsidy payable for a capacity band.

    Bands are matched on ``min_kw <= capacity <= max_kw``; a null bound is open
    ended. Highest ``priority`` wins when bands overlap.
    """

    label = models.CharField(
        max_length=120,
        help_text='e.g. "PM Surya Ghar — 3kW and above".',
    )
    min_kw = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text="Inclusive lower bound. Blank = no lower bound.",
    )
    max_kw = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text="Inclusive upper bound. Blank = no upper bound.",
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="₹ deducted from system cost before the loan is sized.",
    )
    priority = models.IntegerField(
        default=0,
        help_text="Higher wins when two bands match the same capacity.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emi_subsidy_rule"
        ordering = ["-priority", "min_kw"]
        verbose_name = "EMI subsidy rule"
        verbose_name_plural = "EMI subsidy rules"

    def __str__(self):
        return f"{self.label} — ₹{self.amount}"

    def matches(self, capacity_kw):
        if self.min_kw is not None and capacity_kw < self.min_kw:
            return False
        if self.max_kw is not None and capacity_kw > self.max_kw:
            return False
        return True


class EmiInterestRateRule(models.Model):
    """Interest-rate policy for a capacity band and/or a loan-amount band.

    Both bands are optional, which is what lets one table express today's
    size-keyed policy (3kW is locked at 5.75%, larger systems floor at 8%) and
    loan-range slabs later on, without a schema change. A rule with neither
    band set is the catch-all default.
    """

    label = models.CharField(max_length=120)

    min_kw = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text="Inclusive. Blank = applies to any capacity.",
    )
    max_kw = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text="Inclusive. Blank = applies to any capacity.",
    )
    min_loan = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Inclusive ₹ lower bound. Blank = applies to any loan.",
    )
    max_loan = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Inclusive ₹ upper bound. Blank = applies to any loan.",
    )

    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Starting annual rate (%) offered for this band.",
    )
    min_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Floor (%). A customer-adjusted rate is clamped up to this.",
    )
    is_locked = models.BooleanField(
        default=False,
        help_text="Locked rates ignore any customer adjustment entirely.",
    )
    priority = models.IntegerField(
        default=0,
        help_text="Higher wins when two rules match. Catch-alls should be low.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emi_interest_rate_rule"
        ordering = ["-priority", "min_kw", "min_loan"]
        verbose_name = "EMI interest rate rule"
        verbose_name_plural = "EMI interest rate rules"

    def __str__(self):
        lock = " (locked)" if self.is_locked else ""
        return f"{self.label} — {self.rate}%{lock}"

    def matches(self, capacity_kw, loan_amount):
        """True when both configured bands admit these values.

        An unset band never rejects, so a size-only rule ignores the loan and a
        loan-only slab ignores the capacity.
        """
        if capacity_kw is not None:
            if self.min_kw is not None and capacity_kw < self.min_kw:
                return False
            if self.max_kw is not None and capacity_kw > self.max_kw:
                return False
        elif self.min_kw is not None or self.max_kw is not None:
            # Rule is capacity-scoped but we have no capacity to test.
            return False

        if loan_amount is not None:
            if self.min_loan is not None and loan_amount < self.min_loan:
                return False
            if self.max_loan is not None and loan_amount > self.max_loan:
                return False
        elif self.min_loan is not None or self.max_loan is not None:
            return False

        return True

    @property
    def specificity(self):
        """How many bounds the rule pins down — the tie-breaker after priority."""
        return sum(
            1
            for bound in (self.min_kw, self.max_kw, self.min_loan, self.max_loan)
            if bound is not None
        )


class EmiCalculatorSettings(models.Model):
    """Singleton row holding the calculator's global knobs.

    Always read through :meth:`load` — it creates the row on first access so
    the calculator never has to cope with an empty table.
    """

    SINGLETON_PK = 1

    loan_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=90,
        help_text="% of the post-subsidy cost that is financed. The rest is upfront.",
    )
    subsidy_before_loan = models.BooleanField(
        default=True,
        help_text=(
            "On: subsidy is deducted first, then the loan %% is applied to the "
            "remainder. Off: the loan %% applies to the gross system cost."
        ),
    )
    tenure_min_years = models.PositiveIntegerField(default=1)
    tenure_max_years = models.PositiveIntegerField(default=10)
    tenure_default_years = models.PositiveIntegerField(default=5)
    daily_saving_divisor = models.PositiveIntegerField(
        default=30,
        help_text="Daily amount = monthly EMI ÷ this. 30 by policy.",
    )
    loan_amount_min = models.DecimalField(max_digits=12, decimal_places=2, default=50000)
    loan_amount_max = models.DecimalField(max_digits=12, decimal_places=2, default=600000)
    loan_step = models.DecimalField(
        max_digits=12, decimal_places=2, default=5000,
        help_text="Increment for the loan amount +/- buttons and slider.",
    )
    rate_max = models.DecimalField(
        max_digits=5, decimal_places=2, default=18,
        help_text="Upper end of the customer-facing rate slider.",
    )
    default_interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=9.5,
        help_text="Fallback when no interest rate rule matches.",
    )
    panel_life_years = models.PositiveIntegerField(
        default=25,
        help_text="Used for the lifetime-savings projection.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emi_calculator_settings"
        verbose_name = "EMI calculator settings"
        verbose_name_plural = "EMI calculator settings"

    def __str__(self):
        return "EMI calculator settings"

    def save(self, *args, **kwargs):
        # Force the singleton: any save lands on row 1.
        self.pk = self.SINGLETON_PK
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):  # pragma: no cover - guard only
        raise RuntimeError("The EMI calculator settings row cannot be deleted.")

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=cls.SINGLETON_PK)
        return obj


class EmiBank(models.Model):
    """A row in the bank comparison table under the calculator."""

    name = models.CharField(max_length=160)
    abbr = models.CharField(max_length=12, help_text='Logo initials, e.g. "SBI".')
    slug = models.SlugField(max_length=64, unique=True)
    logo_bg = models.CharField(
        max_length=9, default="#074A4D",
        help_text="Hex colour behind the logo initials.",
    )

    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Headline annual rate (%) used for sorting and display.",
    )
    min_loan = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_loan = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    upfront_requirement = models.CharField(
        max_length=160, blank=True,
        help_text='Down payment / margin, e.g. "10% of project cost".',
    )
    eligibility = models.CharField(
        max_length=255, blank=True,
        help_text='Free text, e.g. "CIBIL 700+, salaried or self-employed".',
    )
    cibil_required = models.PositiveIntegerField(
        default=0, help_text="0 means no published minimum.",
    )
    processing_fee_percent = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="0 for zero-fee lenders. Use the note for flat fees.",
    )
    processing_fee_note = models.CharField(
        max_length=120, blank=True,
        help_text='Overrides the %% when set, e.g. "₹500 flat".',
    )
    approval_min_days = models.PositiveIntegerField(default=0)
    approval_max_days = models.PositiveIntegerField(default=0)
    max_tenure_years = models.PositiveIntegerField(default=0)

    features = models.JSONField(
        default=list, blank=True,
        help_text="List of bullet strings shown on the card.",
    )
    best_for = models.CharField(max_length=255, blank=True)
    is_recommended = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emi_bank"
        ordering = ["sort_order", "interest_rate"]
        verbose_name = "EMI bank"
        verbose_name_plural = "EMI banks"

    def __str__(self):
        return f"{self.name} ({self.interest_rate}%)"
