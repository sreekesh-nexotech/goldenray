"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { pageview } from "@/utils/gtm";

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.toString()
      ? `${pathname}?${searchParams}`
      : pathname;

    pageview(url);
  }, [pathname, searchParams]);

  return null;
}