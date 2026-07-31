// Page 10 of the Flarize quotation document (English) — Terms and Conditions — items 1–9
import type { CSSProperties } from "react";
import TermsPageLayout, { type TermsClause } from "../TermsPageLayout";

const CLAUSES: TermsClause[] = [
  {
    title: "1. Warranty",
    body: "Golden Ray Renewable Energy provides a five (5) year warranty for the complete solar power system against manufacturing and technical defects, subject to the terms and conditions mentioned herein. Solar panels, inverters, and other OEM products shall carry warranty coverage as provided by their respective manufacturers.",
  },
  {
    title: "2. Warranty Exclusions",
    body: "The warranty shall not apply to defects or damages resulting from misuse, negligence, unauthorized modifications, third-party interference, improper operation, storage, or maintenance. Warranty coverage also excludes damage caused by accidents, natural calamities, lightning, flooding, landslides, external grid surges, or any other Force Majeure events.",
  },
  {
    title: "3. Consumables",
    body: "Consumable and protective components such as Fuses, Surge Protection Devices (SPDs), connectors, and similar accessories are not covered under warranty and may require periodic replacement as part of normal maintenance.",
  },
  {
    title: "4. Customer Responsibilities",
    body: "The customer shall provide a shade-free area suitable for solar panel installation along with adequate space for inverters, meters, and associated equipment. Water access for panel cleaning, site accessibility, internet connectivity for monitoring systems, and any loading or unloading arrangements at site shall be arranged by the customer. If vehicle access to the installation site is restricted or unavailable, the customer shall arrange the necessary manpower or alternate transportation required for material movement, installation, servicing, or maintenance activities. Any additional costs arising due to restricted site access shall be borne by the customer.",
  },
  {
    title: "5. Service & Training",
    body: "Basic service and maintenance training shall be provided to the customer at the time of commissioning. Standby inverter support may be provided during inverter repair periods, subject to availability.",
  },
  {
    title: "6. Payment Terms",
    body: "Payments shall be made as per the payment schedule agreed in the quotation and are due immediately upon completion of each project stage. In case the project duration is extended, invoices for completed work, supplied materials, or specially ordered materials may be raised periodically and shall be payable upon receipt. Any additional charges arising from scope changes, statutory requirements, material variations, or customer-requested modifications shall be paid before the related work is undertaken. The agreed project price shall be considered final upon acceptance of the quotation and requests for price reductions, discounts, or renegotiation after order confirmation shall not be entertained. Payments shall be made only to the official bank account of Golden Ray Renewable Energy, and the Company shall not be responsible for payments made to employee or third-party accounts. Eligible refunds shall be processed within seven (7) working days, subject to banking procedures.",
  },
  {
    title: "7. Price Variations",
    body: "If payments are not made as agreed, any increase in labour costs, material costs, taxes, duties, or statutory charges occurring after the quotation date may be charged additionally to the customer. Such revisions shall be reflected in the final invoice.",
  },
  {
    title: "8. GST & Tax Changes",
    body: "Prices quoted are inclusive of applicable GST and taxes prevailing on the date of quotation. Any revision in GST, government levies, duties, or statutory charges shall be reflected in the final invoice.",
  },
  {
    title: "9. System Capacity & Product Confirmation",
    body: "Once the customer confirms the system capacity, panel make/model, inverter make/model, and quotation, subsequent changes may not be possible. Any changes requested thereafter may result in revised pricing, additional charges, material replacement costs, or project delays.",
  },
];

export default function Page10Terms({ className, style }: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <TermsPageLayout
      className={className}
      style={style}
      title="Terms and Conditions"
      clauses={CLAUSES}
    />
  );
}
