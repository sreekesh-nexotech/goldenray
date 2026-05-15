"use client";

import React from "react";
import Image from "next/image";
import GroupPurchaseItem from "./Group-purchase-item";
// import people from "../../../public/People-1.png";
import familyPhoto from "../../../public/FamiliyPhoto.png";
// import line from "../../../public/Vector-6.png";
import Link from "next/link";

// CDN URLs for icons
const reserveIcon =
  "https://gym-manager-pull.b-cdn.net/golden_ray/home/reserve.png";
const inviteFriendsIcon =
  "https://gym-manager-pull.b-cdn.net/golden_ray/home/invite_friends.png";
const unlockDiscountIcon =
  "https://gym-manager-pull.b-cdn.net/golden_ray/home/unlock_discont.png";
const installIcon =
  "https://gym-manager-pull.b-cdn.net/golden_ray/home/install.png";

// Main GroupPurchaseScheme component
export default function GroupPurchaseScheme() {
  const familiesJoined = 32;
  const spotsLeft = 8;
  const totalSpots = familiesJoined + spotsLeft;
  const progressPercentage = (familiesJoined / totalSpots) * 100;

  return (
    <div className="py-6 sm:py-8 md:py-8 lg:py-6 xl:py-6 2xl:py-12 px-4 sm:px-6 md:px-6 lg:px-35 xl:px-35 2xl:px-35">
      <section
        className="rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #F7BA41 0%, #FCD042 100%)",
        }}
      >
        <div className="p-5 sm:p-6 md:p-8 lg:p-8 xl:p-6 2xl:p-14">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-4 xl:mb-4 2xl:mb-10 text-[#123532]">
            Save More with Our Group
            <br className="hidden sm:block" /> Purchase Scheme!
          </h2>

          {/* Benefit cards section - 4 columns on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-4 sm:gap-y-3 md:gap-x-3 md:gap-y-4 lg:gap-x-4 lg:gap-y-3 xl:gap-x-1 xl:gap-y-2 2xl:gap-x-6 2xl:gap-y-6 mb-6 sm:mb-8 md:mb-6 lg:mb-6 xl:mb-4 2xl:mb-12">
            {/* Benefit 1: Reserve */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={reserveIcon}
                  alt="Reserve"
                  width={48}
                  height={32}
                  className="w-7 h-5 sm:w-9 sm:h-6 md:w-7 md:h-5 lg:w-8 lg:h-6 xl:w-10 xl:h-7 2xl:w-12 2xl:h-8"
                />
              }
              title="Reserve"
              description={
                <>
                  Secure your spot with a<br />
                  small, refundable fee.
                </>
              }
            />
            {/* Benefit 2: Invite*/}
            <GroupPurchaseItem
              icon={
                <Image
                  src={inviteFriendsIcon}
                  alt="Invite Friends"
                  width={42}
                  height={32}
                  className="w-7 h-5 sm:w-9 sm:h-6 md:w-7 md:h-5 lg:w-8 lg:h-6 xl:w-10 xl:h-7 2xl:w-12 2xl:h-8"
                />
              }
              title="Invite Friends"
              description={
                <>
                  Share with friends and neighbours. <br /> Bigger group, bigger
                  discount.
                </>
              }
            />
            {/* Benefit 3: Unlock */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={unlockDiscountIcon}
                  alt="Unlock Discount"
                  width={48}
                  height={32}
                  className="w-7 h-5 sm:w-9 sm:h-6 md:w-7 md:h-5 lg:w-8 lg:h-6 xl:w-10 xl:h-7 2xl:w-12 2xl:h-8"
                />
              }
              title="Unlock Discount"
              description={
                <>
                  Exclusive bulk pricing on solar panel <br /> price in Kerala —
                  activated at minimum group size.
                </>
              }
            />
            {/* Benefit 4: Install */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={installIcon}
                  alt="Install"
                  width={48}
                  height={32}
                  className="w-7 h-5 sm:w-9 sm:h-6 md:w-7 md:h-5 lg:w-8 lg:h-6 xl:w-10 xl:h-7 2xl:w-12 2xl:h-8"
                />
              }
              title="Install"
              description={
                <>
                  Every home gets certified solar panel <br /> installation with
                  full warranty and support.
                </>
              }
            />
          </div>

          {/* Bottom section: Progress bar (left) + Image (right) */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            {/* Progress Bar Section - Left side */}
            <div className="max-w-[280px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] 2xl:max-w-[450px] md:pb-4 lg:pb-4 xl:pb-2 2xl:pb-10">
              {/* Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-3 sm:h-4 md:h-3 lg:h-4 xl:h-4 2xl:h-5 mb-3 sm:mb-4 md:mb-3 lg:mb-4 xl:mb-4 2xl:mb-5 relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-in-out relative"
                  style={{
                    width: `${progressPercentage}%`,
                    background: `#FE7903`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 bg-[#FE7903] rounded-full border-[3px] sm:border-4 border-white shadow-lg transition-all duration-700"></div>
                </div>
              </div>

              {/* Progress Text */}
              <p className="text-xs md:text-base font-normal leading-normal text-[#123532] mb-4 sm:mb-5 md:mb-4 lg:mb-5 xl:mb-4 2xl:mb-8">
                Neighbours in your area are teaming up for more savings.{" "}
                <span className="font-medium">
                  {familiesJoined} families joined, only {spotsLeft} spots left!
                </span>
              </p>

              {/* Reserve Button */}
              <Link
                href="#booking"
                className="inline-block bg-white text-[#074A4D] px-5 py-2 sm:px-6 sm:py-2.5 md:px-5 md:py-2 lg:px-6 lg:py-2.5 xl:px-7 xl:py-3 2xl:px-10 2xl:py-4 rounded-lg font-semibold leading-snug text-base md:text-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              >
                Reserve your spot
              </Link>
            </div>

            {/* Family Photo - Right side (hidden on mobile) */}
            <div className="hidden md:block md:w-[38%] lg:w-[36%] xl:w-[34%] 2xl:w-[36%] md:-mb-8 lg:-mb-8 xl:-mb-6 2xl:-mb-14 md:-mr-8 lg:-mr-10 xl:-mr-12 2xl:-mr-14">
              <Image
                src={familyPhoto}
                alt="Happy family"
                width={737}
                height={492}
                className="w-full h-auto object-contain block"
                priority
              />
            </div>
          </div>
        </div>

        {/* Family Photo for mobile only - shown below content */}
        <div className="md:hidden px-4 pb-4 sm:px-6 sm:pb-6 -mt-2">
          <Image
            src={familyPhoto}
            alt="Happy family"
            width={737}
            height={492}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
