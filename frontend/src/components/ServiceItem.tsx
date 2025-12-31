"use client";

import React from "react";

// Define a type for the service items
type ServiceItemProps = {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
};

// ServiceItem component to render each individual service
export default function ServiceItem({
  icon,
  title,
  bgColor,
}: ServiceItemProps) {
  return (
    <div className="flex flex-col items-center justify-baseline  text-center p-4 lg:px-20">
      {/* Icon container with circular background */}

      <div
        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40  rounded-full flex items-center justify-center mb-4 "
        style={{ backgroundColor: bgColor }}
      >
        {" "}
        {/* Slightly transparent white background */}
        {icon}
      </div>
      {/* Service title */}
      <p className="text-gray-800 text-sm sm:text-base font-medium leading-tight">
        {title}
      </p>
    </div>
  );
}
