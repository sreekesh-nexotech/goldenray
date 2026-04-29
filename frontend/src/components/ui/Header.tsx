/* golden-ray/frontend/src/components/ui/Header.tsx */
"use client";
import { useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LinkingButton from "./LinkingButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [serviceLocationDropdownOpen, setServiceLocationDropdownOpen] = useState(false);


  const firstLocations = [
  { name: "Alappuzha", href: "#" },
  { name: "Thiruvananthapuram", href: "#" },
  { name: "Malappuram", href: "#" },
  { name: "Ernakulam", href: "#" },
  { name: "Kozhikode", href: "#" },
  { name: "Thrissur", href: "#" },
];

const allLocations = [
  ...firstLocations,
  { name: "Palakkad", href: "#" },
  { name: "Kollam", href: "#" },
  { name: "Idukki", href: "#" },
  { name: "Kasargod", href: "#" },
  { name: "Pathanamthitta", href: "#" },
  { name: "Kannur", href: "#" },
  { name: "Wayanadu", href: "#" },
];

const [showAllLocations, setShowAllLocations] = useState(false);

const solutions = [
  { name: "Residential", href: "/residential" },
  { name: "Commercial", href: "/commercial" },
  { name: "Group Purchase", href: "#" },
  { name: "Our Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
];

const tools = [
  { name: "Check Your Monthly Cost", href: "#" },
  { name: "Review Your Solar Quote", href: "#" },
  { name: "Compare Solar Options", href: "/solar-comparison" },
  { name: "Choose the Right Inverter", href: "#" },
];



  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const logo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logo_header.png";
  return (
    // The outer header is full-width, but the content inside is constrained.
    <header className="h-16 md:h-20 grid items-center shadow-md bg-white fixed w-full top-0 z-50">
      {/* This new container div constrains the content to a max-width and centers it. */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="w-[100px] md:w-[110px] flex items-center">
          <Link href="/">
            <Image
              src={logo}
              alt="Flaize Logo"
              width={130}
              height={130}
              sizes="(max-width: 768px) 110px, 130px"
              className="w-full h-auto max-h-10 md:max-h-14 object-contain"
              priority
            />
          </Link>
        </div>

        <nav>
          <ul className="hidden xl:flex gap-6 text-gray-600 text-sm font-medium leading-none md:justify-center md:items-center">
            <li
              className="relative"
              onMouseEnter={() => setSolutionsDropdownOpen(true)}
              onMouseLeave={() => setSolutionsDropdownOpen(false)}
            >
              <button
                className={`relative lg:text-xl flex items-center gap-1 ${
                  isActive("/solutions") ||
                  isActive("/residential") ||
                  isActive("/commercial") ||
                  isActive("/projects") ||
                  isActive("/blog")
                    ? "font-bold before:w-1/2"
                    : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-500 before:ease-in-out hover:before:w-1/2`}
              >
                Our Solutions
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    solutionsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200 ${
                  solutionsDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {solutions.map((solution, idx) => (
                  <Link
                    key={solution.name + idx}
                    href={solution.href}
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                  >
                    {solution.name}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link
                href="#"
                className={`relative lg:text-xl ${
                  isActive("") ? "font-bold before:w-1/2" : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}
              >
                How Flarize Works
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                className={`relative lg:text-xl flex items-center gap-1 ${
                  isActive("/tools")
                    ? "font-bold before:w-1/2"
                    : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-500 before:ease-in-out hover:before:w-1/2`}
              >
                Tools
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    toolsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200 ${
                  toolsDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {tools.map((tool, idx) => (
                  <Link
                    key={tool.name + idx}
                    href={tool.href}
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setServiceLocationDropdownOpen(true)}
              onMouseLeave={() => setServiceLocationDropdownOpen(false)}
            >
              <button
                className={`relative lg:text-xl flex items-center gap-1 ${
                  isActive("/locations")
                    ? "font-bold before:w-1/2"
                    : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-500 before:ease-in-out hover:before:w-1/2`}
              >
                Service Locations
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    serviceLocationDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full -left-50 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200 min-w-[650px] ${
                  serviceLocationDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="grid grid-cols-2 gap-y-2 px-4 py-3">
                  {(showAllLocations ? allLocations : firstLocations).map(
                    (location, index) => (
                      <Link
                        key={index}
                        href={location.href}
                        className="block px-2 py-2 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                      >
                        Solar Services In {location.name}
                      </Link>
                    )
                  )}
                </div>

                {!showAllLocations && (
                  <button
                    onClick={() => setShowAllLocations(true)}
                    className="w-full text-left px-6 py-3 text-sm font-medium text-[#074A4D] hover:bg-gray-50"
                  >
                    View All Locations <ArrowRight size={16} className="inline-block ml-1" />
                  </button>
                )}
              </div>
            </li>

            <li>
              <Link
                href="/about"
                className={`relative lg:text-xl ${
                  isActive("/about") ? "font-bold before:w-1/2" : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}
              >
                About Us
              </Link>
            </li>
            <li>
              <LinkingButton content="Contact us" ButtonLink="/contactus" ButtonBorder="border border-[#074A4D]" ButtonBg="bg-[#FFFFFF]" Buttontext="text-[#074A4D]" ButtonHover="hover:bg-[#eeeeee]" />
            </li>

            <li>
              <LinkingButton content="Calculate Your Savings" ButtonLink="/advanced-calculator" ButtonBg="bg-[#F7BA41]" Buttontext="text-[#272218]" ButtonHover="hover:bg-yellow-500" />
            </li>
          </ul>
          <div className="xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu remains full-width, which is correct */}
      <ul
        className={`font-dm-sans leading-normal text-xl absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start gap-6 p-4 xl:hidden transition-all duration-300 ease-in-out pb-10 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Mobile Solutions Dropdown */}
        <li className="flex flex-col items-center">
          <button
            onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
            className={`relative text-gray-700 font-medium text-xl flex items-center gap-1 ${
              isActive("/residential") || isActive("/commercial")
                ? "font-bold"
                : ""
            }`}
          >
            Our Solutions
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                solutionsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Mobile Dropdown Items */}
          <div
            className={`flex flex-col items-start gap-3 overflow-x-hidden overflow-scroll transition-all duration-300 ${
              solutionsDropdownOpen
                ? "max-h-50 mt-3 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {solutions.map((solution,idx) => (
              <Link
                key={solution.name + idx}
                href={solution.href}
                className={`text-gray-600 text-xl ${
                isActive(solution.href) ? "font-bold" : ""
              } `}
              >
                {solution.name}
              </Link>
            ))}
          </div>
        </li>

        <li>
          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className={`relative text-gray-700 font-medium text-xl ${
              isActive("#") ? "font-bold" : ""
            }`}
          >
            How Flarize Works
          </Link>
        </li>

        <li>
          <button
            onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
            className={`relative text-gray-700 font-medium text-xl flex items-center gap-1 ${
              isActive("#") 
                ? "font-bold"
                : ""
            }`}
          >
            Tools
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                toolsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Mobile Dropdown Items */}
          <div
            className={`flex flex-col items-start gap-3 overflow-x-hidden overflow-scroll transition-all duration-300 ${
              toolsDropdownOpen
                ? "max-h-50 mt-3 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {tools.map((tool, idx) => (
              <Link
                key={tool.name + idx}
                href={tool.href}
                className={`text-gray-600 text-xl ${
                isActive(tool.href) ? "font-bold" : ""
              } `}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </li>
        
        <li>
          <button
            onClick={() => setServiceLocationDropdownOpen(!serviceLocationDropdownOpen)}
            className={`relative text-gray-700 font-medium text-xl flex items-center gap-1 ${
              isActive("#") 
                ? "font-bold"
                : ""
            }`}
          >
            Service Locations
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                serviceLocationDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Mobile Dropdown Items */}
          <div
            className={`flex flex-col items-start gap-3 overflow-x-hidden overflow-scroll transition-all duration-300 ${
              serviceLocationDropdownOpen
                ? "max-h-50 mt-3 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {allLocations.map((location, idx) => (
              <Link
                key={location.name + idx}
                href={location.href}
                className={`text-gray-600 text-xl ${
                isActive(location.href) ? "font-bold" : ""
              } `}
              >
                Solar Service in {location.name}
              </Link>
            ))}
          </div>
        </li>

        <li>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`relative text-gray-700 font-medium text-xl ${
              isActive("/about") ? "font-bold" : ""
            }`}
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/contactus"
            onClick={() => setIsOpen(false)}
            className="border border-[#074A4D] px-4 py-1 rounded-xl hover:bg-transparent text-[#074A4D] font-sans font-semibold text-xl"
          >
            Contact us
          </Link>
        </li>
      </ul>
    </header>
  );
}
