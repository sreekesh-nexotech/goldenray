import React from "react";

interface FormHeadingProps {
  title: string;
  description: string;
}

const FormHeading: React.FC<FormHeadingProps> = ({ title, description }) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 sm:px-6 lg:px-8 xl:px-36 pb-15  flex flex-col md:flex-row items-center">
        {/* Title and description */}
        <div className="w-full text-center">
          <h1 className="text-[24px] leading-10 sm:text-3xl lg:text-5xl font-semibold text-[#123532] mb-4">
            {title}
          </h1>
          <p className="text-base w-full mx-auto sm:text-lg md:text-[20px] text-[#444444] mb-6">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FormHeading;