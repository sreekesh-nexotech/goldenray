'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type CarouselProps = {
  images: string[];
};

export default function Carousel({ images }: CarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
  const nextIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;

  const sideImages = [
    { src: images[prevIndex], onClick: prevImage, alt: "Previous image", position: "left" },
    { src: images[nextIndex], onClick: nextImage, alt: "Next image", position: "right" },
  ];

  return (
    <div className="flex items-center w-full h-[300px] sm:h-[500px] md:h-[600px] overflow-hidden relative">
      
      {/* Left Side Image */}
      {sideImages
        .filter((img) => img.position === "left")
        .map((img, index) => (
          <div
            key={`left-${index}`}
            className="lg:w-1/6 h-full cursor-pointer relative mr-2"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-right  transition-opacity duration-300 rounded-r-2xl"
            />
          </div>
        ))}

      {/* Main Image */}
      <div className="w-full lg:w-4/6 h-full relative">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full transition-opacity duration-500 ease-in-out"
            style={{ opacity: 1 }}
            key={images[currentImageIndex]} // Key ensures re-render on image change
          >
            <Image
              src={images[currentImageIndex]}
              alt={`Project image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>


      </div>

      {/* Right Side Image */}
      {sideImages
        .filter((img) => img.position === "right")
        .map((img, index) => (
          <div
            key={`right-${index}`}
            className="lg:w-1/6 h-full cursor-pointer relative ml-2"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover  object-left transition-opacity duration-300 rounded-l-2xl"
            />
          </div>
        ))}
                {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="z-10 w-10 h-10 flex items-center justify-center absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#D9D9D9A6] bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-90 transition cursor-pointer"
        >
          <Image src='/left-arrow.png' alt='left-arrow' width={10} height={10}/>
        </button>
        <button
          onClick={nextImage}
          className="z-10  w-10 h-10 flex items-center justify-center absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#D9D9D9A6] bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-90 transition cursor-pointer"
        >
          <Image src='/right-arrow.png' alt='right-arrow' width={10} height={10}/>
        </button>
    </div>
  );
}