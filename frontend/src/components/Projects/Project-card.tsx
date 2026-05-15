// components/ProjectCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

///importing project type for type safety
import { Project } from "@/data/Mock-projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    // Link to the dynamic project detail page
    <Link href={`projects/${project.id}`} className="block h-full">
      <div className="rounded-2xl bg-[#F3F3F3] shadow-sm p-4 lg:p-6 overflow-hidden flex flex-col h-full">
        {/* Project Image */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </div>

        {/* Project Details */}
        <div className="py-3 flex flex-col gap-5 flex-1">
          {/* Project Title */}
          <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#424646] ">
            {project.title}
          </h3>
          {/* Project Description */}
          <p className="text-gray-700 text-sm md:text-xl font-normal leading-relaxed line-clamp-3">
            {project.cardDescription}
          </p>

          {/* Area and Power Section */}
          <div className="hidden md:flex items-center gap-8 text-xs md:text-base font-normal leading-normal text-gray-800 justify-baseline">
            {/* Area Column */}
            <div className="flex flex-col border-r pr-5">
              <div className="flex items-center gap-2">
                {/* icon for Area */}
                <Image src="/area.png" alt="Area" width={20} height={20} />
                <span>Area</span> {/* Label for Area */}
              </div>
              <p className="font-medium text-xl md:text-2xl leading-snug mt-1 text-[#020817]">
                {project.area}
              </p>
            </div>

            {/* Power Column */}
            <div className="flex flex-col ">
              <div className="flex items-center gap-2">
                {/* icon for Power */}
                <Image src="/power.png" alt="Area" width={20} height={20} />
                <span>Power</span> {/* Label for Power */}
              </div>
              {/* Dynamic Power value, made bolder and slightly larger to match the image. */}
              <p className="font-medium text-xl md:text-2xl leading-snug mt-1 text-[#020817] ">
                {project.power}
              </p>
            </div>
          </div>

          {/* Unique Selling Proposition */}
          <div
            className={`${project.uspBgColor} ${project.uspTextColor} text-sm font-semibold py-4 rounded-4xl text-center mt-auto`}
          >
            {project.usp}
          </div>
        </div>
      </div>
    </Link>
  );
}
