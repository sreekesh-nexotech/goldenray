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
  const [stats, setStats] = useState<InstallationSummary | undefined>();

  useEffect(() => {
    // Generated once on mount: re-deriving it every render would change the
    // quote number on screen each time React re-renders the document.
    setQuoteNo(generateQuoteNo());

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
    () => (input && quoteNo ? buildQuotationV2Data(input, { quoteNo, stats }) : null),
    [input, quoteNo, stats],
  );

  // Overlay the backend's real neighbourhood install counts once they arrive.
  useEffect(() => {
    if (!data || stats) return;
    let cancelled = false;
    resolveInstallationStats(data.pincode, data.stats).then((resolved) => {
      if (!cancelled) setStats(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [data, stats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123532]"></div>
      </div>
    );
  }

  if (!data) return null;

  return <QuotationV2Document data={data} />;
}
