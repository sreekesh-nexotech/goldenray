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
  const isQuotationPage = pathname === "/quotation";

  useEffect(() => {
    // Adjust body padding based on page
    const body = document.body;
    if (isQuotationPage) {
      body.style.paddingTop = "0";
    } else {
      body.style.paddingTop = "";
    }
  }, [isQuotationPage]);

  if (isQuotationPage) {
    // For quotation page, render only the children without header/footer
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
