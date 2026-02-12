"use client";

import Image from "next/image";

// Import certification logos
import logo1 from "../../../public/image-33.png";
import logo2 from "../../../public/image-36.png";
import logo3 from "../../../public/image-34.png";
import logo4 from "../../../public/image-37.png";
import logo5 from "../../../public/image-32.png";

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
  return (
    <>
      {/* Hero Image */}
      <div className="relative w-full h-68 rounded-xl overflow-hidden mb-4">
        <Image
          src="https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg"
          alt="Solar Installation"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Headline */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-[#123532] mb-1">
          Stop Worrying About Electricity Bills Forever
        </h1>
        <p className="text-base text-gray-600">
          Empowering Kerala homes with clean energy, smart savings, and the joy
          of sustainability.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-[#FFF8E9]">
        <div className=" rounded-lg p-3 text-center">
          <p className="text-2xl my-2 font-medium text-[#FF9500]">₹78,000</p>
          <p className="text-[12px] text-gray-600">PM Surya Ghar subsidy</p>
        </div>
        <div className="rounded-lg p-3 text-center">
          <p className="text-2xl my-2 font-medium text-[#123532]">MNRE</p>
          <p className="text-[12px] text-gray-600">Empanelled Vender</p>
        </div>
        <div className="rounded-lg p-3 text-center">
          <p className="text-2xl my-2 font-medium text-[#124944]">300+</p>
          <p className="text-[12px] text-gray-600">
            Trusted Customers <span className="text-[#FF9500]">since 2018</span>
            ,<br />
            scaling now
          </p>
        </div>
      </div>

      {/* Customer & Proposal Details */}
      <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
        {/* Customer Details */}
        <div className="bg-[#FFF8E9] border border-[#E5D5B8] rounded-2xl p-3">
          <div className="space-y-1.5">
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">Customer Name</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {quotationData.customerName}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">Address</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {quotationData.address}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">pincode</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {quotationData.pincode}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">Customer Name</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {quotationData.phoneNumber}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">Current Bill</p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    ₹{quotationData.monthlyBill}/month
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">System Size</p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {quotationData.systemSize}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="bg-[#FFF8E9] border border-[#E5D5B8] rounded-2xl p-3">
          <div className="space-y-1.5">
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">Proposal By</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {proposalBy}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">Date</p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {currentDate}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">Valid Until</p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {validUntilDate}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-700 mb-0.5">Quo No</p>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <p className="text-[15px] font-semibold text-gray-900">
                  {quoteNo}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">GST No</p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {gstNo}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-700 mb-0.5">
                  Company Registration
                </p>
                <div className="bg-white rounded-lg px-3 py-1.5">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {companyRegistration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certified By Section */}

      <p className="text-center text-[10px] uppercase tracking-wider text-gray-500 ">
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
      </div>
    </>
  );
}
