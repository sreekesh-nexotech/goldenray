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
    <div className="py-10 px-4 sm:px-6 lg:px-8 xl:px-7">
      <section
        className="rounded-3xl overflow-hidden relative min-h-[85vh] lg:min-h-[85vh] xl:min-h-[85vh]"
        style={{
          background: "linear-gradient(180deg, #F7BA41 0%, #FCD042 100%)",
        }}
      >
        {/* Main content card */}
        <div className="rounded-3xl p-4 sm:p-8 lg:p-12 flex flex-col gap-2 relative z-10">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-5xl md:text-6xl  font-light leading-tight mb-8 text-[#123532]">
            Save more with our group
            <br className="hidden sm:block" /> purchase scheme!
          </h2>

          {/* Benefit cards section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 mt-4 mb-8 md:mb-42">
            {/* Benefit 1: Reserve */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={reserveIcon}
                  alt="Reserve"
                  width={48}
                  height={32}
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px]"
                />
              }
              title="Reserve"
              description="Secure your spot with a small, refundable fee."
            />{" "}
            {/* Benefit 2: Invite*/}
            <GroupPurchaseItem
              icon={
                <Image
                  src={inviteFriendsIcon}
                  alt="Invite Friends"
                  width={42}
                  height={32}
                  className="w-[42px] h-[32px] md:w-[31px] md:h-[24px]"
                />
              }
              title="Invite Friends"
              description="Share with friends and grow your group."
            />
            {/* Benefit 3: Unlock */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={unlockDiscountIcon}
                  alt="Unlock Discount"
                  width={48}
                  height={32}
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px]"
                />
              }
              title="Unlock Discount"
              description="Unlock massive discounts exclusive for bulk orders."
            />
            {/* Benefit 4: Install */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={installIcon}
                  alt="Install"
                  width={48}
                  height={32}
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px]"
                />
              }
              title="Install"
              description="Enjoy a smooth, professional installation."
            />
          </div>

          {/* Progress Bar Section */}
          <div className="mt-1 mb-3 md:max-w-md">
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4 overflow-hidden relative">
              <div
                className="h-4 rounded-full transition-all duration-700 ease-in-out relative"
                style={{
                  width: `${progressPercentage}%`,
                  background: `#FE7903`,
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FE7903] rounded-full border-4 border-white shadow-lg transition-all duration-700"></div>
              </div>
            </div>

            {/* Progress Text */}
            <p className="text-sm md:text-lg text-[#123532] mb-8">
              Neighbours in your area are teaming up for more savings.{" "}
              <span className="font-base">
                {familiesJoined} families joined, only {spotsLeft} spots left!
              </span>
            </p>

            {/* Reserve Button */}
            <Link
              href="#booking"
              className="inline-block bg-white text-[#074A4D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer text-sm md:text-lg"
            >
              Reserve your spot
            </Link>
          </div>
        </div>

        {/* Family Photo for mobile/tablet - shown at top */}
        <div className="lg:hidden mb-6 px-4">
          <Image
            src={familyPhoto}
            alt="Happy family"
            width={737}
            height={492}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Family Photo for desktop - positioned at bottom right */}
        <div className="hidden lg:block absolute bottom-0 right-0 w-[45vw] max-w-[600px] max-h-[480px] xl:w-[30vw] xl:max-w-[800px] xl:max-h-[450px] 2xl:w-[38vw] 2xl:max-w-[700px] 2xl:max-h-[480px]">
          <Image
            src={familyPhoto}
            alt="Happy family"
            width={737}
            height={492}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>
    </div>
  );
}
