'use client'; 



import React, { useState, useEffect } from 'react';
import Hero from "@/components/ui/Hero";
import ProjectCard from '@/components/Projects/Project-card';




// Define the Project type for type safety, same as in ProjectCard.tsx
type Project = {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  title: string;
  description: string;
  imageUrl: string;
  area: string;
  power: string;
  usp: string;
  uspTextColor:string;
  uspBgColor:string;
}

// Mock data for projects - replace this with actual data from your dashboard API
const mockProjects: Project[] = [
  {
    id: '1',
    category: 'Residential',
    title: 'Residential Project in Calicut, Kerala',
    description: 'Rooftop installation for a townhouse for a family of four in Calicut, Kerala',
    imageUrl: '/Residential-3.png', 
    area: '10,400 m2',
    power: '200 KW',
    usp: '1 TON CO₂ SAVED ANNUALLY',
    uspTextColor:'text-[#AD812A]',
    uspBgColor:'bg-[#FFF8E9]'
  },
  {
    id: '2',
    category: 'Commercial',
    title: 'Commercial Project in Palakkad, Kerala',
    description: '500KW solar panel installation for a 5 story office building space in Palakkad, Kerala',
    imageUrl: '/Commercial-1.png',
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 1 WEEK',
    uspTextColor:'text-[#124944]',
    uspBgColor:'bg-[#EFF8F8]'
  },
  {
    id: '3',
    category: 'Residential',
    title: 'Residential Project in Thrissur, Kerala',
    description: 'See how we’re transforming homes, businesses, and industries with smart solar solutions',
    imageUrl: '/Residential-4.png', 
    area: '10,400 m2',
    power: '200 KW',
    usp: '1.2L ANNUAL SAVINGS PER YEAR',
    uspTextColor:'text-[#1989BB]',
    uspBgColor:'bg-[#E9F8FF]'
  },
  {
    id: '4',
    category: 'Residential',
    title: 'Residential Project in Cochin, Kerala',
    description: '200KW solar panel installation for a two story house in Cochin, Kerala',
    imageUrl: '/Residential-1.png', 
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 3 DAYS',
    uspTextColor:'text-[#124944]',
    uspBgColor:'bg-[#EFF8F8]'
  },
  {
    id: '5',
    category: 'Industrial',
    title: 'Industrial Project in Tuticorin, Tamil Nadu',
    description: '1MW solar panel installation for a 5 story office building space in Palakkad, Kerala',
    imageUrl: '/Industrial-1.png',
    area: '10,400 m2',
    power: '200 KW',
    usp: '75000 KWH GENERATED PER YEAR',
    uspTextColor:'text-[#AD812A]',
    uspBgColor:'bg-[#FFF8E9]'
  },
  {
    id: '6',
    category: 'Residential',
    title: 'Residential Project in Madurai, Tamil Nadu',
    description: 'See how we’re transforming homes, businesses, and industries with smart solar solutions',
    imageUrl: '/Residential-2.png',
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION  DONE IN 1 WEEK',
    uspTextColor:'text-[#124944]',
    uspBgColor:'bg-[#EFF8F8]'
  },
];

export default function ProjectMain(){
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Projects');
  const [loading, setLoading] = useState<boolean>(true); // Keep loading state for initial data load

  // Simulate fetching data
  useEffect(() => {
    setLoading(true);
    // In future we can fetch data here from an API endpoint
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
      <div className=" mx-auto px-3 lg:px-18 xl:px-36 flex flex-col items-center mb-20">

        {/* Category Tabs */}
        <div className="flex justify-between items-center mb-16 p-2 bg-[#F3F3F3] xl:w-3/5 max-w-full rounded-full overflow-auto ">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                flex-1 text-center py-3 px-2 rounded-full text-xs md:text-xl font-medium transition duration-300 ease-in-out whitespace-nowrap cursor-pointer
                ${activeCategory === category
                  ? 'bg-white text-[#2C2821] font-semibold' // Active state: white background, dark text
                  : 'text-[#123532] hover:bg-gray-100' // Inactive state: dark text, slight hover background
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-20">
          {
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          }
        </div>

      </div>
    </section>
  );
};


