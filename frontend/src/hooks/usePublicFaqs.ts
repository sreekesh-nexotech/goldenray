"use client";

// src/hooks/usePublicFaqs.ts
//
// Bridges the Studio's FAQ module (§6.4) to the site's existing accordions.
// Each FAQ component keeps the questions it shipped with as `fallback`; once
// the CMS holds published FAQs for the page, those replace the fallback. Until
// then — and whenever the CMS is unreachable — the page reads exactly as it
// did before, so wiring a page up never blanks its FAQ block.
//
// The page is the current pathname unless a `route` is given: several of the
// accordions are reused across routes (the home FAQ also renders on
// /solutions), and "the FAQs for the page I am on" is what an editor
// associating a question to a page expects to see.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchPublicFaqs } from "@/services/publicCmsService";

export interface FaqItem {
  question: string;
  answer: string;
}

export function usePublicFaqs<T extends FaqItem>(
  fallback: T[],
  opts: { route?: string; section?: string } = {}
): FaqItem[] {
  const pathname = usePathname() || "/";
  const route = opts.route ?? pathname;
  const section = opts.section;
  const [faqs, setFaqs] = useState<FaqItem[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    fetchPublicFaqs(route, section).then((res) => {
      if (cancelled || !res || res.data.length === 0) return;
      setFaqs(res.data.map((f) => ({ question: f.question, answer: f.answer })));
    });
    return () => {
      cancelled = true;
    };
    // `fallback` is a literal array on every render; only the route/section
    // decide what is fetched.
  }, [route, section]);

  return faqs;
}
