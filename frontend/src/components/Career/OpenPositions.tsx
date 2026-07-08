"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, ChevronDown, MapPin, PenTool, Search, Tag, Truck } from "lucide-react";

type Job = {
  title: string;
  department: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

const jobs: Job[] = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Kochi / Remote",
    icon: Briefcase,
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Alappuzha",
    icon: PenTool,
    href: "/career/ui-ux-designer",
  },
  {
    title: "Field Sales Lead",
    department: "Sales",
    location: "Alappuzha",
    icon: Tag,
  },
  {
    title: "Logistics Coordinator",
    department: "Operations",
    location: "Kochi",
    icon: Truck,
  },
];

const departments = ["All Department", ...Array.from(new Set(jobs.map((j) => j.department)))];

export default function OpenPositions() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Department");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.trim().toLowerCase());
      const matchesDepartment =
        department === "All Department" || job.department === department;
      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  return (
    <section id="open-positions" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Open Positions
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#444444]">
            Find your next challenge and join our mission.
          </p>
        </div>

        {/* Search & filter card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          {/* Search input */}
          <div className="flex items-center gap-3 bg-[#F4F5F6] rounded-lg px-4 py-3 mb-5">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent outline-none text-sm md:text-base text-[#121217] placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Department select */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#121217] mb-2">
                Select Department
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm md:text-base text-[#121217] outline-none focus:border-[#F7BA41] cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* View button */}
            <div className="flex items-end">
              <div className="flex items-center justify-center gap-2 bg-[#F7BA41] rounded-lg px-8 py-3 text-[#272218] font-semibold w-full sm:w-auto">
                <Search className="w-5 h-5" />
                <span>View Open Positions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job list */}
        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No positions match your search.
            </p>
          ) : (
            filteredJobs.map((job, index) => {
              const Icon = job.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F4F5F6] rounded-xl px-6 py-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-medium text-[#123532] mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  {job.href ? (
                    <Link
                      href={job.href}
                      className="flex-shrink-0 bg-[#F7BA41] hover:bg-yellow-500 transition-colors rounded-lg px-5 py-2.5 text-sm font-semibold text-[#272218] cursor-pointer"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex-shrink-0 bg-[#F7BA41] hover:bg-yellow-500 transition-colors rounded-lg px-5 py-2.5 text-sm font-semibold text-[#272218] cursor-pointer"
                    >
                      View Details
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
