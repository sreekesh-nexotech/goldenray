"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic'; 

const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });//to remove the hydration error ReactPlayer is dynamically imported with ssr false


const testimonials = [
  {
    videoId: "Jw7s42Op2ao",
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
      { value: "75%", label: "Reduction in bills" },
      { value: "2 Days", label: "Installation Time" },
    ],
    quote:
      '"Switching to solar with Flarize was the best decision for my home. The team made the entire process seamless, from consultation to installation. Not only have I reduced my electricity bills by nearly 75%, but I also feel great knowing I’m contributing to a sustainable future. Their support team is always available, and the maintenance services are top-notch. Highly recommended!"',
    author: "Rajesh Sharma & Family, Cochin",
  },
];

export default function HomeTestimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    let interval: number | undefined; // Keep the type as number | undefined
    if (!isPlaying) {
      // Cast the return value of setInterval to number
      interval = window.setInterval(() => { // Use window.setInterval for clarity in browser context
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000) as number; // <--- Add 'as number' here
    }

    return () => {
      if (interval) {
        window.clearInterval(interval); // Use window.clearInterval
      }
    };
  }, [isPlaying, testimonials.length]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="overflow-hidden py-10 px-4 sm:px-6 xl:px-30 relative mt-10">
      <h2 className="text-4xl xl:w-1/2 sm:text-4xl lg:text-[64px] font-bold text-[#123532] mb-10 text-center xl:text-left">
        What our clients have to say
      </h2>

      <div className="relative">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-in-out gap-7 md:gap-10"
          style={{
            width: `${testimonials.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / testimonials.length)}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-full flex flex-col xl:flex-row items-stretch justify-baseline rounded-xl"
            >
              <div className="w-full xl:w-1/2 h-auto">
                <div className="relative rounded-2xl lg:rounded-l-2xl overflow-hidden">
                  <ReactPlayer
                    url={`http://www.youtube.com/embed/${testimonial.videoId}`}
                    width="100%"
                    height="500px"
                    controls={true}
                    light={true}
                    playing={false}
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
              </div>

              <div className="w-full xl:w-1/2 bg-[#F7F7F2] p-6 py-10 rounded-r-2xl h-full flex flex-col justify-evenly">
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
    </div>
  );
}   