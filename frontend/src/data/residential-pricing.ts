// Residential system pricing — the single source of truth.
//
// Rendered by components/Residential/SolarPriceInKerala.tsx and marked up as an
// OfferCatalog in data/jsonld.ts. Structured-data prices that contradict the
// prices a visitor sees are a spam signal, so the numeric priceMin/priceMax
// below must always describe the same range as the displayed `price` string.

export interface ResidentialSystem {
  title: string;
  summary: string;
  /** Displayed price range, before subsidy. */
  price: string;
  /** Same range as `price`, in rupees, for structured data. */
  priceMin: number;
  priceMax: number;
  subsidy: string;
  emi: string;
  emiTail: string;
  highlighted: boolean;
}

export const residentialSystems: ResidentialSystem[] = [
  {
    title: "3kW On-Grid",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹2 - 2.30 lakh",
    priceMin: 200000,
    priceMax: 230000,
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail:
      "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: false,
  },
  {
    title: "5kW System",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹3 - 3.30 lakh",
    priceMin: 300000,
    priceMax: 330000,
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail:
      "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: true,
  },
  {
    title: "10kW System",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹5 - 6 lakh",
    priceMin: 500000,
    priceMax: 600000,
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail:
      "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: false,
  },
];

/** The PM Surya Ghar subsidy amount, in rupees, quoted across the page. */
export const PM_SURYA_GHAR_SUBSIDY = 78000;
