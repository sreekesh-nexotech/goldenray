// src/app/projects/[id]/page.tsx
'use client';

import InnerProject from '@/components/Projects/Inner-project';
import ProjectHero from '@/components/Projects/ProjectHero';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define a minimal Project type with only required fields
type Project = {
  id: string;
  title: string;
  description:string;
  descriptionBold:string;
  images: string[]; // Array for carousel images
};

// Minimal mock data with only id, title, and images
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Residential Project in Calicut, Kerala',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Residential-3.png', '/Residential-4.png', '/Residential-2.png'],
  },
  {
    id: '2',
    title: 'Commercial Project in Palakkad, Kerala',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Commercial-1.png', '/Commercial-1.png', '/Commercial-1.png'],
  },
  {
    id: '3',
    title: 'Residential Project in Thrissur, Kerala',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Residential-4.png', '/Residential-2.png', '/Residential-1.png'],
  },
  {
    id: '4',
    title: 'Residential Project in Cochin, Kerala',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Residential-1.png', '/Residential-3.png', '/Residential-4.png'],
  },
  {
    id: '5',
    title: 'Industrial Project in Tuticorin, Tamil Nadu',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Industrial-1.png', '/Industrial-1.png', '/Industrial-1.png'],
  },
  {
    id: '6',
    title: 'Residential Project in Madurai, Tamil Nadu',
    description: 'Published Completed',
    descriptionBold:'January 23, 2025',
    images: ['/Residential-2.png', '/Residential-1.png', '/Residential-3.png'],
  },
];

export default function ProjectPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching project data based on ID
  useEffect(() => {
    setLoading(true);
    // In the future, replace with an API call to fetch project by ID
    const timer = setTimeout(() => {
      const foundProject = mockProjects.find((p) => p.id === id);
      setProject(foundProject || null);
      setLoading(false);
    }, 500); // Simulate 0.5s loading time

    return () => clearTimeout(timer); // Cleanup timeout
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Project not found</div>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* Project heading - Pass title to ProjectHero */}
      <ProjectHero
        title={project.title}
        description={project.description} // Static fallback description
        descriptionBold={project.descriptionBold} // Static fallback bold description
      />

      {/* Detailed Project Content */}
      <InnerProject images={project.images}/>

    </section>
  );
}