"use client";

export default function Page8_1Content() {
  const terms = [
    {
      title: "10. Project Completion Timeline :",
      body: "The Company shall endeavour to complete the project within the timeline specified in the quotation or within a reasonable period where no timeline is specified. However, the Company shall not be responsible for delays caused by approvals, shipment delays, transportation issues, weather conditions, or other factors beyond its reasonable control.",
    },
    {
      title: "11. Statutory & KSEB Related Scope :",
      body: "Golden Ray Renewable Energy shall assist with statutory approvals and KSEB-related procedures as applicable. Any charges, deposits, penalties, load enhancement costs, tariff changes, name changes, ownership transfers, meter shifting, or similar modifications shall be borne by the customer.",
    },
    {
      title: "12. Government Subsidy Disclaimer :",
      body: "Government subsidy schemes, eligibility criteria, approval procedures, and reimbursement timelines are governed by the respective authorities and may change without prior notice. The Company shall not be responsible for delays, rejections, policy changes, reduction in subsidy amount, or subsidy disbursement timelines.",
    },
    {
      title: "13. Data Privacy :",
      body: "The Company reserves the right to monitor, record, and utilize customer information and solar production data obtained directly from the system or through remote monitoring platforms. Such information may be shared with vendors, technical support teams, regulatory authorities, and other relevant agencies for warranty support, compliance requirements, research, service improvement, and promotional activities.",
    },
    {
      title: "14. Additional Expenses & Civil Works :",
      body: "Unless specifically included in the quotation, charges relating to KSEB applications, registration, documentation, testing, agreements, net meter connections, additional structures, extended cable runs, site-specific modifications, and any civil work including foundation work, roof repairs, waterproofing, structural modifications, masonry work, painting, trenching, cutting, restoration work, or related activities shall be borne by the customer.",
    },
    {
      title: "15. Retention of Title :",
      body: "All materials, equipment, and goods supplied by the Company shall remain its property until full payment has been received and all outstanding dues have been cleared. Ownership shall transfer to the customer only upon complete settlement of outstanding dues.",
    },
    {
      title: "16. Liability :",
      body: "The Company shall not be liable for business interruption, loss of profit, loss of savings, or any indirect or consequential damages arising from the use or performance of the solar power system. Claims arising from non-compliance with operating, maintenance, or installation instructions shall also be excluded.",
    },
    {
      title: "17. Force Majeure :",
      body: "The Company shall not be liable for delays or failure to perform its obligations due to circumstances beyond its reasonable control. Such circumstances include natural disasters, strikes, transportation disruptions, utility delays, government actions, regulatory changes, or other Force Majeure events.",
    },
    {
      title: "18. Confidentiality :",
      body: "Both parties shall treat all non-public commercial and technical information exchanged during the course of the project as confidential. Such information shall not be disclosed to any third party without prior written consent, except where required by law.",
    },
    {
      title: "19. Jurisdiction :",
      body: "This quotation and all related agreements shall be governed by the laws of India. Any disputes arising out of or in connection with this agreement shall be subject to the jurisdiction of the courts of Kerala.",
    },
  ];

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      {/* Terms list (continued from previous page) */}
      <div className="space-y-4">
        {terms.map((term, idx) => (
          <div key={idx}>
            <h3 className="text-[12px] font-semibold text-[#123532] mb-1">
              {term.title}
            </h3>
            <p className="text-[10.5px] text-[#123532] leading-relaxed">
              {term.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
