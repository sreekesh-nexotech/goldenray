// src/app/projects/[id]/page.tsx
import InnerProject from "@/components/Projects/Inner-project";
import ProjectHero from "@/components/Projects/ProjectHero";
import { notFound } from "next/navigation";
import { Metadata } from "next";

//importing mock data
import { mockProjects } from "@/data/Mock-projects";
import SolarAdvantageMain from "@/components/SolarCalculator/SolarAdvantageMain";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata for each project
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found - Flarize",
      description: "The requested solar project could not be found.",
    };
  }

  return {
    title: `${project.title} - Solar Project by Flarize`,
    description:
      project.description ||
      `Discover the ${project.title} solar installation project by Flarize in Kerala. Learn about our expert solar solutions and successful implementations.`,
    openGraph: {
      title: `${project.title} - Flarize Solar Project`,
      description:
        project.description ||
        `Explore our ${project.title} solar installation project.`,
      url: `https://www.flarize.com/projects/${id}`,
      siteName: "Flarize",
      images: project.imageUrl
        ? [
            {
              url: project.imageUrl,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [
            {
              url: "/heroImg.png",
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Flarize`,
      description:
        project.description || `Explore our ${project.title} solar project.`,
      images: project.imageUrl ? [project.imageUrl] : ["/heroImg.png"],
    },
    alternates: {
      canonical: `https://www.flarize.com/projects/${id}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <section className="relative">
      <ProjectHero title={project.title} PublishDate={project.PublishDate} />
      <InnerProject project={project} />
      <SolarAdvantageMain />
    </section>
  );
}
