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
    <div className="py-10 md:py-8 lg:py-10 xl:py-8 2xl:py-10 px-4 sm:px-6 md:px-7 lg:px-8 xl:px-7 2xl:px-12">
      <section
        className="rounded-3xl overflow-hidden relative min-h-[85vh] md:min-h-[85vh] lg:min-h-[105vh] xl:min-h-[95vh] 2xl:min-h-[90vh]"
        style={{
          background: "linear-gradient(180deg, #F7BA41 0%, #FCD042 100%)",
        }}
      >
        {/* Main content card */}
        <div className="rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 flex flex-col gap-2 relative z-10">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-4xl xl:text-4xl 2xl:text-7xl font-light leading-tight mb-6 md:mb-7 lg:mb-8 xl:mb-6 2xl:mb-10 text-[#123532]">
            Save more with our group
            <br className="hidden sm:block" /> purchase scheme!
          </h2>

          {/* Benefit cards section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-3 lg:gap-4 xl:gap-1 2xl:gap-6 mt-4 md:mt-3 lg:mt-4 mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14">
            {/* Benefit 1: Reserve */}
            <GroupPurchaseItem
              icon={
                <Image
                  src={reserveIcon}
                  alt="Reserve"
                  width={48}
                  height={32}
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px] xl:w-[42px] xl:h-[28px]"
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
                  className="w-[42px] h-[32px] md:w-[31px] md:h-[24px] xl:w-[38px] xl:h-[28px]"
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
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px] xl:w-[42px] xl:h-[28px]"
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
                  className="w-[48px] h-[32px] md:w-[35px] md:h-[24px] xl:w-[42px] xl:h-[28px]"
                />
              }
              title="Install"
              description="Enjoy a smooth, professional installation."
            />
          </div>

          {/* Progress Bar Section */}
          <div className="mt-1 mb-3 md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 md:h-5 lg:h-5 xl:h-5 2xl:h-6 mb-4 md:mb-5 lg:mb-5 xl:mb-5 2xl:mb-6 overflow-hidden relative">
              <div
                className="h-4 md:h-5 lg:h-5 xl:h-5 2xl:h-6 rounded-full transition-all duration-700 ease-in-out relative"
                style={{
                  width: `${progressPercentage}%`,
                  background: `#FE7903`,
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 bg-[#FE7903] rounded-full border-4 border-white shadow-lg transition-all duration-700"></div>
              </div>
            </div>

            {/* Progress Text */}
            <p className="text-sm md:text-base lg:text-sm xl:text-sm 2xl:text-2xl text-[#123532] mb-6 md:mb-7 lg:mb-8 xl:mb-6 2xl:mb-10">
              Neighbours in your area are teaming up for more savings.{" "}
              <span className="font-base">
                {familiesJoined} families joined, only {spotsLeft} spots left!
              </span>
            </p>

            {/* Reserve Button */}
            <Link
              href="#booking"
              className="inline-block bg-white text-[#074A4D] px-6 py-3 md:px-8 md:py-3 lg:px-8 lg:py-2.5 xl:px-8 xl:py-2.5 2xl:px-14 2xl:py-5 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer text-sm md:text-base lg:text-sm xl:text-sm 2xl:text-2xl"
            >
              Reserve your spot
            </Link>
          </div>
        </div>

        {/* Family Photo for mobile/tablet - shown at top */}
        <div className="lg:hidden mb-6 md:mb-8 px-4 md:px-6">
          <Image
            src={familyPhoto}
            alt="Happy family"
            width={737}
            height={492}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Family Photo for desktop - positioned at bottom right */}
        <div className="hidden lg:block absolute bottom-0 right-0 w-[45vw] max-w-[550px] max-h-[420px] lg:w-[40vw] lg:max-w-[500px] lg:max-h-[400px] xl:w-[28vw] xl:max-w-[450px] xl:max-h-[360px] 2xl:w-[38vw] 2xl:max-w-[750px] 2xl:max-h-[520px]">
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
