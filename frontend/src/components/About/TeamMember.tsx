import React from "react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

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
  // Determine which social link to show (default to LinkedIn if both are provided)
  const socialLink = linkedin
    ? { platform: "LinkedIn", url: linkedin }
    : twitter
    ? { platform: "Twitter", url: twitter }
    : null;

  return (
    <div className="relative flex gap-4 md:gap-0  md:flex-col items-start text-left md:text-center md:items-center mb-4">
      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={100}
            height={100}
            className="w-full h-full rounded-full object-cover"
            style={{ transform: `scale(${imageScale})` }}
          />
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold text-[#444444]">{name}</h2>
        <p className="text-sm text-[#ED8723] mb-2 uppercase">{title}</p>
        {description && (
          <div className="h-full">
            <p className="text-base text-[#666666] mb-8">{description}</p>
          </div>
        )}
        {socialLink && (
          <div>
            <LinkingButton
              content={`${socialLink.platform} ➝`}
              ButtonLink={socialLink.url}
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
