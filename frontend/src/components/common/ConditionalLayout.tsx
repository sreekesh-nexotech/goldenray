"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import IdleTimeoutPopup from "@/components/common/IdleTimoutPopup";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";
import FloatingChatButton from "@/components/common/FloatingChatBoat";
import FloatingPhoneButton from "@/components/common/FloatingPhoneButton";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isQuotationPage =
    pathname === "/quotation" || (pathname?.startsWith("/quotation/") ?? false);
  // The Content Studio (blog CMS) renders its own full-screen chrome.
  const isStudioPage = pathname?.startsWith("/studio") ?? false;
  const isStandalone = isQuotationPage || isStudioPage;

  useEffect(() => {
    // Adjust body padding based on page
    const body = document.body;
    if (isStandalone) {
      body.style.paddingTop = "0";
    } else {
      body.style.paddingTop = "";
    }
  }, [isStandalone]);

  if (isStandalone) {
    // Standalone surfaces render only the children — no marketing header/footer.
    return <>{children}</>;
  }

  // For all other pages, render with header, footer, and floating components
  return (
    <>
      <Header />
      {children}
      <Footer />
      <IdleTimeoutPopup />
      <ExitIntentPopup />
      <FloatingPhoneButton />
      <FloatingChatButton />
    </>
  );
}
