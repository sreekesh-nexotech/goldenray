// components/ProjectCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the Project interface for type safety
interface Project {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  area: string;
  power: string;
  usp: string; // Unique Selling Proposition, like "1 TON CO₂ SAVED ANNUALLY"
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    // Link to the dynamic project detail page
    <Link href={project.id} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
        {/* Project Image */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            layout="fill" // Use layout="fill" to make the image fill its parent
            objectFit="cover" // Cover the area, cropping if necessary
            className="rounded-t-lg"
            
          />
        </div>

        {/* Project Details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{project.location}</p>
          <p className="text-gray-700 text-base mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Area and Power Section */}
          <div className="flex justify-between items-center text-sm text-gray-800 mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span>Area: {project.area}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              <span>Power: {project.power}</span>
            </div>
          </div>

          {/* Unique Selling Proposition */}
          <div className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-2 rounded-full text-center">
            {project.usp}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

