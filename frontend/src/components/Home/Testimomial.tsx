"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useSwipeable } from "react-swipeable"; // Import useSwipeable for swipe functionality

const ReactPlayer = dynamic(() => import("react-player/youtube"), { ssr: false });

const testimonials = [
  {
    videoId: "8LSt8_11wbQ",
    stats: [
      { value: "75%", label: "Reduction in bills" },
      { value: "2 Days", label: "Installation Time" },
    ],
    quote:
      '"Switching to solar with Flarize was the best decision for my home. The team made the entire process seamless, from consultation to installation. Not only have I reduced my electricity bills by nearly 75%, but I also feel great knowing I’m contributing to a sustainable future. Their support team is always available, and the maintenance services are top-notch. Highly recommended!"',
    author: "Rajesh Sharma & Family, Cochin",
  },
  {
    videoId: "8LSt8_11wbQ",
    stats: [
      { value: "85%", label: "Reduction in bills" },
      { value: "4 Days", label: "Installation Time" },
    ],
    quote:
      '"Switching to solar with Flarize was the best decision for my home. The team made the entire process seamless, from consultation to installation. Not only have I reduced my electricity bills by nearly 75%, but I also feel great knowing I’m contributing to a sustainable future. Their support team is always available, and the maintenance services are top-notch. Highly recommended!"',
    author: "Rajesh Sharma & Family, Cochin",
  },
  {
    videoId: "8LSt8_11wbQ",
    stats: [
      { value: "78%", label: "Reduction in bills" },
      { value: "6 Days", label: "Installation Time" },
    ],
    quote:
      '"Switching to solar with Flarize was the best decision for my home. The team made the entire process seamless, from consultation to installation. Not only have I reduced my electricity bills by nearly 75%, but I also feel great knowing I’m contributing to a sustainable future. Their support team is always available, and the maintenance services are top-notch. Highly recommended!"',
    author: "Rajesh Sharma & Family, Cochin",
  },
];

export default function HomeTestimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.3, // Trigger when 30% of the section is visible
  });
  const currentIndexRef = useRef(0); // Used to keep track of index for autoplay when component is in view

  // --- Swipe Handlers using useCallback for performance ---
  const handleSwipedLeft = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    currentIndexRef.current = (currentIndexRef.current + 1) % testimonials.length;
    // Clear existing autoplay interval on manual swipe
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [testimonials.length]); // Dependency: testimonials.length to re-create if testimonials change

  const handleSwipedRight = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    currentIndexRef.current = (currentIndexRef.current - 1 + testimonials.length) % testimonials.length;
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
    // Start autoplay only if component is in view and no video is currently playing
    if (inView && !isPlaying) {
      intervalRef.current = window.setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, 5000); // Change testimonial every 5 seconds
    } else if (intervalRef.current) {
      // Clear interval if component is out of view or a video starts playing
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
  }, [inView, isPlaying, testimonials.length]); // Dependencies for useEffect


  // --- ReactPlayer Callbacks ---
  const handlePlay = () => {
    setIsPlaying(true);
    // Pause autoplay when video starts playing
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Restart autoplay if video is paused and component is in view
    if (inView && !intervalRef.current) { // Only restart if not already running
      intervalRef.current = window.setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, 5000);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Restart autoplay when video ends and component is in view
    if (inView && !intervalRef.current) { // Only restart if not already running
      intervalRef.current = window.setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, 5000);
    }
  };
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
      className="overflow-hidden py-10 px-4 sm:px-6 lg:px-8 xl:px-36 relative mt-10"
    >
      <h2 className="text-4xl xl:w-1/2 sm:text-4xl lg:text-[64px] font-bold text-[#123532] mb-10 text-center xl:text-left">
        What our clients have to say
      </h2>

      {/* Main container for the carousel items, where swipe gestures are detected */}
      <div
        {...swipeHandlers} // Spread the swipe handlers from useSwipeable here
        className={`relative ${currentIndex === 0 ? "overflow-x-visible" : "overflow-x-hidden"}`}
      >
        <div
          ref={sliderRef} // Reference to the inner div that moves for animation
          className="flex transition-transform duration-700 ease-in-out gap-7 md:gap-10"
          style={{
            // Dynamically set width based on number of testimonials for flex container
            width: `${testimonials.length * 100}%`,
            // Translate the container horizontally to show the current testimonial
            transform: `translateX(-${currentIndex * (100 / testimonials.length)}%)`,
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
                <div className="relative rounded-t-2xl xl:rounded-l-2xl overflow-hidden">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${testimonial.videoId}`} // Corrected YouTube URL format
                    width="100%"
                    height="500px"
                    controls={true}
                    light={true} // Shows a thumbnail and play button before loading video
                    playing={index === currentIndex && isPlaying && inView} // Play only if current, playing, and visible
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    config={{
                        playerVars: {
                          modestbranding: 1, // Hides YouTube logo
                          rel: 0, // Prevents related videos at end
                          showinfo: 0, // Hides video title and uploader info
                          disablekb: 1, // Disables keyboard controls
                          fs: 0, // Disables fullscreen button
                          iv_load_policy: 3, // Hides video annotations by default
                        },
                    }}
                  />
                </div>
              </div>

              <div className="w-full xl:w-1/2 bg-[#F7F7F2] p-6 py-10 rounded-b-2xl xl:rounded-r-2xl h-full flex flex-col justify-evenly">
                <div className="flex flex-wrap justify-between">
                  {testimonial.stats.map((stat, i) => (
                    <div key={i} className="text-left">
                      <p className="text-2xl sm:text-3xl font-semibold text-[#123532]">
                        {stat.value}
                      </p>
                      <p className="text-sm sm:text-2xl text-[#444444] mb-4">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <hr className="opacity-10 mb-5" />
                <p className="text-[#444444] mb-10 text-sm sm:text-xl">{testimonial.quote}</p>
                <p className="text-[#123532] font-semibold text-sm sm:text-xl">{testimonial.author}</p>
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