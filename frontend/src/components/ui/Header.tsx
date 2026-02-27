/* golden-ray/frontend/src/components/ui/Header.tsx */
"use client";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const logo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logo_header.png";
  return (
    // The outer header is full-width, but the content inside is constrained.
    <header className="h-16 md:h-20 grid items-center shadow-md bg-white fixed w-full top-0 z-50">
      {/* This new container div constrains the content to a max-width and centers it. */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="w-[110px] md:w-[130px] flex items-center">
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
          <ul className="hidden md:flex gap-6 text-gray-600 font-medium leading-none md:justify-center md:items-center">
            <li
              className="relative"
              onMouseEnter={() => setSolutionsDropdownOpen(true)}
              onMouseLeave={() => setSolutionsDropdownOpen(false)}
            >
              <button
                className={`relative lg:text-xl flex items-center gap-1 ${
                  isActive("/solutions") ||
                  isActive("/residential") ||
                  isActive("/commercial")
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
                <Link
                  href="/residential"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  Residential
                </Link>
                <Link
                  href="/commercial"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  Commercial
                </Link>
              </div>
            </li>
            <li>
              <Link
                href="/projects"
                className={`relative lg:text-xl ${
                  isActive("/projects") ? "font-bold before:w-1/2" : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}
              >
                Our Projects
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className={`relative lg:text-xl ${
                  isActive("/blog") ? "font-bold before:w-1/2" : ""
                } hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}
              >
                Blog
              </Link>
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
              <Link
                href="/contactus"
                className="border border-[#074A4D] px-4 py-1 flex justify-center rounded-xl hover:bg-transparent text-[#074A4D] font-sans font-semibold lg:text-xl"
              >
                Contact us
              </Link>
            </li>
          </ul>
          <div className="md:hidden">
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
        className={`font-dm-sans leading-normal text-xl absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-4 md:hidden transition-all duration-300 ease-in-out pb-10 ${
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
            className={`flex flex-col items-center gap-3 overflow-hidden transition-all duration-300 ${
              solutionsDropdownOpen
                ? "max-h-40 mt-3 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <Link
              href="/residential"
              onClick={() => setIsOpen(false)}
              className={`text-gray-600 text-xl ${
                isActive("/residential") ? "font-bold" : ""
              }`}
            >
              Residential
            </Link>
            <Link
              href="/commercial"
              onClick={() => setIsOpen(false)}
              className={`text-gray-600 text-xl ${
                isActive("/commercial") ? "font-bold" : ""
              }`}
            >
              Commercial
            </Link>
          </div>
        </li>
        <li>
          <Link
            href="/projects"
            onClick={() => setIsOpen(false)}
            className={`relative text-gray-700 font-medium text-xl ${
              isActive("/projects") ? "font-bold" : ""
            }`}
          >
            Our Projects
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className={`relative text-gray-700 font-medium text-xl ${
              isActive("/blog") ? "font-bold" : ""
            }`}
          >
            Blog
          </Link>
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
