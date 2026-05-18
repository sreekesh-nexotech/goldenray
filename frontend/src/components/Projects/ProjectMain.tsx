"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Hero from "@/components/ui/Hero";
import ProjectCard from "@/components/Projects/Project-card";

import { Project } from "@/data/Mock-projects";
import { mockProjects } from "@/data/Mock-projects";

const CATEGORIES = ["All Projects", "Residential", "Commercial"] as const;
type Category = (typeof CATEGORIES)[number];

const categoryFromParam = (value: string | null): Category => {
  if (value === "commercial") return "Commercial";
  if (value === "residential") return "Residential";
  return "All Projects";
};

const paramFromCategory = (category: Category): string | null => {
  if (category === "Commercial") return "commercial";
  if (category === "Residential") return "residential";
  return null;
};

export default function ProjectMain() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = categoryFromParam(searchParams.get("category"));

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All Projects") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const handleCategoryChange = (category: Category) => {
    const param = paramFromCategory(category);
    const next = new URLSearchParams(searchParams.toString());
    if (param) {
      next.set("category", param);
    } else {
      next.delete("category");
    }
    const queryString = next.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">
          Loading projects...
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <Hero
        title="Our Success Stories"
        description="See how we’re transforming homes, businesses, and industries with smart solar solutions"
      />

      <div className=" mx-auto px-3 lg:px-18 xl:px-36 flex flex-col items-center mb-20">
        <div className="flex justify-between items-center mb-16 p-2 bg-[#F3F3F3] xl:w-3/5 max-w-full rounded-full overflow-auto ">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                flex-1 text-center py-3 px-2 rounded-full text-xs md:text-xl font-medium transition duration-300 ease-in-out whitespace-nowrap cursor-pointer
                ${
                  activeCategory === category
                    ? "bg-white text-[#2C2821] font-semibold"
                    : "text-[#123532] hover:bg-gray-100"
                }`}
              aria-label="filter projects by category"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
