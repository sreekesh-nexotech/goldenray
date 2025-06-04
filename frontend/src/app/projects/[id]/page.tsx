// src/app/projects/[id]/page.tsx
'use client';

import InnerProject from '@/components/Projects/Inner-project';
import ProjectHero from '@/components/Projects/ProjectHero';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

//importing mock data
import { Project } from '@/data/Mock-projects';
import { mockProjects } from '@/data/Mock-projects';
import SolarAdvantageMain from '@/components/solar-calculator/SolarAdvantageMain';


export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundProject = mockProjects.find((p) => p.id === id);
      setProject(foundProject || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
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
      <ProjectHero
        title={project.title}
        PublishDate={project.PublishDate}
      />
      <InnerProject project={project} />
      <SolarAdvantageMain/>
    </section>
  );
}