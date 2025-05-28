// src/components/Projects/Inner-project.tsx
'use client';

import React from 'react';
import Carousel from '@/components/Projects/Carousel';
import ClientOverviewSection from '@/components/Projects/ClientOverview';
import GoalsChallengesSolutionSection from '@/components/Projects/GoalsChallengeSolution';
import LifestyleImpactSection from '@/components/Projects/Lifestyle-impact';
import TestimonialSection from '@/components/Projects/Testimonial';

///importing project type for type safety
import { Project } from '@/data/Mock-projects';
import MetricsSection from '@/components/Projects/metrics';

type InnerProjectProps = {
  project: Project; // Still receives the full Project object
}

export default function InnerProject({ project }: InnerProjectProps) {
  if (!project) {
    return <div className="text-center p-8">Project data not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">

      {/* Carousel - pass project.images directly (which is string[]) */}
      <div className="mb-12">
        <Carousel images={project.images} />
      </div>

      {/* Client Overview Section */}
      {project.clientOverview && <ClientOverviewSection clientOverview={project.clientOverview} />}

      {/* Goals, Challenges, Solution Section */}
      {(project.projectGoals || project.challenges || project.solution) && (
        <GoalsChallengesSolutionSection
          projectGoals={project.projectGoals || []}
          challenges={project.challenges || []}
          solution={project.solution || []}
        />
      )}

      {/* Impact Metrics Section */}
      {project.metrics && <MetricsSection metrics={project.metrics} />}

      {/* Lifestyle Impact Section */}
      {project.lifestyleImpact && <LifestyleImpactSection lifestyleImpact={project.lifestyleImpact} />}

      {/* Testimonial Section */}
      {project.testimonial && <TestimonialSection testimonial={project.testimonial} />}

    </div>
  );
}