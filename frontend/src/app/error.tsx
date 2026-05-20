"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E8]">
          <AlertTriangle className="h-8 w-8 text-[#F7BA41]" strokeWidth={2.25} />
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-[#123532] mb-4 leading-tight">
          Something went wrong
        </h1>

        <p className="text-base md:text-lg text-[#444444] leading-relaxed mb-8">
          We hit an unexpected problem while loading this page. Please try again,
          or head back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link
            href="/"
            className="px-8 py-3 border border-[#074A4D] text-[#074A4D] font-semibold rounded-lg hover:bg-[#074A4D] hover:text-white transition-colors duration-200 text-center"
          >
            Go to homepage
          </Link>
        </div>

        {process.env.NODE_ENV !== "production" && error?.message && (
          <pre className="mt-8 text-left text-xs text-[#666666] bg-[#F7F7F2] rounded-lg p-4 overflow-x-auto">
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>
        )}
      </div>
    </main>
  );
}
