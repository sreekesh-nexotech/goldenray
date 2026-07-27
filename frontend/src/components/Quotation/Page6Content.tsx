"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getInstallationStats } from "@/services/installationStatsService";
import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";

// Customer identity and figures stay as recorded; the wording that goes with
// each testimonial comes from the string catalog.
interface Testimonial {
  name: string;
  location: string;
  image: string;
  oldBill: number;
  newBill: number;
  savings: number;
}

interface Page3ContentProps {
  pincode: string;
}

// Generate a deterministic "homes count" based on pincode (FALLBACK)
function getHomesCountForPincode(pincode: string): number {
  if (!pincode || pincode.length === 0) return 8;
  let hash = 0;
  for (let i = 0; i < pincode.length; i++) {
    hash = (hash * 31 + pincode.charCodeAt(i)) % 100;
  }
  // Return a number between 5 and 30
  return 5 + (hash % 26);
}

// Get district name from pincode (simplified Kerala mapping) (FALLBACK)
function getDistrictFromPincode(pincode: string): string {
  const prefix = pincode.substring(0, 3);
  const districtMap: Record<string, string> = {
    "688": "Alappuzha",
    "689": "Alappuzha",
    "690": "Kollam",
    "691": "Kollam",
    "695": "Thiruvananthapuram",
    "682": "Ernakulam",
    "683": "Ernakulam",
    "680": "Thrissur",
    "681": "Thrissur",
    "673": "Kozhikode",
    "670": "Kannur",
    "671": "Kannur",
    "676": "Malappuram",
    "678": "Palakkad",
    "685": "Idukki",
    "686": "Kottayam",
    "687": "Kottayam",
    "674": "Kozhikode",
    "677": "Malappuram",
    "679": "Palakkad",
    "684": "Ernakulam",
  };
  return districtMap[prefix] || "Alappuzha";
}

// Get district-wide installation count (FALLBACK)
function getDistrictInstallations(pincode: string): number {
  const homes = getHomesCountForPincode(pincode);
  return homes * 3 + 7; // District has ~3x more than the pincode area
}

const testimonials: Testimonial[] = [
  {
    name: "Jose V P",
    location: "Vadakkal, Alapuzha",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg",
    oldBill: 3200,
    newBill: 200,
    savings: 2900,
  },
  {
    name: "Siraj K P",
    location: "Cherthala, Alappuzha",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/belowsection%20ENHANCED.jpg",
    oldBill: 3200,
    newBill: 200,
    savings: 2900,
  },
  {
    name: "Stephen V C",
    location: "Vattayal, Alappuzha",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/belowsectionimage%20ENHANCED.jpg",
    oldBill: 3200,
    newBill: 200,
    savings: 2900,
  },
];

export default function Page3Content({ pincode }: Page3ContentProps) {
  const { page6: t } = useQuotationStrings();
  // State for API data
  const [homesCount, setHomesCount] = useState<number>(
    getHomesCountForPincode(pincode),
  );
  const [district, setDistrict] = useState<string>(
    getDistrictFromPincode(pincode),
  );
  const [districtInstallations, setDistrictInstallations] = useState<number>(
    getDistrictInstallations(pincode),
  );
  const [yearInstallations, setYearInstallations] = useState<number>(0);

  // Fetch real data from API
  useEffect(() => {
    const fetchStats = async () => {
      if (!pincode) {
        return;
      }

      try {
        const stats = await getInstallationStats(pincode);

        // Use real data from API
        setHomesCount(
          stats.pincode_installations > 0
            ? stats.pincode_installations
            : getHomesCountForPincode(pincode),
        );
        setDistrict(stats.district || getDistrictFromPincode(pincode));
        setDistrictInstallations(
          stats.district_installations > 0
            ? stats.district_installations
            : getDistrictInstallations(pincode),
        );
        setYearInstallations(stats.current_year_installations);
      } catch (error) {
        console.error("Failed to fetch installation stats:", error);
        // Keep fallback values already set in state
      }
    };

    fetchStats();
  }, [pincode]);

  // Every fragment of the social-proof sentence gets all the values: Malayalam
  // orders them differently from English.
  const socialProofValues = {
    homes: homesCount,
    district,
    pincode,
    count: yearInstallations > 0 ? yearInstallations : districtInstallations,
    year: yearInstallations > 0 ? new Date().getFullYear() : "2024",
  };

  return (
    <>
      {/* Main Headline */}
      <div className="text-center my-7 mt-2 px-4 ">
        <h1 className="text-2xl font-bold leading-tight mb-1">
          <span className="text-[#1a1a1a]">{t.headlinePart1}</span>
          <span className="text-[#FF9500]">{t.headlinePart2}</span>
        </h1>
        <p className="text-sm text-gray-500">{t.subtitle}</p>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-[#F0FDF4] border border-green-200 rounded-xl px-4 py-3 mb-4 mx-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Image
            src="https://golden-ray.b-cdn.net/icons/Vector%20(7).png"
            alt="Location"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <p className="text-sm text-[#15803D] leading-relaxed">
          <span className="font-bold text-[#15803D]">
            {fill(t.socialProofHomes, socialProofValues)}
          </span>
          {fill(t.socialProofMiddle, socialProofValues)}
          <span className="font-bold text-[#15803D]">
            {fill(t.socialProofInstallations, socialProofValues)}
          </span>
          {fill(t.socialProofTail, socialProofValues)}
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-3 gap-3 mb-9 mt-5 px-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-35 overflow-hidden">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
              {/* Overlay with name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-bold leading-tight">
                  {testimonial.name} – {testimonial.location}
                </p>
                <p className="text-[#FF9500] text-xs font-medium">
                  {t.testimonials[index]?.systemSize} |{" "}
                  {t.testimonials[index]?.installedDate}
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="p-2 flex-grow">
              <p className="text-sm text-gray-600 leading-relaxed ">
                {t.testimonials[index]?.quote}
              </p>
            </div>

            {/* Savings */}
            <div className="px-2 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-red-500 line-through">
                  ₹{testimonial.oldBill.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-400 text-xs">→</span>
                <span className="text-xs font-bold text-[#123532] bg-[#E6F7F0] px-1.5 py-0.5 rounded">
                  ₹{testimonial.newBill.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] font-semibold text-green-600 ml-auto">
                  {fill(t.savesLabel, {
                    amount: testimonial.savings.toLocaleString("en-IN"),
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code / Testimonials Link Section */}
      <div className="mx-4 mb-10 bg-[#FFF8E9] border border-[#E5D5B8] rounded-xl p-3 flex items-center gap-4">
        <div className="flex-shrink-0 w-18 h-18 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
          {/* QR Code placeholder */}
          <svg
            className="w-12 h-12 text-gray-800"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <rect x="10" y="10" width="25" height="25" />
            <rect x="65" y="10" width="25" height="25" />
            <rect x="10" y="65" width="25" height="25" />
            <rect x="40" y="10" width="5" height="5" />
            <rect x="50" y="10" width="5" height="5" />
            <rect x="40" y="20" width="5" height="5" />
            <rect x="55" y="20" width="5" height="5" />
            <rect x="40" y="40" width="5" height="5" />
            <rect x="50" y="40" width="5" height="5" />
            <rect x="10" y="40" width="5" height="5" />
            <rect x="20" y="50" width="5" height="5" />
            <rect x="40" y="50" width="5" height="5" />
            <rect x="60" y="40" width="5" height="5" />
            <rect x="70" y="40" width="5" height="5" />
            <rect x="80" y="40" width="5" height="5" />
            <rect x="50" y="60" width="5" height="5" />
            <rect x="60" y="70" width="5" height="5" />
            <rect x="70" y="60" width="5" height="5" />
            <rect x="80" y="70" width="5" height="5" />
            <rect x="80" y="80" width="5" height="5" />
            <rect x="50" y="80" width="5" height="5" />
            {/* Inner squares for QR corners */}
            <rect
              x="14"
              y="14"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect x="18" y="18" width="9" height="9" />
            <rect
              x="69"
              y="14"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect x="73" y="18" width="9" height="9" />
            <rect
              x="14"
              y="69"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect x="18" y="73" width="9" height="9" />
          </svg>
        </div>
        <div>
          <p className="text-md font-bold text-[#123532] mb-1">{t.qrTitle}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{t.qrBody}</p>
          <p className="text-[11px] text-[#FF9500] font-medium mt-1">
            → flarize.in/testimonials
          </p>
        </div>
      </div>
    </>
  );
}
