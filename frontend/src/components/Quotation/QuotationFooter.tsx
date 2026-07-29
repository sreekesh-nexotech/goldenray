"use client";

import Image from "next/image";

interface QuotationFooterProps {
  logo: string;
}

export default function QuotationFooter({ logo }: QuotationFooterProps) {
  return (
    <div
      className="border-t border-gray-200 pt-2 mt-auto w-auto bg-[#FFF8E9] px-4"
      style={{
        marginLeft: "-10mm",
        marginRight: "-10mm",
        marginBottom: "-8mm",
        paddingBottom: "8mm",
      }}
    >
      <div className="flex items-center justify-between text-[9px] text-gray-600">
        <div className="flex items-center gap-1">
          <Image
            src={logo}
            alt="Flarize Logo"
            width={60}
            height={24}
            className="h-5 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Thannikakal, Thumpoly PO, Alappuzha– 688008</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>www.flarize.com</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>sales@flarize.com</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>+91 9995 073 579</span>
        </div>
      </div>
    </div>
  );
}
