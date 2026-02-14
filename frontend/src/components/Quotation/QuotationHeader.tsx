"use client";

import Image from "next/image";

interface QuotationHeaderProps {
  logo: string;
}

export default function QuotationHeader({ logo }: QuotationHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Image
        src={logo}
        alt="Flarize Logo"
        width={80}
        height={30}
        className="h-5 w-auto object-contain"
      />
      <span className="text-xs text-gray-500">by Golden Ray</span>
    </div>
  );
}
