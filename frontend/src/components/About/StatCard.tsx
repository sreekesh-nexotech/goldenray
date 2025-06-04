// components/StatCard.jsx
import React from 'react';

// Define the props interface for the StatCard component
type StatCardProps = {
  value: string;
  label: string;
  description: string;
  highlight?: string; // The specific substring within the description to highlight.
}

export default function StatCard({ value, label, description, highlight }: StatCardProps) {

  // Function to render the description with potential highlighting
  const renderDescription = () => {
    // Check if a highlight text is provided and if it exists within the description
    if (highlight && description.includes(highlight)) {
      // Split the description string into parts using the highlight text as a delimiter.
      // This will create an array where the highlight text is effectively removed from the parts.
      const parts = description.split(highlight);

      // Reconstruct the description. The first part, the highlighted part, and the second part.
      // The highlighted part is wrapped in a <span> with specific Tailwind classes for styling.
      return (
        <p className="text-sm font-semibold md:text-base text-[#121217]">
          {parts[0]} {/* Text before the highlight */}
          <span className="text-[#ED8723] ">
            {highlight} {/* The highlighted text */}
          </span>
          {parts[1]} {/* Text after the highlight */}
        </p>
      );
    }
    // If no highlight text is provided, or if it's not found in the description,
    // render the description as is without any special highlighting.
    return <p className="text-base lg:text-lg text-[#121217]">{description}</p>;
  };

  return (
    // The main container for a single stat card.
    <div className="p-0 xl:p-6 py-10 flex flex-col items-start justify-center">
      {/* Display the label. The font size is smaller as per your provided code. */}
      <p className="text-xs lg:text-sm font-semibold text-[#074A4D] mb-4 uppercase">
        {label}
      </p>
      {/* Display the main value of the statistic. Font sizes are adjusted as per your code. */}
      <p className="text-[40px] lg:text-[64px] font-bold text-[#121217] mb-2">
        {value}
      </p>

      {/* Render the description using the helper function, which handles highlighting */}
      {renderDescription()}
    </div>
  );
};
