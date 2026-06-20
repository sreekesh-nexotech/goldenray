"use client";

import { Search, MapPin, Sun, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  keralaDistricts,
  SERVICE_OPTIONS,
  ALL_REGIONS,
  ALL_SERVICES,
} from "@/data/service-area-data";

type FilterDropdownProps = {
  value: string;
  options: string[];
  icon: React.ReactNode;
  onChange: (value: string) => void;
};

function FilterDropdown({ value, options, icon, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 hover:border-gray-300 transition-colors"
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          {value}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul className="absolute z-30 mt-2 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                  value === opt
                    ? "text-[#5A8C4E] font-medium bg-gray-50"
                    : "text-gray-700"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type ServiceAreaSearchProps = {
  search: string;
  setSearch: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  service: string;
  setService: (value: string) => void;
  onExplore: () => void;
};

export default function ServiceAreaSearch({
  search,
  setSearch,
  region,
  setRegion,
  service,
  setService,
  onExplore,
}: ServiceAreaSearchProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-6 pb-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-5 md:p-8">
        {/* Search input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onExplore();
          }}
          className="flex items-center gap-3 w-full bg-[#F5F6F7] rounded-xl px-4 py-3.5 mb-5"
        >
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search district or city"
            className="w-full bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder:text-gray-400"
          />
        </form>

        {/* Filters row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Region select */}
          <div>
            <label className="block text-sm font-semibold text-[#123532] mb-2">
              Select Kerala Region
            </label>
            <FilterDropdown
              value={region}
              onChange={setRegion}
              options={[ALL_REGIONS, ...keralaDistricts]}
              icon={<MapPin size={18} className="text-gray-500 shrink-0" />}
            />
          </div>

          {/* Service select */}
          <div>
            <label className="block text-sm font-semibold text-[#123532] mb-2">
              Target Solar Service Offered
            </label>
            <FilterDropdown
              value={service}
              onChange={setService}
              options={[ALL_SERVICES, ...SERVICE_OPTIONS]}
              icon={<Sun size={18} className="text-gray-500 shrink-0" />}
            />
          </div>

          {/* Explore button */}
          <button
            type="button"
            onClick={onExplore}
            className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] gap-2 h-[50px] w-full lg:w-auto"
          >
            <Search size={18} />
            Explore service areas
          </button>
        </div>
      </div>
    </section>
  );
}
