/**
 * Page 6 of the quotation: three customer testimonials.
 *
 * They are kept by admin in the Django BOM app (Django admin → Quotation
 * testimonials; public read at /bom/api/quotation-testimonials/, see
 * services/quotationTestimonialsService.ts). The website's quotation shows the
 * first three active ones. When the library cannot be reached the page falls
 * back to the three testimonials it was designed with — the same ones the
 * library is seeded with — so a quotation always renders.
 */

/** One row of the Django library, as the public API returns it. */
export interface TestimonialEntry {
  name: string;
  location: string;
  system_label: string;
  /** "YYYY-MM-DD"; only month and year are printed. */
  installed_on: string;
  quote: string;
  quote_ml: string;
  /** Uploaded photo, configured URL, or the stock photo. */
  photo_src: string;
  bill_before: number;
  bill_after: number;
}

/** What one page-6 card prints. */
export interface TestimonialCard {
  /** Null keeps the design's stock photo. */
  image: string | null;
  nameLine: string;
  /** Px; shrinks for long names so the caption stays on one line. */
  nameFontSize: number;
  systemLine: string;
  quote: string;
  before: string;
  after: string;
  saves: string;
}

export const TESTIMONIAL_COUNT = 3;

export const FALLBACK_TESTIMONIALS: TestimonialEntry[] = [
  {
    name: "Jose V P",
    location: "Vadakkal, Alappuzha",
    system_label: "5 kW System",
    installed_on: "2025-06-01",
    quote: "The solar panel installation process was smooth from the very beginning. The team clearly explained each stage—from understanding our energy needs to system design, installation, and final activation. All timelines were communicated in advance, and the execution stayed on track without unnecessary delays. The overall experience felt well-planned and dependable.",
    quote_ml: "തുടക്കം മുതൽ അവസാനം വരെ മുഴുവൻ പ്രക്രിയയും വളരെ സുഗമമായിരുന്നു. ഞങ്ങളുടെ ആവശ്യങ്ങൾ മനസ്സിലാക്കി ശരിയായ സിസ്റ്റം നിർദേശിക്കുകയും എല്ലാ കാര്യങ്ങളും സമയബന്ധിതമായി പൂർത്തിയാക്കുകയും ചെയ്തു. ടീമിന്റെ സമീപനവും സേവനവും വളരെ മികച്ചതായിരുന്നു.",
    photo_src: "",
    bill_before: 3200,
    bill_after: 200,
  },
  {
    name: "Siraj K P",
    location: "Cherthala, Alappuzha",
    system_label: "5 kW System",
    installed_on: "2025-03-01",
    quote: "Our commercial solar installation brought better predictability to our monthly power expenses. The team maintained transparent communication throughout the project and handled the technical and approval processes professionally. The transition to solar was structured, efficient, and free from operational disruption, which made the decision feel reassuring.",
    quote_ml: "സോളാർ സ്ഥാപിച്ചതോടെ ഞങ്ങളുടെ വൈദ്യുതി ചെലവുകൾ കൂടുതൽ നിയന്ത്രണവിധേയമായി. എല്ലാ ഘട്ടങ്ങളിലും വ്യക്തമായ വിവരങ്ങൾ ലഭിച്ചു. KSEB നടപടികളും സാങ്കേതിക കാര്യങ്ങളും ടീം വളരെ പ്രൊഫഷണലായി കൈകാര്യം ചെയ്തു.",
    photo_src: "",
    bill_before: 3200,
    bill_after: 200,
  },
  {
    name: "Stephen V C",
    location: "Vattayal, Alappuzha",
    system_label: "5 kW System",
    installed_on: "2024-05-01",
    quote: "What stood out most was the honest guidance we received on system capacity and realistic expectations around savings. The team took time to explain what would work best for our usage rather than overselling. From planning to completion, the project felt reliable, transparent, and well managed.",
    quote_ml: "വിൽപ്പനയ്ക്കായി അധിക വാഗ്ദാനങ്ങൾ നൽകാതെ, ഞങ്ങൾക്ക് യഥാർത്ഥത്തിൽ അനുയോജ്യമായ സിസ്റ്റം നിർദേശിച്ചതാണ് ഏറ്റവും ഇഷ്ടപ്പെട്ടത്. പ്ലാനിംഗ് മുതൽ ഇൻസ്റ്റലേഷൻ വരെ മുഴുവൻ പ്രക്രിയയും സുതാര്യവും വിശ്വസ്തതയുള്ളതുമായിരുന്നു.",
    photo_src: "",
    bill_before: 3200,
    bill_after: 200,
  },
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_ML = [
  "ജനുവരി", "ഫെബ്രുവരി", "മാർച്ച്", "ഏപ്രിൽ", "മേയ്", "ജൂൺ",
  "ജൂലൈ", "ഓഗസ്റ്റ്", "സെപ്റ്റംബർ", "ഒക്ടോബർ", "നവംബർ", "ഡിസംബർ",
];

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/**
 * The name caption sits on the photo in a fixed ~350px box on one line, which
 * fits about 30 characters at the design's 20px. Longer "Name - Place" lines
 * are set smaller instead of wrapping into the "Installed on" line below.
 */
function captionFontSize(text: string): number {
  return Math.max(14, Math.min(20, Math.floor((20 * 30) / Math.max(1, text.length))));
}

export function buildTestimonialCards(
  entries: TestimonialEntry[] | undefined,
  language: "English" | "Malayalam",
): TestimonialCard[] {
  const malayalam = language === "Malayalam";
  const picked = (entries && entries.length ? entries : FALLBACK_TESTIMONIALS).slice(0, TESTIMONIAL_COUNT);
  // Fewer than three in the library: fill from the fallback so the grid stays whole.
  for (let i = picked.length; i < TESTIMONIAL_COUNT; i++) picked.push(FALLBACK_TESTIMONIALS[i]);

  return picked.map((e) => {
    const before = Math.max(0, Number(e.bill_before) || 0);
    const after = Math.max(0, Number(e.bill_after) || 0);
    const saving = Math.max(0, before - after);
    const m = /^(\d{4})-(\d{2})/.exec(e.installed_on || "");
    const month = m ? (malayalam ? MONTHS_ML : MONTHS_EN)[Number(m[2]) - 1] : "";
    return {
      image: e.photo_src || null,
      nameLine: `${e.name} - ${e.location}`,
      nameFontSize: captionFontSize(`${e.name} - ${e.location}`),
      systemLine: m ? `${e.system_label} | Installed on ${month} ${m[1]}` : e.system_label,
      quote: (malayalam && e.quote_ml) || e.quote,
      before: rupees(before),
      after: rupees(after),
      saves: malayalam ? `പ്രതിമാസ ലാഭം ${rupees(saving)}` : `Saves ${rupees(saving)}/mo`,
    };
  });
}
