// components/ProjectCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the Project interface for type safety
type Project = {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  title: string;
  description: string;
  imageUrl: string;
  area: string;
  power: string;
  usp: string; // Unique Selling Proposition, like "1 TON CO₂ SAVED ANNUALLY"
  uspTextColor: string;
  uspBgColor: string;
}

type ProjectCardProps = {
  project: Project;
}

export default function ProjectCard({ project }:ProjectCardProps) {
  return (
    // Link to the dynamic project detail page
    <Link href={`projects/${project.id}`} className="block">
      <div className="rounded-2xl bg-white shadow-lg lg:bg-transparent lg:shadow-none p-4 lg:p-0 overflow-hidden">
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
        <div className="py-3 flex flex-col gap-5">
          {/* Project Title */}
          <h3 className="text-[28px] font-semibold text-[#424646]">
            {project.title}
          </h3>
          {/* Project Description */}
          <p className="text-gray-700 text-xl line-clamp-3">
            {project.description}
          </p>

          {/* Area and Power Section */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-800 justify-baseline">
            {/* Area Column */}
            <div className="flex flex-col border-r pr-5">
              <div className='flex items-center gap-2'>
                {/* icon for Area */}
                <Image src='/area.png' alt='Area' width={20} height={20} />
                <span>Area</span> {/* Label for Area */}
              </div>
              <p className="font-medium text-2xl  mt-1 text-[#020817]">{project.area}</p>
            </div>

            {/* Power Column */}
            <div className='flex flex-col '>
              <div className="flex items-center gap-2">
                {/* icon for Power */}
                <Image src='/power.png' alt='Area' width={20} height={20}/>
                <span>Power</span> {/* Label for Power */}
              </div>
              {/* Dynamic Power value, made bolder and slightly larger to match the image. */}
              <p className="font-medium text-2xl  mt-1 text-[#020817] ">{project.power}</p>
            </div>
          </div>

          {/* Unique Selling Proposition */}
          <div className={`${project.uspBgColor} ${project.uspTextColor} text-sm font-semibold py-4 rounded-4xl text-center`}>
            {project.usp}
          </div>
        </div>
      </div>
    </Link>
  );
};

