"use client";

import Image from "next/image";
import { HandCoins, Home, BadgeCheck } from "lucide-react";
import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";

// Import certification logos
// import logo1 from "../../../public/image-33.png";
// import logo2 from "../../../public/image-36.png";
// import logo3 from "../../../public/image-34.png";
// import logo4 from "../../../public/image-37.png";
// import logo5 from "../../../public/image-32.png";

const SIGN_IMAGE =
  "https://golden-ray.b-cdn.net/quotation-document/3505ba533a4c31a44e1572ccbdc41284114c99c2.png";
const SEAL_IMAGE =
  "https://golden-ray.b-cdn.net/quotation-document/fb37b4210913ca92bd8ac2a7e8b137e21a9a4713.png";

// A single "Label : Value" row used in the proposal-details grid.
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start text-[13px] leading-snug">
      <span className="w-[150px] shrink-0 text-[#4B5563]">{label}</span>
      <span className="mr-2 text-[#4B5563]">:</span>
      <span className="font-semibold text-[#123532]">{value}</span>
    </div>
  );
}

interface QuotationData {
  customerName: string;
  address: string;
  phoneNumber: string;
  pincode: string;
  monthlyBill: number | "";
  systemSize: string;
}

interface Page1ContentProps {
  quotationData: QuotationData;
  quoteNo: string;
  currentDate: string;
  validUntilDate: string;
  proposalBy: string;
  gstNo: string;
  companyRegistration: string;
  heroImage: string;
}

export default function Page1Content({
  quotationData,
  quoteNo,
  currentDate,
  validUntilDate,
  proposalBy,
  gstNo,
  companyRegistration,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  heroImage,
}: Page1ContentProps) {
  const { page1: t } = useQuotationStrings();

  return (
    <>
      {/* Hero Image */}
      <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
        <Image
          src="https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg"
          alt="Solar Installation"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Headline */}
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-[#123532] mb-1">{t.headline}</h1>
        <p className="text-base text-[#444444] font-semibold">
          {t.subheadline}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="flex items-center gap-3 p-2">
          <HandCoins
            size={30}
            strokeWidth={2}
            className="shrink-0 text-[#123532]"
          />
          <div>
            <p className="text-lg font-bold leading-tight text-[#F88A22]">
              {t.statSubsidyMain}
            </p>
            <p className="text-sm leading-tight text-[#4B5563]">
              {t.statSubsidySub}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2">
          <Home size={30} strokeWidth={2} className="shrink-0 text-[#123532]" />
          <div>
            <p className="text-lg font-bold leading-tight text-[#F88A22]">
              {t.statHomesMain}
            </p>
            <p className="text-sm leading-tight text-[#4B5563]">
              {t.statHomesSub}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2">
          <BadgeCheck
            size={30}
            strokeWidth={2}
            className="shrink-0 text-[#123532]"
          />
          <div>
            <p className="text-lg font-bold leading-tight text-[#F88A22]">
              {t.statMnreMain}
            </p>
            <p className="text-sm leading-tight text-[#4B5563]">
              {t.statMnreSub}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {/* Personalised letter */}
      <div className="mt-1 mb-4">
        <p className="mb-1.5 text-[15px] font-bold text-[#123532]">
          {fill(t.greeting, {
            name:
              quotationData.customerName?.split(" ")[0] ||
              quotationData.customerName,
          })}
        </p>
        <p className="mb-2 text-[13px] text-[#1F1F1F]">{t.thanks}</p>
        <p className="mb-2 text-[13px] leading-relaxed text-[#1F1F1F]">
          {t.letterBody1}
        </p>
        <p className="mb-3 text-[13px] leading-relaxed text-[#1F1F1F]">
          {t.letterBody2}
        </p>
        <p className="text-[13px] text-[#1F1F1F]">{t.warmRegards}</p>
        <div className="flex items-center gap-4">
          <p className="text-[13px] font-bold text-[#123532]">{t.teamName}</p>
          <Image
            src={SIGN_IMAGE}
            alt="Signature"
            width={80}
            height={45}
            className="object-contain"
          />
          <Image
            src={SEAL_IMAGE}
            alt="Company Seal"
            width={55}
            height={55}
            className="object-contain"
          />
        </div>
      </div>

      {/* Your Proposal Details */}
      <div className="mb-3">
        <h3 className="mb-3 text-[16px] font-bold tracking-wide text-[#123532]">
          {t.proposalDetailsTitle}
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
          <Detail label={t.labelName} value={quotationData.customerName} />
          <Detail label={t.labelQuoteNo} value={quoteNo} />
          <Detail label={t.labelAddress} value={quotationData.address} />
          <Detail label={t.labelProposalBy} value={proposalBy} />
          <Detail label={t.labelPincode} value={quotationData.pincode} />
          <Detail label={t.labelDate} value={currentDate} />
          <Detail
            label={t.labelPhoneNumber}
            value={quotationData.phoneNumber}
          />
          <Detail label={t.labelValidUntil} value={validUntilDate} />
          <Detail
            label={t.labelCurrentBill}
            value={fill(t.currentBillValue, {
              amount: quotationData.monthlyBill,
            })}
          />
          <Detail label={t.labelGstNo} value={gstNo} />
          <Detail label={t.labelSystemSize} value={quotationData.systemSize} />
          <Detail
            label={t.labelCompanyRegistration}
            value={companyRegistration}
          />
        </div>
      </div>

      {/* Certified By Section */}

      {/* <p className="text-center text-[10px] uppercase tracking-wider text-gray-500 ">
        Certified by the Best
      </p>
      <div className="flex justify-center items-center gap-15">
        <Image
          src={logo1}
          alt="ISO"
          width={70}
          height={70}
          className="object-contain"
        />
        <Image
          src={logo2}
          alt="Startup India"
          width={95}
          height={75}
          className="object-contain"
        />
        <Image
          src={logo3}
          alt="KSEB"
          width={70}
          height={70}
          className="object-contain"
        />
        <Image
          src={logo4}
          alt="Kerala Startup"
          width={70}
          height={70}
          className="object-contain"
        />
        <Image
          src={logo5}
          alt="Award"
          width={70}
          height={70}
          className="object-contain"
        />
      </div> */}
    </>
  );
}
