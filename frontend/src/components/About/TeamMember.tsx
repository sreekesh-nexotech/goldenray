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
    <div className="flex flex-row items-center bg-white gap-6">
      {/* Circular Image Container - Left Side */}
      <div className="relative flex-shrink-0">
        <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-[#F7BA41] to-[#E6A835] p-2 shadow-lg">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </div>

      {/* Content Container - Right Side */}
      <div className="flex flex-col justify-center items-start flex-1">
        {/* Name */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2D3748] mb-2 uppercase tracking-wide">
          {name}
        </h3>

        {/* Title/Role */}
        <p className="text-sm md:text-base text-[#F7BA41] font-bold uppercase mb-4 tracking-wider">
          {title}
        </p>

        {/* Description if provided */}
        {description && (
          <p className="text-sm text-[#666666] mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* LinkedIn Button */}
        {(linkedin || twitter) && (
          <Link
            href={linkedin || twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm border-2 border-[#074A4D] text-[#074A4D] rounded-lg font-semibold hover:bg-[#074A4D] hover:text-white transition-colors duration-300"
          >
            LinkedIn →
          </Link>
        )}
      </div>
    </div>
  );
}
