import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

type TeamMemberProps = {
  name: string;
  title: string;
  description?: string;
  linkedin?: string;
  twitter?: string;
  imageUrl?: string;
};

export default function TeamMember({
  name,
  title,
  description,
  linkedin,
  twitter,
  imageUrl,
}: TeamMemberProps) {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      {/* Photo */}
      <div className="relative w-full aspect-square bg-gray-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#2D3748] mb-1">
          {name}
        </h3>

        <p className="text-sm font-medium text-indigo-600 mb-2">{title}</p>

        {description && (
          <p className="text-sm text-[#666666] leading-relaxed mb-4">
            {description}
          </p>
        )}

        {(linkedin || twitter) && (
          <Link
            href={linkedin || twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
          >
            <Linkedin size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
