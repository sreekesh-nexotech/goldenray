// Solar panel comparison FAQ — the single source of truth.
//
// Rendered by components/SolarComparison/FAQSection.tsx (shown on both
// /solar-comparison and /comparison-table) and marked up as FAQPage in
// data/jsonld.ts. Google treats FAQ markup that doesn't match the visible
// answer as a spam signal, so edit here and both copies follow.

import type { FaqItem } from "./residential-faq";

export type { FaqItem };

export const solarComparisonFaqs: FaqItem[] = [
  {
    question: "What is the best solar panel for Kerala's climate?",
    answer:
      "The best panel depends on your roof space, budget, and energy needs. For Kerala, prioritize panels with a low temperature coefficient (below -0.35%/°C), IP68-rated junction boxes for humidity resistance, and proven tropical degradation rates. N-type TOPCon panels from Adani and Saatvik currently score highest in our Kerala Climate Rating due to superior heat tolerance and lower degradation. Waaree and Vikram Solar's bifacial models are also strong contenders with proven Kerala track records.",
  },
  {
    question:
      "How important is temperature coefficient for solar panels in Kerala?",
    answer:
      "Very important. Kerala regularly sees ambient temps above 35°C, pushing panel surfaces to 55-65°C. A panel rated -0.30%/°C loses about 12% output at 65°C, while one at -0.40%/°C loses about 16%. That 4% daily difference over 25 years compounds to a significant gap in total generation and returns on your investment.",
  },
  {
    question: "Does high humidity affect solar panel performance?",
    answer:
      "Yes. Kerala's humidity (often above 80%) accelerates potential-induced degradation (PID), corrodes poorly sealed junction boxes, and causes micro-cracks in lower-quality cells. Panels with IP68-rated junction boxes, anti-PID certification, and tropical-grade encapsulants perform significantly better over their 25-year lifespan. This is why we weight humidity resistance heavily in our Kerala Climate Score.",
  },
  {
    question: "What does a 25-year solar panel warranty actually cover?",
    answer:
      "Most panels have two separate warranties. The product warranty (typically 12 years) covers manufacturing defects — cell cracking, delamination, junction box failure. The performance warranty (25-30 years) guarantees minimum output, usually 80-87% at term end. In Kerala, the product warranty matters more because humidity and heat stress-test build quality early. Always confirm the warranty is manufacturer-backed, not just installer-backed.",
  },
  {
    question: "How many solar panels do I need for my home in Kerala?",
    answer:
      "Divide your monthly KSEB bill by ₹1,000 for approximate system size in kW. A 3kW system needs 5-6 panels (550W each) for bills up to ₹3,000/month. A 5kW system needs 9-10 panels for bills up to ₹5,000/month. Your actual requirement depends on roof direction, shading, and whether you plan to add high-consumption appliances like an EV charger in the coming years. A site visit gives the most accurate number.",
  },
];
