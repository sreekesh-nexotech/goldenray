

// LocalBusiness schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Flarize Solar',
  alternateName: 'Golden Ray Renewable Energy',
  url: 'https://flarize.com',
  logo: 'https://flarize.com/logo_header.png', 
  description: 'Kerala-based solar EPC company. KSEB-approved, MNRE-empanelled. 300+ installations across Kerala.',
  telephone: '+91-6282922988',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1st Floor, Tharath Building, Kalappura',
    addressLocality: 'Alappuzha',
    addressRegion: 'Kerala',
    postalCode: '688007',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 9.4981, longitude: 76.3388 },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '300',
  },
  sameAs: [
    'https://www.facebook.com/flarize', // UPDATE with real URLs
    'https://www.instagram.com/flarize.technologies?igsh=MW0zZnJueG01Mm01bQ%3D%3D&utm_source=qr',
    'https://www.linkedin.com/company/flarize',
  ],
};

// Organization schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flarize Technologies Private Limited',
  url: 'https://flarize.com',
  logo: 'https://flarize.com/logo_header.png',
  foundingDate: '2014',
  areaServed: { '@type': 'State', name: 'Kerala, India' },
};

// FAQPage schema — map your actual FAQ questions/answers here
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What maintenance is required for solar panels?',
      acceptedAnswer: { '@type': 'Answer', text: "Minimal. Cleaning every 3–6 months and one annual check-up. Kerala's humidity and monsoon dust can reduce output, so regular cleaning matters — but it's not a big job. Flarize provides scheduled solar panel maintenance in Kerala, performance monitoring, and fast repairs." },
    },
    {
      '@type': 'Question',
      name: 'Can I run my home completely on solar power?',
      acceptedAnswer: { '@type': 'Answer', text: "With the right system size and a hybrid or battery-backed setup, yes. Standard on-grid systems generate during daylight and offset nighttime usage via net metering. For full independence including power outages, you'd need battery storage. We assess your needs during the free consultation." },
    },
    {
      '@type': 'Question',
      name: 'What is the lifespan of solar panels?',
      acceptedAnswer: { '@type': 'Answer', text: "25+ years. Most quality panels retain 80–85% efficiency at year 25. Inverters typically last 10–15 years. Flarize installations use ALMM-approved panels and come with a 10-year comprehensive warranty covering panels, inverters, and workmanship." },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to install a solar system?',
      acceptedAnswer: { '@type': 'Answer', text: "2–6 days for most residential systems. Golden Ray's team has done 300+ installations — the process is streamlined. Design, mounting, wiring, safety checks, and handover. We handle KSEB approval and net metering setup after installation." },
    },
    {
      '@type': 'Question',
      name: 'What is the cost of installing solar panels at home?',
      acceptedAnswer: { '@type': 'Answer', text: "A 3kW system: ₹1.85–₹2.15 lakh before subsidy. After the ₹78,000 MNRE subsidy under PM Surya Ghar Yojana, net cost is approximately ₹1.1–₹1.4 lakh. Price varies by panel brand, inverter type, and roof type. Solar EMI options from ₹2,000/month." },
    },
    {
      '@type': 'Question',
      name: 'How much can I save by switching to solar?',
      acceptedAnswer: { '@type': 'Answer', text: "60–85% reduction on your KSEB bill. For a 3kW system, expect bimonthly savings of ₹2,200–₹2,700. Kerala's telescopic tariff means cutting units with solar drops you into a lower rate slab — so you save twice." },
    },
    {
      '@type': 'Question',
      name: 'What happens during a power outage?',
      acceptedAnswer: { '@type': 'Answer', text: "Standard on-grid systems shut down during outages — that's a safety requirement so linesmen aren't endangered. For uninterrupted power, a hybrid system with battery storage keeps essential loads running. We recommend the right setup during your free consultation." },
    },
    {
      '@type': 'Question',
      name: 'Is the ₹78,000 subsidy available for commercial solar?',
      acceptedAnswer: { '@type': 'Answer', text: "No. The PM Surya Ghar Yojana subsidy applies to on-grid residential systems only. Commercial and industrial installations don't qualify. However, businesses benefit from accelerated depreciation (40% in year one) and tax deductions that often deliver faster ROI than the residential subsidy." },
    },
  ],
};

// BreadcrumbList — homepage breadcrumb
export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flarize.com' },
  ],
};



// Article (BlogPosting) schema generator
export const getArticleSchema = (post: {
  title: string;
  excerpt: string;
  updatedAt: string;
  slug: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: 'Flarize Solar Team', // UPDATE when author bylines are added
  },
  publisher: {
    '@type': 'Organization',
    name: 'Flarize',
    logo: { '@type': 'ImageObject', url: 'https://flarize.com/logo_header.png' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://flarize.com/blog/${post.slug}` },
});

// Blog breadcrumb schema generator
export const getBlogBreadcrumbSchema = (post: { title: string; slug: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flarize.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://flarize.com/blog' },
    { '@type': 'ListItem', position: 3, name: post.title, item: `https://flarize.com/blog/${post.slug}` },
  ],
});

// Residential Service schema
export const residentialServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Residential Solar Panel Installation Kerala',
  provider: { '@type': 'Organization', name: 'Flarize' },
  serviceType: 'Solar Panel Installation',
  areaServed: { '@type': 'State', name: 'Kerala' },
  description:
    'End-to-end residential solar installation in Kerala. KSEB approved, PM Surya Ghar subsidy processing, net metering setup.',
};

// Commercial Service schema
export const commercialServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Commercial Solar Panel Installation Kerala',
  provider: { '@type': 'Organization', name: 'Flarize' },
  serviceType: 'Commercial Solar EPC',
  areaServed: { '@type': 'State', name: 'Kerala' },
  description:
    'Commercial solar installation for offices, hospitals, schools, retail in Kerala. Accelerated depreciation and KSEB grid integration.',
};