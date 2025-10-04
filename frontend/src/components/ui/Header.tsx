/* golden-ray/frontend/src/components/ui/Header.tsx */
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo_header.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    // The outer header is full-width, but the content inside is constrained.
    <header className="py-4 shadow-md bg-white fixed w-full top-0 z-50">
      {/* This new container div constrains the content to a max-width and centers it. */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="w-[110px] md:w-[130px]">
          <Link href="/">
            <Image
              src={logo}
              alt="Flaize Logo"
              width={130}
              height={130}
              sizes="(max-width: 768px) 110px, 130px"
              style={{ width: '100%', height: 'auto' }}
            />
          </Link>
        </div>

        <nav>
          <ul className="hidden md:flex gap-6 text-gray-600 font-medium md:justify-center md:items-center">
            <li>
              <Link href="/solutions" className={`relative text-[clamp(0.9rem,0.9vw,1rem)] ${isActive("/solutions") ? "font-bold before:w-1/2" : ""} hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-500 before:ease-in-out hover:before:w-1/2`}>
                Our Solutions
              </Link>
            </li>
            <li>
              <Link href="/projects" className={`relative text-[clamp(0.9rem,0.9vw,1rem)] ${isActive("/projects") ? "font-bold before:w-1/2" : ""} hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}>
                Our Projects
              </Link>
            </li>
            <li>
              <Link href="/resources" className={`relative text-[clamp(0.9rem,0.9vw,1rem)] ${isActive("/resources") ? "font-bold before:w-1/2" : ""} hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}>
                Resources
              </Link>
            </li>
            <li>
              <Link href="/about" className={`relative text-[clamp(0.9rem,0.9vw,1rem)] ${isActive("/about") ? "font-bold before:w-1/2" : ""} hover:font-bold transition-all duration-200 before:content-[''] before:absolute before:bottom-[-0.25rem] before:left-0 before:h-[0.1875rem] before:rounded-lg before:bg-[#FBC207] before:w-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-1/2`}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="#footer" className="border border-[#074A4D] px-4 py-1 flex justify-center rounded-xl hover:bg-transparent text-[#074A4D] font-sans font-semibold text-base">
                Contact us
              </Link>
            </li>
          </ul>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2"  aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu remains full-width, which is correct */}
      <ul className={`font-dm-sans absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-4 md:hidden transition-all duration-300 ease-in-out pb-10 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <li><Link href="/solutions" className={`relative text-gray-700 font-medium ${isActive("/solutions") ? "font-bold" : ""}`}>Our Solutions</Link></li>
        <li><Link href="/projects" className={`relative text-gray-700 font-medium ${isActive("/projects") ? "font-bold" : ""}`}>Our Projects</Link></li>
        <li><Link href="/resources" className={`relative text-gray-700 font-medium ${isActive("/resources") ? "font-bold" : ""}`}>Resources</Link></li>
        <li><Link href="/about" className={`relative text-gray-700 font-medium ${isActive("/about") ? "font-bold" : ""}`}>About Us</Link></li>
        <li><Link href="#footer" className="border border-[#074A4D] px-4 py-1 rounded-xl hover:bg-transparent text-[#074A4D] font-sans font-semibold">Contact us</Link></li>
      </ul>
    </header>
  );
}
