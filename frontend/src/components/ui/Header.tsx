"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo_header.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current URL path

  // Function to determine if a link is active
  const isActive = (href:string) => pathname === href;

  return (
    <header className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8 xl:px-36 shadow-md bg-white fixed w-full top-0 z-50">
      <div className="text-2xl font-medium text-[#123532]">
       <Link href="/"> <Image src={logo}  alt="Flaize Logo" width={130} height={130}/> </Link>
      </div>

      {/* Navigation Bar */}
      <nav>
        {/* Navigation links visible on bigger screens, hidden on mobile */}
        <ul className="font-dm-sans hidden md:flex gap-6 text-gray-600 font-medium md:justify-center md:items-center">
          <li>
            <Link
              href="/solutions"
              className={`
                relative
                ${isActive("/solutions") ? "font-bold before:w-1/2" : ""}
                hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-500 
                before:ease-in-out
                hover:before:w-1/2
              `}
            >
              Our Solutions
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`
                relative
                ${isActive("/projects") ? "font-bold before:w-1/2" : ""}
                hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-1/2
              `}
            >
              Our Projects
            </Link>
          </li>
          <li>
            <Link
              href="/resources"
              className={`
                relative
                ${isActive("/resources") ? "font-bold before:w-1/2" : ""}
                hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-1/2
              `}
            >
              Resources
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`
                relative
                ${isActive("/about") ? "font-bold before:w-1/2" : ""}
                hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-1/2
              `}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link href="#footer" className=" border border-[#074A4D] px-4 py-1 flex justify-center rounded-xl hover:bg-transparent text-[#074A4D] font-sans text-base font-semibold">
              Contact us
            </Link>
          </li>
        </ul>

        {/* Hamburger menu: hidden on bigger devices, visible on mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu: Always in DOM, visibility toggled with classes */}
      <ul
        className={` font-dm-sans
          absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-4
          md:hidden
          transition-all duration-300 ease-in-out pb-10
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        <li>
          <Link
            href="/solutions"
            className={`
              relative
              text-gray-700 font-medium
              ${isActive("/solutions") ? "font-bold before:w-full" : ""}
              hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-1/2
            `}
          >
            Our Solutions
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className={`
              relative
              text-gray-700 font-medium
              ${isActive("/projects") ? "font-bold before:w-full" : ""}
              hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-1/2
            `}
          >
            Our Projects
          </Link>
        </li>
        <li>
          <Link
            href="/resources"
            className={`
              relative
              text-gray-700 font-medium
              ${isActive("/resources") ? "font-bold before:w-full" : ""}
              hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-full
            `}
          >
            Resources
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`
              relative
              text-gray-700 font-medium
              ${isActive("/about") ? "font-bold before:w-full" : ""}
              hover:font-bold
                transition-all duration-200
                before:content-[''] 
                before:absolute 
                before:bottom-[-4] 
                before:left-0 
                before:h-[3px] 
                before:rounded-lg
                before:bg-[#FBC207]
                before:w-0
                before:transition-all 
                before:duration-300 
                before:ease-in-out
                hover:before:w-full
            `}
          >
            About Us
          </Link>
        </li>
        <li>
          <Link href="#footer" className="border border-[#074A4D] px-4 py-1 rounded-xl hover:bg-transparent text-[#074A4D] font-sans text-base font-[600]">
              Contact us
          </Link>
        </li>
      </ul>
    </header>
  );
}