import React from "react";
import Image from "next/image";
import Link from "next/link";

type TeamMemberProps = {
  name: string;
  title: string;
  description?: string;
  linkedin?: string;
  twitter?: string;
  imageUrl?: string;
  imageScale?: number;
};

export default function TeamMember({
  name,
  title,
  description,
  linkedin,
  twitter,
  imageUrl,
  imageScale = 1,
}: TeamMemberProps) {
  return (
    <div className="flex flex-row bg-white rounded-lg overflow-hidden">
      {/* Image Container - Left Side */}
      <div className="w-1/2 flex-shrink-0 overflow-hidden max-h-[250px]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={300}
            height={250}
            className="w-full h-full object-cover"
            style={{ transform: `scale(${imageScale})` }}
          />
        )}
      </div>

      {/* Content Container - Right Side */}
      <div className="flex flex-col justify-center items-start p-3 md:p-4 flex-1">
        {/* Name */}
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#2D3748] mb-1 uppercase">
          {name}
        </h3>

        {/* Title/Role */}
        <p className="text-xs md:text-sm lg:text-base text-[#F7BA41] font-bold uppercase mb-3">
          {title}
        </p>

        {/* Description if provided */}
        {description && (
          <p className="text-xs md:text-sm text-[#666666] mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* LinkedIn Button */}
        {(linkedin || twitter) && (
          <Link
            href={linkedin || twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm border-2 border-[#074A4D] text-[#074A4D] rounded-lg font-semibold hover:bg-[#074A4D] hover:text-white transition-colors duration-300"
          >
            LinkedIn →
          </Link>
        )}
      </div>
    </div>
  );
}
