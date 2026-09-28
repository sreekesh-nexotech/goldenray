"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { QuotationV2Document } from "@/components/QuotationV2";
import {
  buildQuotationV2Data,
  generateQuoteNo,
  resolveInstallationStats,
  type InstallationSummary,
  type QuotationV2Input,
} from "@/components/QuotationV2/quotationV2Data";
import { sampleQuotationData } from "@/components/Quotation/sampleQuotationData";
import {
  packagePrices,
  type QuotationDocumentSettings,
  type QuotationFinancing,
} from "@/components/QuotationV2/financing";
import { getQuotationFinancing } from "@/services/quotationEmiService";
import { getQuotationTestimonials } from "@/services/quotationTestimonialsService";
import type { TestimonialEntry } from "@/components/QuotationV2/testimonials";
import { pageIdsFor, parseVariant } from "@/components/QuotationV2/pageSets";
import { withTimeout } from "@/lib/withTimeout";
import { getQuotationSettings } from "@/services/quotationSettingsService";

/**
 * On-screen view of the redesigned quotation.
 *
 * Reads the same `quotationData` the customer details form writes to
 * sessionStorage as the v1 page does, and falls back to the sample quote in
 * development so the document can be opened directly while iterating.
 */
export default function QuotationV2View() {
  const router = useRouter();
  const [input, setInput] = useState<QuotationV2Input | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteNo, setQuoteNo] = useState("");
  // `?variant=accounting` renders the Studio's short accounting copy (pages 1,
  // 5, 7, 8) instead of all twelve pages.
  const [pageIds, setPageIds] = useState<readonly string[] | undefined>();
  const [stats, setStats] = useState<InstallationSummary | undefined>();
  // Admin's EMI rates and offer banner. The document waits for them (they
  // change printed figures) and falls back to defaults if the backend is down.
  const [settings, setSettings] = useState<QuotationDocumentSettings | null>(null);

  // EMI figures from the /emi-calculator engine, for this customer's prices.
  const [financing, setFinancing] = useState<QuotationFinancing | null>(null);

  useEffect(() => {
    if (!input) return;
    let cancelled = false;
    getQuotationFinancing(packagePrices(input)).then((f) => {
      if (!cancelled) setFinancing(f);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  // Page 6 testimonials from the Django BOM library.
  const [testimonials, setTestimonials] = useState<TestimonialEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuotationTestimonials().then((rows) => {
      if (!cancelled) setTestimonials(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getQuotationSettings().then((s) => {
      if (!cancelled) setSettings(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Generated once on mount: re-deriving it every render would change the
    // quote number on screen each time React re-renders the document.
    setQuoteNo(generateQuoteNo());
    setPageIds(
      pageIdsFor(parseVariant(new URLSearchParams(window.location.search).get("variant"))),
    );

    const storedData = sessionStorage.getItem("quotationData");
    if (storedData) {
      setInput(JSON.parse(storedData));
    } else if (process.env.NODE_ENV !== "production") {
      setInput(sampleQuotationData);
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  const data = useMemo(
    () => (input && quoteNo && settings && financing && testimonials ? buildQuotationV2Data(input, { quoteNo, stats, settings, financing, testimonials }) : null),
    [input, quoteNo, stats, settings, financing, testimonials],
  );

  // Overlay the backend's real neighbourhood install counts once they arrive.
  useEffect(() => {
    if (!data || stats) return;
    let cancelled = false;
    // Capped: a slow stats lookup falls back to the pincode estimate rather
    // than holding up the document (and the server-side PDF).
    withTimeout(resolveInstallationStats(data.pincode, data.stats), 8000, data.stats).then((resolved) => {
      if (!cancelled) setStats(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [data, stats]);

  // The PDF route prints once this is set: the document is built and the
  // neighbourhood stats have settled (real or fallback). Waiting for this,
  // rather than for the network to go quiet, means a stray request that
  // never finishes (analytics, say) cannot block the PDF.
  useEffect(() => {
    if (data && stats) document.documentElement.dataset.quotationReady = "1";
  }, [data, stats]);

  if (loading || !settings || !testimonials || (input && !financing)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123532]"></div>
      </div>
    );
  }

  if (!data) return null;

  return <QuotationV2Document data={data} pageIds={pageIds} />;
}
