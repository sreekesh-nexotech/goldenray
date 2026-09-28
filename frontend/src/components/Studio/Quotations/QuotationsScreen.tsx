"use client";

// src/components/Studio/Quotations/QuotationsScreen.tsx
//
// Content Studio → Quotations. The sales / accounting team's copy of a
// customer quotation: the same document the customer downloads from the
// website, cut down to pages 1, 5, 7 and 8 (cover, package pricing, technical
// specifications & pricing table, savings), in English or Malayalam.
//
// Nothing here is re-implemented. The system size, price and savings come from
// the public solar calculator's own endpoint; the quotation payload, BOM and
// PDF come from quotationPdfService, which the customer's popup uses too; the
// EMI figures inside the document come from the /emi-calculator engine. So an
// accounting copy made for the same inputs carries the customer's numbers.

import { useMemo, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import {
  Card,
  CardHeader,
  CardTitle,
  FieldLabel,
  GhostButton,
  GoldButton,
  PageHeader,
  SelectField,
  TextArea,
  TextInput,
  TipBanner,
} from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { getSolarAdvantageData } from "@/services/CalculatorService";
import {
  assembleQuotationData,
  requestQuotationPdf,
  saveFile,
  type CalculatorFigures,
} from "@/services/quotationPdfService";
import type { QuotationLanguage } from "@/components/Quotation/i18n/quotationStrings";
import type { BasicCalculatorData } from "@/types/types";

/** Same limit the public calculator enforces. */
const MAX_BILL = 40000;

/** The option values the customer's popup stores, so the document reads them the same way. */
const SUBSIDY_OPTIONS = ["Eligible (DCR)", "Not Eligible (Non-DCR)"];

interface FormState {
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  propertyType: "residential" | "commercial";
  monthlyBill: string;
  subsidyEligibility: string;
  salesPerson: string;
}

const EMPTY: Omit<FormState, "salesPerson"> = {
  customerName: "",
  phoneNumber: "",
  address: "",
  pincode: "",
  propertyType: "residential",
  monthlyBill: "",
  subsidyEligibility: SUBSIDY_OPTIONS[0],
};

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!f.customerName.trim()) errors.customerName = "Customer name is required.";
  if (!/^\d{10}$/.test(f.phoneNumber.trim())) errors.phoneNumber = "Enter a 10-digit phone number.";
  if (!/^\d{6}$/.test(f.pincode.trim())) errors.pincode = "Enter a 6-digit pincode.";
  const bill = Number(f.monthlyBill);
  if (!f.monthlyBill || !Number.isFinite(bill) || bill <= 0) errors.monthlyBill = "Enter the electricity bill.";
  else if (bill > MAX_BILL) errors.monthlyBill = `The bill cannot exceed ₹${MAX_BILL.toLocaleString("en-IN")}.`;
  return errors;
}

/** Parse "₹1,90,000" (the calculator's display strings) back to a number. */
const rupeesToNumber = (s: string) => parseFloat(s.replace(/[₹,\s]/g, ""));

function figuresFrom(calc: BasicCalculatorData): CalculatorFigures {
  // Exactly what SolarBasicResult hands the customer's popup.
  return {
    systemSize: calc.specifications.power_requirement,
    systemPrice: rupeesToNumber(calc.financialDetails.final_cost),
    emiPerMonth: rupeesToNumber(calc.financialDetails.starting_EMI),
    graphData: calc.graph_data,
  };
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      {children}
      {error && (
        <span style={{ display: "block", marginTop: 5, fontSize: 12, color: studioColors.danger }}>{error}</span>
      )}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4"
      style={{ padding: "8px 0", borderBottom: "1px solid rgba(229,231,235,.7)" }}
    >
      <span style={{ fontSize: 13, color: studioColors.bodyGray }}>{label}</span>
      <span style={{ fontFamily: studioFonts.num, fontSize: 13.5, fontWeight: 600, color: studioColors.tealDeep }}>
        {value}
      </span>
    </div>
  );
}

export default function QuotationsScreen() {
  const { me, toast } = useStudio();
  const defaultSalesPerson = useMemo(
    () => [me?.first_name, me?.last_name].filter(Boolean).join(" ") || me?.username || "",
    [me],
  );

  const [form, setForm] = useState<FormState>({ ...EMPTY, salesPerson: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [calc, setCalc] = useState<BasicCalculatorData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [downloading, setDownloading] = useState<QuotationLanguage | null>(null);

  const salesPerson = form.salesPerson || defaultSalesPerson;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    // Any change to what the calculator reads invalidates its answer.
    if (key === "pincode" || key === "monthlyBill" || key === "propertyType") setCalc(null);
  };

  const calculate = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setCalculating(true);
    try {
      const data = await getSolarAdvantageData({
        pincode: form.pincode.trim(),
        property_type: form.propertyType,
        monthly_bill: Number(form.monthlyBill),
      });
      setCalc(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast(
        message.includes("Pincode not found")
          ? "This pincode is outside the service area."
          : "Could not run the solar calculator. Please try again.",
        "error",
      );
    } finally {
      setCalculating(false);
    }
  };

  const download = async (language: QuotationLanguage) => {
    if (!calc) return;
    setDownloading(language);
    try {
      const data = await assembleQuotationData(
        {
          customerName: form.customerName.trim(),
          address: form.address.trim(),
          phoneNumber: form.phoneNumber.trim(),
          preferredLanguage: language,
          subsidyEligibility: form.subsidyEligibility,
          pincode: form.pincode.trim(),
          monthlyBill: Number(form.monthlyBill),
        },
        figuresFrom(calc),
        { salesPerson },
      );
      const { blob, fileName } = await requestQuotationPdf(data, { language, variant: "accounting" });
      saveFile(blob, fileName);
      toast(`Downloaded ${fileName}`);
    } catch (err) {
      console.error("Accounting quotation failed:", err);
      toast("Could not generate the quotation PDF. Please try again.", "error");
    } finally {
      setDownloading(null);
    }
  };

  const reset = () => {
    setForm({ ...EMPTY, salesPerson: "" });
    setErrors({});
    setCalc(null);
  };

  const billLabel =
    form.propertyType === "residential" ? "Average bi-monthly bill (₹)" : "Average monthly bill (₹)";
  const busy = calculating || downloading !== null;

  return (
    <div>
      <PageHeader
        title="Quotations"
        subtitle="Accounting copy of a customer quotation — pages 1, 5, 7 and 8 of the full document, in English or Malayalam."
      />

      <TipBanner>
        Enter the customer&apos;s details exactly as on the website calculator. The system size,
        price and savings come from the same calculator, and the EMI from the EMI calculator&apos;s
        rules, so the copy carries the same figures as the customer&apos;s quotation. The PDF
        contains the cover, package pricing, technical specifications and savings pages.
      </TipBanner>

      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)" }}>
        <Card>
          <CardHeader>
            <CardTitle>Customer & calculator inputs</CardTitle>
          </CardHeader>
          <div className="grid gap-4" style={{ padding: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Customer name" error={errors.customerName}>
              <TextInput value={form.customerName} onChange={(v) => set("customerName", v)} />
            </Field>
            <Field label="Phone number" error={errors.phoneNumber}>
              <TextInput
                value={form.phoneNumber}
                onChange={(v) => set("phoneNumber", v.replace(/\D/g, "").slice(0, 10))}
                mono
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Address">
                <TextArea value={form.address} onChange={(v) => set("address", v)} minHeight={56} />
              </Field>
            </div>
            <Field label="Pincode" error={errors.pincode}>
              <TextInput
                value={form.pincode}
                onChange={(v) => set("pincode", v.replace(/\D/g, "").slice(0, 6))}
                mono
              />
            </Field>
            <Field label="Property type">
              <SelectField
                value={form.propertyType}
                onChange={(v) => set("propertyType", v as FormState["propertyType"])}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </SelectField>
            </Field>
            <Field label={billLabel} error={errors.monthlyBill}>
              <TextInput
                value={form.monthlyBill}
                onChange={(v) => set("monthlyBill", v.replace(/[^\d]/g, ""))}
                mono
              />
            </Field>
            <Field label="PM Surya Ghar subsidy">
              <SelectField value={form.subsidyEligibility} onChange={(v) => set("subsidyEligibility", v)}>
                {SUBSIDY_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </SelectField>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Proposal by (printed on the cover)">
                <TextInput
                  value={form.salesPerson}
                  onChange={(v) => set("salesPerson", v)}
                  placeholder={defaultSalesPerson || "Flarize Team"}
                />
              </Field>
            </div>
            <div className="flex gap-2" style={{ gridColumn: "1 / -1" }}>
              <GoldButton onClick={calculate} disabled={busy}>
                {calculating ? "Calculating…" : calc ? "Recalculate" : "Calculate"}
              </GoldButton>
              <GhostButton onClick={reset} disabled={busy}>
                Clear
              </GhostButton>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounting copy</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }}>
            {!calc ? (
              <p style={{ fontSize: 13, color: studioColors.mutedGray, margin: 0 }}>
                Fill in the details and press Calculate to see the system the calculator
                recommends, then download the quotation.
              </p>
            ) : (
              <>
                <SummaryRow label="System size" value={calc.specifications.power_requirement} />
                <SummaryRow label="Total system cost" value={calc.financialDetails.overall_cost} />
                <SummaryRow label="Subsidy (calculator)" value={calc.financialDetails.government_subsidy} />
                <SummaryRow label="Area required" value={calc.specifications.area_requirement} />
                <p style={{ fontSize: 12, color: studioColors.mutedGray, margin: "12px 0 14px" }}>
                  The quotation applies the subsidy only when the customer is eligible (DCR).
                </p>
                <div className="flex flex-wrap gap-2">
                  <GoldButton onClick={() => download("English")} disabled={busy}>
                    {downloading === "English" ? "Generating…" : "Download English PDF"}
                  </GoldButton>
                  <GoldButton onClick={() => download("Malayalam")} disabled={busy}>
                    {downloading === "Malayalam" ? "Generating…" : "Download Malayalam PDF"}
                  </GoldButton>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
