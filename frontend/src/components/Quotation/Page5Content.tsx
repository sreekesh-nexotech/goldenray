"use client";

// Bill of Materials page — shows the BOM line items + pricing summary produced
// by the backend BOM engine (via bomService). Replaces the old static
// "Technical Specifications" comparison table.
import type { QuotationBom, QuotationBomLine } from "@/services/bomService";

interface Page5ContentProps {
  bom?: QuotationBom;
}

const EMPTY_BOM: QuotationBom = {
  lines: [],
  basePrice: 0,
  addOnTotal: 0,
  discountAmt: 0,
  discountLabel: "",
  finalPrice: 0,
  subsidy: 0,
  subsidyLabel: "",
  priceAfterSubsidy: 0,
  customerName: "",
  salesPerson: "",
  systemLabel: "",
  tierLabel: "",
};

export default function Page5Content({ bom }: Page5ContentProps) {
  const b = bom ?? EMPTY_BOM;
  const fmt = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
  const lines = b.lines || [];

  // Split lines into two columns for compactness
  const splitAt = Math.ceil(lines.length / 2);
  const col1 = lines.slice(0, splitAt);
  const col2 = lines.slice(splitAt);

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mt-2 mb-2">
        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-1">
          Your Bill of Materials
        </h1>
        <p className="text-[12px] text-gray-500 italic">
          Every component included in your {b.systemLabel || "solar system"} —
          full transparency.
        </p>
      </div>

      {/* Customer + System info strip */}
      <div className="grid grid-cols-3 gap-2 mx-2 mb-3">
        <InfoBox label="Customer" value={b.customerName} />
        <InfoBox label="System" value={b.systemLabel} />
        <InfoBox label="Package" value={b.tierLabel} />
      </div>

      {/* BOM table — split into two columns */}
      <div className="mx-2 grid grid-cols-2 gap-3 mb-3">
        <BomTable items={col1} startIdx={1} />
        <BomTable items={col2} startIdx={col1.length + 1} />
      </div>

      {/* Pricing summary */}
      <div className="mx-2 grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-[#FFF8E9] border border-[#E5D5B8] rounded-xl p-3">
          <h3 className="text-[13px] font-bold text-[#123532] mb-2">
            Pricing Summary
          </h3>
          <table className="w-full text-[11px]">
            <tbody>
              <Row
                label={`System Price (${b.tierLabel})`}
                value={fmt(b.basePrice)}
              />
              {b.addOnTotal > 0 && (
                <Row
                  label="Add-Ons (Structure / Cable / Transport)"
                  value={`+ ${fmt(b.addOnTotal)}`}
                />
              )}
              {b.discountAmt > 0 && (
                <Row
                  label={`Offer: ${b.discountLabel}`}
                  value={`– ${fmt(b.discountAmt)}`}
                  green
                />
              )}
              <tr>
                <td colSpan={2} className="pt-1.5">
                  <div className="border-t border-gray-300" />
                </td>
              </tr>
              <Row label="Total Price" value={fmt(b.finalPrice)} bold />
              {b.subsidy > 0 && (
                <>
                  <Row
                    label={b.subsidyLabel}
                    value={`– ${fmt(b.subsidy)}`}
                    amber
                  />
                  <tr>
                    <td colSpan={2} className="pt-1.5">
                      <div className="border-t border-green-300" />
                    </td>
                  </tr>
                  <Row
                    label="You Pay (after subsidy)"
                    value={fmt(b.priceAfterSubsidy)}
                    bold
                    green
                  />
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#16A34A1A] border-l-4 border-[#16A34A] rounded-xl p-3 flex flex-col">
          <h3 className="text-[13px] font-bold text-[#123532] mb-2">
            What&apos;s Included
          </h3>
          <ul className="space-y-1 text-[10.5px] text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> Complete installation by
              certified team
            </li>
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> 5-year comprehensive
              workmanship warranty
            </li>
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> KSEB net-metering
              paperwork &amp; coordination
            </li>
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> PM Surya Ghar subsidy
              application
            </li>
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> Free panel-wash service
              in first year
            </li>
            <li className="flex gap-2">
              <span className="text-[#16a34a]">✓</span> Standby inverter during
              repair (zero downtime)
            </li>
          </ul>
          <div className="mt-auto pt-2">
            <p className="text-[10px] text-gray-500 italic">
              Quote prepared by:{" "}
              <span className="font-semibold">{b.salesPerson || "—"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5">
      <p className="text-[9px] text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-[12px] font-semibold text-[#123532] truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function BomTable({
  items,
  startIdx,
}: {
  items: QuotationBomLine[];
  startIdx: number;
}) {
  if (!items || items.length === 0) return <div />;
  return (
    <table className="w-full border-collapse text-[10px]">
      <thead>
        <tr>
          <th className="text-left py-1.5 px-2 text-white bg-[#123532] font-semibold w-6">
            #
          </th>
          <th className="text-left py-1.5 px-2 text-white bg-[#123532] font-semibold">
            Material / Brand
          </th>
          <th className="text-center py-1.5 px-2 text-white bg-[#123532] font-semibold w-10">
            Qty
          </th>
          <th className="text-left py-1.5 px-2 text-white bg-[#123532] font-semibold w-10">
            Unit
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-2 py-1 text-gray-400">{startIdx + i}</td>
            <td className="px-2 py-1 text-gray-800 font-medium">{item.name}</td>
            <td className="px-2 py-1 text-center text-gray-700 font-semibold">
              {item.qty}
            </td>
            <td className="px-2 py-1 text-gray-500">{item.unit || "nos"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Row({
  label,
  value,
  bold,
  green,
  amber,
}: {
  label: string;
  value: string;
  bold?: boolean;
  green?: boolean;
  amber?: boolean;
}) {
  const labelClass = `py-1 text-left ${bold ? "font-bold text-[#123532]" : ""} ${green ? "text-[#16a34a]" : ""} ${amber ? "text-amber-700" : ""}`;
  const valClass = `py-1 text-right font-semibold ${bold ? "font-bold text-[#123532]" : ""} ${green ? "text-[#16a34a]" : ""} ${amber ? "text-amber-700" : ""}`;
  return (
    <tr>
      <td className={labelClass}>{label}</td>
      <td className={valClass}>{value}</td>
    </tr>
  );
}
