"use client";
import Link from 'next/link';
import Image from 'next/image';
import footerLogo from '../../../public/Mask-group.png';
import LinkedInLogo from '../../../public/LinkedinLogo.png';
import FacebookLogo from '../../../public/FacebookLogo.png';
import InstagramLogo from '../../../public/InstagramLogo.png';
import YoutubeLogo from '../../../public/YoutubeLogo.png';

export default function Footer() {
  // Form handling
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Check if the form is valid
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const name = formData.get('name') as string;
      console.log('Name:', name);
      const mobileNumber = formData.get('mobileNumber') as string;
      console.log('Mobile Number:', mobileNumber);
      form.reset(); // Reset form only if valid
      // API calling goes here
    } else {
      // Trigger browser validation UI
      form.reportValidity();
    }
  };

  return (
    <section className="w-full bg-[#074A4D] rounded-t-3xl text-white py-16 px-4 sm:px-8 md:px-12 relative overflow-hidden">
      {/* Grid Background Layer */}
      <div
        className="absolute inset-0 z-0 opacity-50 pointer-events-none 
          bg-[url('../../public/grid.svg')] 
          bg-no-repeat 
          bg-auto"
        style={{
          WebkitMaskImage: `
            radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%),
            linear-gradient(to right, transparent 1%, black 50%, transparent 99%),
            linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)
          `,
          maskImage: `
            radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%),
            linear-gradient(to right, transparent 1%, black 50%, transparent 99%),
            linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)
          `,
          WebkitMaskComposite: 'intersect',
          maskComposite: 'intersect',
        }}
      />

      <div className="max-w-7xl z-10 mx-auto flex flex-col md:flex-row gap-10 justify-between">
        {/* Left - Text Content */}
        <div>
          <h2 className="lg:text-[64px]/15 text-[40px]/9 md:text-left text-center font-bold mb-4">
            Ready to go<br /> solar with us?
          </h2>
          <p className="lg:text-2xl text-xl md:text-left text-center text-[#DBD8D8]">
            We&apos;re just a message away!
          </p>
        </div>

        {/* Right - Form */}
        <form className="flex flex-col gap-4 w-full max-w-sm max-sm:max-w-full" onSubmit={handleSubmit} noValidate={false}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="px-4 py-3 rounded-xl text-black bg-white focus:outline-none"
            required
            pattern="[A-Za-z\s]{3,}"
            title="Please enter at least 3 alphabetic characters."
          />
          <input
            type="tel" 
            name="mobileNumber"
            placeholder="Mobile Number"
            className="px-4 py-3 rounded-xl text-black bg-white mb-3 focus:outline-none"
            required
            pattern="[0-9\s\-+]{7,15}" 
            title="Please enter a valid phone number."
          />

            <button type="submit" className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218]">Book Now</button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="relative bg-white z-10 text-black mt-12 rounded-2xl p-6 sm:p-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
          {/* Logo + Description */}
          <div className="w-full md:w-1/3 max-w-md mb-6 md:mb-0">
            <div className="font-bold text-xl mb-2">
              <Image src={footerLogo} alt="Footer Logo" width={120} height={40} />
            </div>
            <p className="text-sm text-[#444444] mb-4 md:mb-30">
              Golden Ray is a company working to bring accessible energy to everyone. Our mission is to empower people to be in charge of their own power
            </p>
            <div className="flex gap-4">
              <Link href="#">
                <Image src={LinkedInLogo} alt="Linkedin Logo" />
              </Link>
              <Link href="#">
                <Image src={FacebookLogo} alt="Facebook Logo" />
              </Link>
              <Link href="#">
                <Image src={InstagramLogo} alt="Instagram Logo" />
              </Link>
              <Link href="#">
                <Image src={YoutubeLogo} alt="Youtube Logo" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row flex-wrap gap-10 md:justify-end">
            {/* Column 1 */}
            <div className="min-w-[150px] space-y-3">
              <h1 className="text-[#666666] text-base font-light">Company</h1>
              <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                <li><Link href="/solutions" className="hover:text-gray-800 transition-all ease-in-out duration-300">Our Solutions</Link></li>
                <li><Link href="/projects" className="hover:text-gray-800 transition-all ease-in-out duration-300">Our Projects</Link></li>
                <li><Link href="/resources" className="hover:text-gray-800 transition-all ease-in-out duration-300">Resources</Link></li>
                <li><Link href="/about" className="hover:text-gray-800 transition-all ease-in-out duration-300">About Us</Link></li>
              </ul>
            </div>
            {/* Column 2 */}
            <div className="min-w-[150px] space-y-3">
              <h1 className="text-[#666666] text-base font-light">Resources</h1>
              <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                <li><Link href="/faq" className="hover:text-gray-800 transition-all ease-in-out duration-300">FAQs</Link></li>
                <li><Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">Blogs</Link></li>
                <li><Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">Newsletters</Link></li>
              </ul>
            </div>
            {/* Column 3 */}
            <div className="min-w-[150px] space-y-3">
              <h1 className="text-[#666666] text-base font-light">Legal</h1>
              <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                <li><Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">Legal Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs mt-6 text-gray-300">
        © 2025 GoldenRay. All rights reserved.
      </p>
    </section>
  );
}