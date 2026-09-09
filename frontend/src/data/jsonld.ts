import { SITE_URL } from "@/config";
import type { SolarPanel } from "@/types/solarPanel";
import { residentialFaqs } from "./residential-faq";
import {
  residentialSystems,
  PM_SURYA_GHAR_SUBSIDY,
} from "./residential-pricing";
import { solarComparisonFaqs, type FaqItem } from "./solar-comparison-faq";

// Every absolute URL below is built from SITE_URL (see src/config) so the
// www/non-www split can never reappear in structured data.
const ORG_ID = `${SITE_URL}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

/** Turn a shared FAQ array into schema.org Question entities. */
const faqEntities = (faqs: FaqItem[]) =>
  faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

// LocalBusiness schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": LOCAL_BUSINESS_ID,
  parentOrganization: { "@id": ORG_ID },
  name: "Flarize Solar",
  alternateName: "Golden Ray Renewable Energy",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo_header.png`,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  description:
    "Kerala-based solar EPC company. KSEB-approved, MNRE-empanelled. 300+ installations across Kerala.",
  telephone: "+91-6282922988",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Floor, Tharath Building, Kalappura",
    addressLocality: "Alappuzha",
    addressRegion: "Kerala",
    postalCode: "688007",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.4981,
    longitude: 76.3388,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "300",
  },
  sameAs: [
    "https://www.facebook.com/flarize",
    "https://www.instagram.com/flarize.technologies?igsh=MW0zZnJueG01Mm01bQ%3D%3D&utm_source=qr",
    "https://www.linkedin.com/company/flarize",
  ],
};


// Organization schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,

  name: "Flarize",
  legalName: "Flarize Technologies Pvt Ltd",

  url: `${SITE_URL}/`,

  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/logo_header.png`,
    caption: "Flarize",
  },

  description:
    "Solar installation company serving all 14 districts of Kerala. MNRE and KSEB registered vendor.",

  foundingDate: "2014",

  founder: {
    "@type": "Person",
    name: "Harikrishnan K.R",
  },

  areaServed: {
    "@type": "State",
    name: "Kerala",
    containedInPlace: {
      "@type": "Country",
      name: "India",
    },
  },

  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9995083579",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "ml"],
  },

  sameAs: [
    "https://www.linkedin.com/company/flarize-technologies-pvt-ltd/",
    "https://www.facebook.com/profile.php?id=61586953048937",
    "https://www.instagram.com/flarize.technologies",
    "https://www.youtube.com/@FlarizeSolarinstallation",
  ],
};


// FAQPage schema
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What maintenance is required for solar panels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minimal. Cleaning every 3–6 months and one annual check-up. Kerala's humidity and monsoon dust can reduce output, so regular cleaning matters — but it's not a big job. Flarize provides scheduled solar panel maintenance in Kerala, performance monitoring, and fast repairs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I run my home completely on solar power?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With the right system size and a hybrid or battery-backed setup, yes. Standard on-grid systems generate during daylight and offset nighttime usage via net metering. For full independence including power outages, you'd need battery storage. We assess your needs during the free consultation.",
      },
    },
    {
      "@type": "Question",
      name: "What is the lifespan of solar panels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "25+ years. Most quality panels retain 80–85% efficiency at year 25. Inverters typically last 10–15 years. Flarize installations use ALMM-approved panels and come with a 10-year comprehensive warranty covering panels, inverters, and workmanship.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to install a solar system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2–6 days for most residential systems. Golden Ray's team has done 300+ installations — the process is streamlined. Design, mounting, wiring, safety checks, and handover. We handle KSEB approval and net metering setup after installation.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cost of installing solar panels at home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 3kW system: ₹1.85–₹2.15 lakh before subsidy. After the ₹78,000 MNRE subsidy under PM Surya Ghar Yojana, net cost is approximately ₹1.1–₹1.4 lakh. Price varies by panel brand, inverter type, and roof type. Solar EMI options from ₹2,000/month.",
      },
    },
    {
      "@type": "Question",
      name: "How much can I save by switching to solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "60–85% reduction on your KSEB bill. For a 3kW system, expect bimonthly savings of ₹2,200–₹2,700. Kerala's telescopic tariff means cutting units with solar drops you into a lower rate slab — so you save twice.",
      },
    },
    {
      "@type": "Question",
      name: "What happens during a power outage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard on-grid systems shut down during outages — that's a safety requirement so linesmen aren't endangered. For uninterrupted power, a hybrid system with battery storage keeps essential loads running. We recommend the right setup during your free consultation.",
      },
    },
    {
      "@type": "Question",
      name: "Is the ₹78,000 subsidy available for commercial solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The PM Surya Ghar Yojana subsidy applies to on-grid residential systems only. Commercial and industrial installations don't qualify. However, businesses benefit from accelerated depreciation (40% in year one) and tax deductions that often deliver faster ROI than the residential subsidy.",
      },
    },
  ],
};


// BreadcrumbList — homepage breadcrumb
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://flarize.com",
    },
  ],
};


// Article (BlogPosting) schema generator
export const getArticleSchema = (post: {
  title: string;
  excerpt: string;
  updatedAt: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  dateModified: post.updatedAt,
  author: {
    "@type": "Person",
    name: "Flarize Solar Team",
  },
  publisher: {
    "@type": "Organization",
    name: "Flarize",
    logo: {
      "@type": "ImageObject",
      url: "https://flarize.com/logo_header.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://flarize.com/blog/${post.slug}`,
  },
});


// Blog breadcrumb schema generator
export const getBlogBreadcrumbSchema = (post: {
  title: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://flarize.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://flarize.com/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: `https://flarize.com/blog/${post.slug}`,
    },
  ],
});


// Residential Service schema
export const residentialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Residential Solar Panel Installation Kerala",
  provider: {
    "@type": "Organization",
    name: "Flarize",
  },
  serviceType: "Solar Panel Installation",
  areaServed: {
    "@type": "State",
    name: "Kerala",
  },
  description:
    "End-to-end residential solar installation in Kerala. KSEB approved, PM Surya Ghar subsidy processing, net metering setup.",
};


/* ------------------------------------------------------------------ */
/* Page-level @graph blocks                                            */
/*                                                                     */
/* One block per page, server-rendered into <head> by the page's JsonLD */
/* component. They reference the site-wide Organization node emitted in */
/* app/layout.tsx by @id rather than restating it.                      */
/* ------------------------------------------------------------------ */

/** Bump when the page's visible copy changes materially. */
const RESIDENTIAL_UPDATED = "2026-09-09";
const COMPARISON_UPDATED = "2026-09-09";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: "Flarize",
  publisher: { "@id": ORG_ID },
  inLanguage: "en-IN",
};

const keralaState = {
  "@type": "State",
  name: "Kerala",
  containedInPlace: { "@type": "Country", name: "India" },
};

// --- /residential ---------------------------------------------------

const RESIDENTIAL_URL = `${SITE_URL}/residential`;
const RESIDENTIAL_SERVICE_ID = `${RESIDENTIAL_URL}/#service`;

export const residentialPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    {
      "@type": "LocalBusiness",
      "@id": LOCAL_BUSINESS_ID,
      parentOrganization: { "@id": ORG_ID },
      name: "Flarize Solar",
      url: `${SITE_URL}/`,
      image: { "@id": LOGO_ID },
      telephone: "+91-6282922988",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1st Floor, Tharath Building, Kalappura",
        addressLocality: "Alappuzha",
        addressRegion: "Kerala",
        postalCode: "688007",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 9.4981,
        longitude: 76.3388,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      areaServed: KERALA_DISTRICTS.map((name) => ({ "@type": "City", name })),
      makesOffer: { "@id": RESIDENTIAL_SERVICE_ID },
    },
    {
      "@type": ["WebPage", "FAQPage"],
      "@id": `${RESIDENTIAL_URL}#webpage`,
      url: RESIDENTIAL_URL,
      name: "Solar Panel Price in Kerala 2026 | Home Solar with ₹78,000 Subsidy",
      description:
        "Real Kerala solar prices for 3kW, 5kW and 10kW home systems, including the ₹78,000 PM Surya Ghar subsidy, EMI options, KSEB net metering and a free site assessment.",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": RESIDENTIAL_SERVICE_ID },
      inLanguage: "en-IN",
      dateModified: RESIDENTIAL_UPDATED,
      breadcrumb: { "@id": `${RESIDENTIAL_URL}#breadcrumb` },
      mainEntity: faqEntities(residentialFaqs),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${RESIDENTIAL_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Solutions",
          item: `${SITE_URL}/solutions`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Residential Solar",
        },
      ],
    },
    {
      "@type": "Service",
      "@id": RESIDENTIAL_SERVICE_ID,
      name: "Residential Solar Panel Installation in Kerala",
      serviceType: "Residential rooftop solar installation",
      description:
        "Turnkey rooftop solar for Kerala homes: free site assessment, three reviewed proposals from pre-qualified installers, Tier 1 N-type panels, hot-dip GI mounting, KSEB net metering, PM Surya Ghar subsidy filing, milestone-based payment and a final engineer inspection.",
      provider: { "@id": ORG_ID },
      areaServed: keralaState,
      audience: {
        "@type": "Audience",
        audienceType: "Homeowners in Kerala",
      },
      termsOfService: `${SITE_URL}/terms`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Residential solar system sizes",
        itemListElement: residentialSystems.map((system) => ({
          "@type": "Offer",
          // "3kW On-Grid" → "3kW On-Grid Solar System"; "5kW System" stays as
          // it is rather than becoming "5kW System Solar System".
          name: /system$/i.test(system.title)
            ? system.title
            : `${system.title} Solar System`,
          description: `${system.summary}. Price shown before the ₹${PM_SURYA_GHAR_SUBSIDY.toLocaleString("en-IN")} PM Surya Ghar subsidy.`,
          priceCurrency: "INR",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "INR",
            minPrice: system.priceMin,
            maxPrice: system.priceMax,
            valueAddedTaxIncluded: true,
          },
          availability: "https://schema.org/InStock",
          areaServed: { "@type": "State", name: "Kerala" },
          seller: { "@id": ORG_ID },
        })),
      },
      potentialAction: {
        "@type": "ReserveAction",
        name: "Book a free site assessment",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/contactus`,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
      },
    },
  ],
};

// --- /solar-comparison (comparison hub) -----------------------------

const COMPARISON_HUB_URL = `${SITE_URL}/solar-comparison`;
const COMPARISON_TABLE_URL = `${SITE_URL}/comparison-table`;

/** Stable @id for a panel, so the hub's ItemList and the table's Product
 *  nodes describe the same entity. */
const panelId = (panel: SolarPanel) =>
  `${COMPARISON_TABLE_URL}#panel-${panel.id}`;

export const solarComparisonPageSchema = (panels: SolarPanel[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    {
      "@type": ["CollectionPage", "FAQPage"],
      "@id": `${COMPARISON_HUB_URL}#webpage`,
      url: COMPARISON_HUB_URL,
      name: "Best Solar Panels for Kerala 2026 | Compare Specs & Ratings",
      description:
        "Compare solar panels rated for Kerala's heat, humidity and monsoon. Filter by efficiency, warranty and brand, or answer 3 questions for a personal pick.",
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: "en-IN",
      dateModified: COMPARISON_UPDATED,
      breadcrumb: { "@id": `${COMPARISON_HUB_URL}#breadcrumb` },
      mainEntity: faqEntities(solarComparisonFaqs),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${COMPARISON_HUB_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare Solar Panels",
        },
      ],
    },
    // Built from the same API response the grid renders, so the list can never
    // claim panels the page doesn't show.
    ...(panels.length
      ? [
          {
            "@type": "ItemList",
            "@id": `${COMPARISON_HUB_URL}#panellist`,
            name: "Solar panels rated for Kerala conditions",
            numberOfItems: panels.length,
            itemListElement: panels.map((panel, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: panel.name || `${panel.brand} ${panel.wattage}W`,
              item: panelId(panel),
            })),
          },
        ]
      : []),
  ],
});

// --- /comparison-table ----------------------------------------------

/** Product node for one panel, built entirely from the values the comparison
 *  table renders — never hand-written, so markup and table cannot disagree. */
const panelProductNode = (panel: SolarPanel) => ({
  "@type": "Product",
  "@id": panelId(panel),
  name: panel.name || `${panel.brand} ${panel.type} ${panel.wattage}W`,
  ...(panel.imageUrl ? { image: panel.imageUrl } : {}),
  description: panel.description,
  brand: { "@type": "Brand", name: panel.brand },
  category: "Photovoltaic solar panel",
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Rated power",
      value: String(panel.wattage),
      unitCode: "WTT",
    },
    {
      "@type": "PropertyValue",
      name: "Module efficiency",
      value: String(panel.efficiency),
      unitCode: "P1",
    },
    {
      "@type": "PropertyValue",
      name: "Temperature coefficient of Pmax",
      value: `${panel.temperatureCoefficient} %/°C`,
    },
    {
      "@type": "PropertyValue",
      name: "Cell technology",
      value: panel.technology,
    },
    { "@type": "PropertyValue", name: "Panel type", value: panel.type },
    ...(panel.bifacialGain
      ? [
          {
            "@type": "PropertyValue",
            name: "Bifacial gain",
            value: `Up to ${panel.bifacialGain}%`,
          },
        ]
      : []),
    {
      "@type": "PropertyValue",
      name: "Product warranty",
      value: `${panel.productWarranty} years`,
    },
    {
      "@type": "PropertyValue",
      name: "Performance warranty",
      value: `${panel.performanceWarranty} years`,
    },
    {
      "@type": "PropertyValue",
      name: "First-year degradation",
      value: `≤${panel.firstYearPowerDrop}%`,
    },
    {
      "@type": "PropertyValue",
      name: "Annual degradation",
      value: `≤${panel.annualDegradation}%`,
    },
    {
      "@type": "PropertyValue",
      name: "Ingress protection",
      value: panel.ipRating,
    },
    ...(panel.certifications.length
      ? [
          {
            "@type": "PropertyValue",
            name: "Certifications",
            value: panel.certifications.join(", "),
          },
        ]
      : []),
    {
      "@type": "PropertyValue",
      name: "Kerala Climate Score",
      value: `${panel.keralaClimateScore}/100`,
    },
  ],
});

export const comparisonTablePageSchema = (selectedPanels: SolarPanel[]) => {
  const isComparing = selectedPanels.length >= 2;
  const headline = isComparing
    ? `${selectedPanels.map((p) => p.brand).join(" vs ")}: Solar Panel Spec Comparison`
    : "Solar Panel Comparison Table for Kerala Homes";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // FAQPage only when the table is actually rendering the FAQ block —
        // it is hidden until two panels are selected.
        "@type": isComparing ? ["WebPage", "FAQPage"] : "WebPage",
        "@id": `${COMPARISON_TABLE_URL}#webpage`,
        url: COMPARISON_TABLE_URL,
        name: headline,
        description:
          "Compare solar panels side by side on efficiency, heat performance, warranty depth, certifications and Kerala Climate Score, from manufacturer datasheet figures.",
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en-IN",
        dateModified: COMPARISON_UPDATED,
        breadcrumb: { "@id": `${COMPARISON_TABLE_URL}#breadcrumb` },
        ...(isComparing
          ? { mainEntity: faqEntities(solarComparisonFaqs) }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${COMPARISON_TABLE_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Compare Solar Panels",
            item: COMPARISON_HUB_URL,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Comparison Table",
          },
        ],
      },
      ...selectedPanels.map((panel) => {
        const others = selectedPanels.filter((other) => other.id !== panel.id);
        return {
          ...panelProductNode(panel),
          ...(others.length
            ? { isSimilarTo: others.map((other) => ({ "@id": panelId(other) })) }
            : {}),
        };
      }),
    ],
  };
};


// Commercial Service schema
export const commercialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Commercial Solar Panel Installation Kerala",
  provider: {
    "@type": "Organization",
    name: "Flarize",
  },
  serviceType: "Commercial Solar EPC",
  areaServed: {
    "@type": "State",
    name: "Kerala",
  },
  description:
    "Commercial solar installation for offices, hospitals, schools, retail in Kerala. Accelerated depreciation and KSEB grid integration.",
};


// Solar Referral Program Service schema
export const solarReferralServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://flarize.com/solar-referral-program/#service",
  name: "Flarize Solar Referral Program",
  serviceType: "Solar Referral Partner Program",
  description:
    "A referral partner program for Kerala. Introduce a homeowner or business to Flarize and earn a fixed commission on every completed solar installation. No investment, no solar expertise required.",

  provider: {
    "@id": "https://flarize.com/#organization",
  },

  areaServed: {
    "@type": "State",
    name: "Kerala",
    containedInPlace: {
      "@type": "Country",
      name: "India",
    },
  },

  audience: {
    "@type": "Audience",
    audienceType:
      "Electricians, real estate agents, builders, content creators, RWA representatives and existing solar owners in Kerala",
  },

  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    description:
      "Fixed commission per completed solar installation, credited within 7-14 business days",
    eligibleRegion: {
      "@type": "State",
      name: "Kerala",
    },
  },
};

// Solar Referral Program breadcrumb schema
export const solarReferralBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://flarize.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Solar Referral Program",
      item: "https://flarize.com/solar-referral-program",
    },
  ],
};

// Solar Referral Program FAQ schema
export const solarReferralFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "I already installed solar with Flarize — can I earn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — you're our most valued partner. Existing Flarize owners join as Advisor Partners, refer neighbours and friends, and earn rewards for every home that goes solar on your word.",
      },
    },
    {
      "@type": "Question",
      name: "How do I earn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You introduce a homeowner or business to Flarize. We handle consultation, design, paperwork, KSEB and installation. When the system is installed successfully, a fixed commission is credited to your partner account.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get paid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commission is credited after the installation is completed and verified. Your dashboard shows the exact status and next payout date for every referral.",
      },
    },
    {
      "@type": "Question",
      name: "How are referrals tracked?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You get a unique tracking link, and referrals shared directly with your partner manager are also logged. Every lead is timestamped through submission, site visit, installation and payout — visible to you in real time.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if a customer cancels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You only earn on completed installations, so a cancellation simply means no commission for that lead — no penalty, no clawback. Your other referrals are unaffected.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need any solar knowledge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "None. Our team handles every technical conversation, quote and approval. Your only job is the introduction and the trust you already have with your network.",
      },
    },
    {
      "@type": "Question",
      name: "Can influencers and creators join?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Creator partners get a tracking link and ready-to-use content. You earn on completed installations from your audience — not on clicks, views or impressions.",
      },
    },
    {
      "@type": "Question",
      name: "Can electricians, builders and agents join?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely — they're core partners. Solar fits naturally into electrical work, property handovers and design conversations, and you earn without changing your workflow.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum target?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. There's no quota and no pressure. Refer one home a year or ten a month — you earn the same fixed rate on each successful installation.",
      },
    },
    {
      "@type": "Question",
      name: "Can I refer customers outside my district?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Flarize installs across all 14 Kerala districts, so any qualified referral within Kerala can convert regardless of where you or the homeowner are based.",
      },
    },
    {
      "@type": "Question",
      name: "How does Flarize support partners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every partner gets a dedicated relationship manager, a live tracking dashboard, ready-made referral content, and full handling of consultation, paperwork, KSEB, warranty and after-sales — so the customer experience reflects well on you.",
      },
    },
  ],
};