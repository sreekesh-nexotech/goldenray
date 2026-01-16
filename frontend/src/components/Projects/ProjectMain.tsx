"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/ui/Hero";
import ProjectCard from "@/components/Projects/Project-card";

//importing mock data
import { Project } from "@/data/Mock-projects";
import { mockProjects } from "@/data/Mock-projects";

export default function ProjectMain() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [loading, setLoading] = useState<boolean>(true); // Keep loading state for initial data load

  // Check URL hash on mount to set initial category
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash === "commercial") {
      setActiveCategory("Commercial");
    } else if (hash === "residential") {
      setActiveCategory("Residential");
    } else {
      setActiveCategory("All Projects");
    }
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === "commercial") {
        setActiveCategory("Commercial");
      } else if (hash === "residential") {
        setActiveCategory("Residential");
      } else {
        setActiveCategory("All Projects");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
    if (activeCategory === "All Projects") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === activeCategory)
      );
    }
  }, [projects, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Update URL hash based on category
    if (category === "Commercial") {
      window.location.hash = "commercial";
    } else if (category === "Residential") {
      window.location.hash = "residential";
    } else {
      // Remove hash for "All Projects"
      history.pushState("", document.title, window.location.pathname);
    }
  };

  const categories = ["All Projects", "Residential", "Commercial"];

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
      {/* Hero section */}
      <Hero
        title="Our Success Stories"
        description="See how we’re transforming homes, businesses, and industries with smart solar solutions"
      />

      {/* project content */}
      <div className=" mx-auto px-3 lg:px-18 xl:px-36 flex flex-col items-center mb-20">
        {/* Category Tabs */}
        <div className="flex justify-between items-center mb-16 p-2 bg-[#F3F3F3] xl:w-3/5 max-w-full rounded-full overflow-auto ">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                flex-1 text-center py-3 px-2 rounded-full text-xs md:text-xl font-medium transition duration-300 ease-in-out whitespace-nowrap cursor-pointer
                ${
                  activeCategory === category
                    ? "bg-white text-[#2C2821] font-semibold" // Active state: white background, dark text
                    : "text-[#123532] hover:bg-gray-100" // Inactive state: dark text, slight hover background
                }`}
              aria-label="filter projects by category"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-20">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
