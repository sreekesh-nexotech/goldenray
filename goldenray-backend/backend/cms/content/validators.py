"""Slug validation for entries.

A slug is a permanent public URL (``{site}/blog/{slug}``), so it is worth
rejecting the values that produce dead or embarrassing URLs *before* they are
saved rather than cleaning them up afterwards. Three classes of failure:

* **malformed** — not the lowercase-hyphen shape the rest of the stack assumes
  (``slugify()`` output, what ``check-slug`` suggests, what the frontend routes
  on),
* **placeholder** — obvious keyboard-mash / test / serialisation-accident values
  (``test``, ``asdf``, ``undefined``, ``[object Object]``, ``{slug}``),
* **reserved** — paths the site itself owns, which would shadow a real route.

Attached to ``Entry.slug`` as a field validator, so it runs for the authoring
API (DRF copies model-field validators onto the serializer field), the Django
admin (via ``full_clean``) and anything calling ``Entry.full_clean()``. It does
*not* run on a bare ``.save()`` — Django never validates there — so the write
paths that matter call it explicitly.
"""
import re

from django.core.exceptions import ValidationError

# lowercase alphanumerics in hyphen-separated groups: exactly what
# django.utils.text.slugify() emits, and what the blog frontend routes on.
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

MIN_SLUG_LENGTH = 3
MAX_SLUG_LENGTH = 255

# Values that are never a real article. Matched case-insensitively against the
# slug *and* against its de-hyphenated form, so "test-1", "sdf-sdf" and
# "object-Object" are caught alongside the literals.
PLACEHOLDER_SLUGS = frozenset(
    {
        "sdf",
        "sdfsdf",
        "test",
        "tests",
        "testing",
        "testtest",
        "asdf",
        "asdfasdf",
        "qwerty",
        "qwertyuiop",
        "undefined",
        "null",
        "none",
        "nan",
        "objectobject",
        "slug",
        "string",
        "foo",
        "bar",
        "foobar",
        "baz",
        "abc",
        "xyz",
        "aaa",
        "xxx",
        "temp",
        "tmp",
        "dummy",
        "sample",
        "example",
        "placeholder",
        "lorem",
        "loremipsum",
        "new",
        "untitled",
        "draft",
        "demo",
        "delete",
        "deleteme",
        "dontuse",
        "changeme",
    }
)

# Site-level paths a blog entry must not shadow.
RESERVED_SLUGS = frozenset(
    {
        "admin",
        "api",
        "blog",
        "static",
        "media",
        "uploads",
        "feed",
        "rss",
        "sitemap",
        "robots",
        "search",
        "page",
        "index",
    }
)

# A trailing counter is how editors accidentally ship "test-2" / "asdf-3".
_TRAILING_COUNTER_RE = re.compile(r"-\d+$")


def _placeholder_forms(value: str) -> set[str]:
    """The forms of ``value`` compared against PLACEHOLDER_SLUGS."""
    stripped = _TRAILING_COUNTER_RE.sub("", value)
    return {
        value,
        value.replace("-", ""),
        stripped,
        stripped.replace("-", ""),
    }


def validate_entry_slug(value) -> None:
    """Raise ``ValidationError`` unless ``value`` is a usable public slug.

    Uniqueness is *not* checked here — that is the collection-scoped database
    constraint's job (``uniq_entry_collection_slug``) plus the alias table, both
    of which need query context this validator does not have.
    """
    if value is None:
        raise ValidationError("A slug is required.", code="slug_empty")

    raw = str(value)
    if raw != raw.strip():
        raise ValidationError(
            "Slug must not start or end with whitespace.", code="slug_whitespace"
        )
    if not raw:
        raise ValidationError("A slug is required.", code="slug_empty")

    if len(raw) > MAX_SLUG_LENGTH:
        raise ValidationError(
            f"Slug must be at most {MAX_SLUG_LENGTH} characters (got {len(raw)}).",
            code="slug_too_long",
        )

    if not SLUG_RE.match(raw):
        raise ValidationError(
            "Slug must be lowercase letters, numbers and single hyphens only "
            "(e.g. 'solar-panel-cost-in-kerala'). Got %(value)s.",
            code="slug_malformed",
            params={"value": repr(raw)},
        )

    if len(raw) < MIN_SLUG_LENGTH:
        raise ValidationError(
            f"Slug must be at least {MIN_SLUG_LENGTH} characters.", code="slug_too_short"
        )

    if raw in RESERVED_SLUGS:
        raise ValidationError(
            "'%(value)s' is a reserved site path and cannot be used as a slug.",
            code="slug_reserved",
            params={"value": raw},
        )

    if _placeholder_forms(raw) & PLACEHOLDER_SLUGS:
        raise ValidationError(
            "'%(value)s' looks like placeholder or test content. Give the entry "
            "its real URL slug before saving.",
            code="slug_placeholder",
            params={"value": raw},
        )


def slug_error(value) -> str | None:
    """``validate_entry_slug`` as a nullable message, for read-only reporting
    (the ``check-slug`` endpoint, the audit command)."""
    try:
        validate_entry_slug(value)
    except ValidationError as exc:
        return exc.messages[0]
    return None
