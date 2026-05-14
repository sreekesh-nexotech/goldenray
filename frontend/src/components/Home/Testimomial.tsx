"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
// import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useSwipeable } from "react-swipeable"; // Import useSwipeable for swipe functionality

// const ReactPlayer = dynamic(() => import("react-player/youtube"), {
//   ssr: false,
// });

const testimonials = [
  {
    videoId: "8LSt8_11wbQ",
    image: "https://golden-ray.b-cdn.net/images/test.jpeg",
    stats: [
      { value: "75%", label: "Reduction in Bills" },
      { value: "2 Days", label: "Installation Time" },
    ],
    quote:
      '"The solar panel installation process was smooth from the very beginning. The team clearly explained each stage — from understanding our energy needs to system design, installation, and final activation. All timelines were communicated in advance, and the execution stayed on track without unnecessary delays. The overall experience felt well-planned and dependable."',
    author: "Jose V P — 3kW System — Vadakkal, Alappuzha",
  },
  {
    videoId: "8LSt8_11wbQ",
    image: "https://golden-ray.b-cdn.net/images/p2_middle_slide.jpg",
    stats: [
      { value: "85%", label: "Reduction in Bills" },
      { value: "4 Days", label: "Installation Time" },
    ],
    quote:
      '"Our commercial solar installation brought better predictability to our monthly power expenses. The team maintained transparent communication throughout the project and handled the technical and approval processes professionally."',
    author: "Siraj K P — 3kW System — Cherthala, Alappuzha",
  },
  {
    videoId: "8LSt8_11wbQ",
    image: "https://golden-ray.b-cdn.net/images/P3_middle_slide.jpg",
    stats: [
      { value: "78%", label: "Reduction in Bills" },
      { value: "6 Days", label: "Installation Time" },
    ],
    quote:
      '"What stood out most was the honest guidance we received on system capacity and realistic expectations around savings. The team took time to explain what would work best for our usage rather than overselling."',
    author: "Stephen V C — 3kW System — Vattayal, Alappuzha",
  },
];

export default function HomeTestimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false); // Commented out - will be restored when video is enabled
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.3, // Trigger when 30% of the section is visible
  });
  const currentIndexRef = useRef(0); // Used to keep track of index for autoplay when component is in view

  // --- Swipe Handlers using useCallback for performance ---
  const handleSwipedLeft = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    currentIndexRef.current =
      (currentIndexRef.current + 1) % testimonials.length;
    // Clear existing autoplay interval on manual swipe
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [testimonials.length]); // Dependency: testimonials.length to re-create if testimonials change

  const handleSwipedRight = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
    currentIndexRef.current =
      (currentIndexRef.current - 1 + testimonials.length) % testimonials.length;
    // Clear existing autoplay interval on manual swipe
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [testimonials.length]); // Dependency: testimonials.length

  // Configure and get handlers from useSwipeable hook
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipedLeft,
    onSwipedRight: handleSwipedRight,
    preventScrollOnSwipe: true, // Prevents vertical page scrolling when swiping horizontally
    trackMouse: true, // Enables swiping with mouse drag (useful for desktop testing)
    delta: 10, // Minimum pixels to travel for a swipe to be registered
  });
  // --- End Swipe Handlers ---

  // --- Autoplay Effect ---
  useEffect(() => {
    // Start autoplay only if component is in view
    if (inView) {
      intervalRef.current = window.setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, 5000); // Change testimonial every 5 seconds
    } else if (intervalRef.current) {
      // Clear interval if component is out of view
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cleanup function: Clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView, testimonials.length]); // Dependencies for useEffect

  // --- ReactPlayer Callbacks (commented out - will be restored when video is enabled) ---
  // const handlePlay = () => {
  //   setIsPlaying(true);
  //   // Pause autoplay when video starts playing
  //   if (intervalRef.current) {
  //     window.clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };

  // const handlePause = () => {
  //   setIsPlaying(false);
  //   // Restart autoplay if video is paused and component is in view
  //   if (inView && !intervalRef.current) {
  //     // Only restart if not already running
  //     intervalRef.current = window.setInterval(() => {
  //       const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
  //       currentIndexRef.current = nextIndex;
  //       setCurrentIndex(nextIndex);
  //     }, 5000);
  //   }
  // };

  // const handleEnded = () => {
  //   setIsPlaying(false);
  //   // Restart autoplay when video ends and component is in view
  //   if (inView && !intervalRef.current) {
  //     // Only restart if not already running
  //     intervalRef.current = window.setInterval(() => {
  //       const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
  //       currentIndexRef.current = nextIndex;
  //       setCurrentIndex(nextIndex);
  //     }, 5000);
  //   }
  // };
  // --- End ReactPlayer Callbacks ---

  // --- Dot Navigation Handler ---
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    currentIndexRef.current = index; // Keep ref in sync
    // Clear autoplay interval on manual dot click
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Autoplay will restart via useEffect because isPlaying will likely be false
    // and inView might still be true.
  };

  return (
    <div
      ref={ref} // For useInView to detect section visibility
      className="overflow-hidden py-10 xl:py-8 px-4 sm:px-6 lg:px-8 xl:px-36 relative"
    >
      <h2 className="text-4xl xl:w-1/2 sm:text-4xl lg:text-4xl 2xl:text-4xl font-semibold text-[#123532] mb-10 text-center xl:text-left xl:whitespace-nowrap">
        What our clients have to say
      </h2>

      {/* Main container for the carousel items, where swipe gestures are detected */}
      <div
        {...swipeHandlers} // Spread the swipe handlers from useSwipeable here
        className={`relative ${
          currentIndex === 0 ? "overflow-x-visible" : "overflow-x-hidden"
        }`}
      >
        <div
          ref={sliderRef} // Reference to the inner div that moves for animation
          className="flex transition-transform duration-700 ease-in-out gap-7 md:gap-10"
          style={{
            // Dynamically set width based on number of testimonials for flex container
            width: `${testimonials.length * 100}%`,
            // Translate the container horizontally to show the current testimonial
            transform: `translateX(-${
              currentIndex * (100 / testimonials.length)
            }%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              // Each testimonial item takes up 1/Nth of the total width
              style={{ width: `${100 / testimonials.length}%` }}
              className="w-full flex flex-col xl:flex-row items-stretch justify-baseline rounded-xl"
            >
              <div className="w-full xl:w-1/2 h-auto">
                {/* Temporary: Background image instead of video */}
                <div
                  className="relative rounded-2xl xl:rounded-l-2xl xl:rounded-r-none overflow-hidden h-[300px] sm:h-[400px] xl:h-[500px]"
                  style={{
                    backgroundImage: `url('${testimonial.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition:
                      index === 2
                        ? "center"
                        : index === 0
                          ? "left bottom"
                          : "bottom",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                  }}
                />
                {/* TILL THIS PART */}
                {/* Commented out video player - will be restored later
                <div className="relative rounded-t-2xl xl:rounded-l-2xl overflow-hidden">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${testimonial.videoId}`}
                    width="100%"
                    height="500px"
                    controls={true}
                    light={true}
                    playing={index === currentIndex && isPlaying && inView}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    config={{
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                      },
                    }}
                  />
                </div>
                */}
              </div>

              <div
                className="w-full xl:w-1/2 bg-[#F7F7F2] p-6 py-10 h-full flex flex-col justify-evenly"
                style={{ borderRadius: "0 1rem 1rem 0" }}
              >
                <div className="flex flex-wrap justify-between">
                  {testimonial.stats.map((stat, i) => (
                    <div key={i} className="text-left">
                      <p className="text-2xl sm:text-3xl font-semibold text-[#123532]">
                        {stat.value}
                      </p>
                      <p className="text-sm sm:text-2xl text-[#444444] mb-4">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <hr className="opacity-10 mb-5" />
                <p className="text-[#444444] mb-10 text-sm sm:text-lg">
                  {testimonial.quote}
                </p>
                <p className="text-[#123532] font-semibold text-sm sm:text-xl">
                  {testimonial.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clickable Dots for Navigation */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? "bg-[#123532]" : "bg-gray-300"
            } transition-colors duration-300`} // Added transition for smooth color change
            onClick={() => handleDotClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
