'use client'; // This directive marks the component as a Client Component



import React, { useState, useEffect } from 'react';
import Hero from "@/components/ui/Hero";
import ProjectCard from '@/components/Projects/Project-card';




// Define the Project interface for type safety, same as in ProjectCard.tsx
interface Project {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  area: string;
  power: string;
  usp: string;
}

// Mock data for projects - replace this with actual data from your dashboard API
const mockProjects: Project[] = [
  {
    id: '1',
    category: 'Residential',
    title: 'Residential Project in Calicut, Kerala',
    location: 'Calicut, Kerala',
    description: 'Rooftop installation for a townhouse for a family of four in Calicut, Kerala.',
    imageUrl: '/Commercial-Image-2.png', // Using path from your public/images
    area: '10,400 m2',
    power: '200 KW',
    usp: '1 TON CO₂ SAVED ANNUALLY',
  },
  {
    id: '2',
    category: 'Commercial',
    title: 'Commercial Project in Palakkad, Kerala',
    location: 'Palakkad, Kerala',
    description: '500KW solar panel installation for a 5 story office building space in Palakkad, Kerala.',
    imageUrl: '/Commercial-Image-2.png', // Using path from your public/images
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 1 WEEK',
  },
  {
    id: '3',
    category: 'Residential',
    title: 'Residential Project in Trissur, Kerala',
    location: 'Trissur, Kerala',
    description: 'Solar power is transforming homes, businesses, and industries with smart solar solutions.',
    imageUrl: '/Commercial-Image-2.png', // Using path from your public/images
    area: '10,400 m2',
    power: '200 KW',
    usp: '12L ANNUAL SAVINGS PER YEAR',
  },
  {
    id: '4',
    category: 'Residential',
    title: 'Residential Project in Cochin, Kerala',
    location: 'Cochin, Kerala',
    description: '200KW solar panel installation for a two-story townhouse in Cochin, Kerala.',
    imageUrl: '/Commercial-Image-2.png', 
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 3 DAYS',
  },
  {
    id: '5',
    category: 'Industrial',
    title: 'Industrial Project in Coimbatore, TN',
    location: 'Coimbatore, Tamil Nadu',
    description: 'Large-scale solar farm installation for a manufacturing plant, ensuring energy independence.',
    imageUrl: '/Commercial-Image-2.png',
    area: '50,000 m2',
    power: '1 MW',
    usp: 'REDUCED OPERATIONAL COSTS BY 30%',
  },
];

export default function Projects(){
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Projects');
  const [loading, setLoading] = useState<boolean>(true); // Keep loading state for initial data load

  // Simulate fetching data
  useEffect(() => {
    setLoading(true);
    // In a real application, you would fetch data here from an API endpoint
    // For now, we're using mock data with a slight delay to simulate network call
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 500); // Simulate 0.5 second loading time

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  // Filter projects whenever projects data or active category changes
  useEffect(() => {
    if (activeCategory === 'All Projects') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === activeCategory)
      );
    }
  }, [projects, activeCategory]);

  const categories = ['All Projects', 'Residential', 'Commercial', 'Industrial'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading projects...</div>
      </div>
    );
  }

  return (
    <section className="relative">
        {/* Hero section */}
        <Hero title="Our Success Stories" description="See how we’re transforming homes, businesses, and industries with smart solar solutions"/>
        
        
        {/* project content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition duration-300 ease-in-out whitespace-nowrap
                ${activeCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg">
              No projects found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};


