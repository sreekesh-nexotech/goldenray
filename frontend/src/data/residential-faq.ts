// Residential page FAQ — the single source of truth.
//
// Both the visible accordion (components/Residential/ResidentialFAQ.tsx) and the
// FAQPage structured data (data/jsonld.ts) read this array. Google treats FAQ
// markup that doesn't match the visible answer as a spam signal, so never fork
// one copy for the page and another for the schema — edit here and both follow.

export interface FaqItem {
  question: string;
  answer: string;
}

export const residentialFaqs: FaqItem[] = [
  {
    question: "How much do solar panels cost for a home in Kerala?",
    answer:
      "A 3kW on-grid system costs ₹2–2.30 lakh, a 5kW system ₹3–3.30 lakh and a 10kW system ₹5–6 lakh before the ₹78,000 PM Surya Ghar subsidy. The range exists because a flat concrete roof is cheaper to work on than a tiled roof needing a raised frame, taller buildings need more cable and scaffolding, and panel and inverter brands differ in price. After the free site assessment your proposal shows one fixed, item-by-item price that does not change once work starts.",
  },
  {
    question: "Is the ₹78,000 solar subsidy real, and how do I get it?",
    answer:
      "Yes. It is paid under the central PM Surya Ghar Muft Bijli Yojana and credited directly to your bank account after installation and inspection. Flarize files the national portal application, the KSEB paperwork and the subsidy claim on your behalf, so you are not chasing forms yourself.",
  },
  {
    question: "How does KSEB net metering work?",
    answer:
      "A bidirectional KSEB meter records the units your roof exports during the day and the units you draw at night. You are billed only on the net difference, so daytime generation offsets night-time consumption. Flarize handles the net-metering application, feasibility approval and meter installation with KSEB.",
  },
  {
    question: "Will solar panels work during the Kerala monsoon?",
    answer:
      "Yes, at reduced output. Panels run on daylight rather than direct sun, so they keep generating on overcast monsoon days, typically at a lower percentage of rated output. Systems are sized against your full-year consumption, so strong generation from January to May covers the monsoon dip — and rain also washes dust off the panels.",
  },
  {
    question: "Is the site assessment free?",
    answer:
      "Yes. A Flarize engineer visits your home, measures usable shadow-free roof area, checks orientation and shading between 9 AM and 4 PM, reviews your KSEB bill and returns three tailored proposals. There is no cost and no obligation to proceed.",
  },
  {
    question: "Do I need a battery with my solar system?",
    answer:
      "Most Kerala homes do not. An on-grid system is cheapest and pays back fastest, but shuts down during a power cut as a KSEB safety rule. Choose a hybrid system with a battery if outages are frequent in your area, or you need fans, lights, Wi-Fi and the fridge to keep running at night.",
  },
  {
    question: "Can I add more panels later or charge an EV?",
    answer:
      "Yes, if the system is planned for it. Sizing the inverter with headroom and leaving spare roof area lets you add panels later, and an EV charger can be added to a suitably sized system. Tell the engineer at the assessment so the design allows for future load.",
  },
];
