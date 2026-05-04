import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import LinkingButton from '../ui/LinkingButton';

const STATS = [
	{ number: '10+ Years', label: 'INDUSTRY EXP' },
	{ number: '300+', label: 'INSTALLATIONS' },
	{ number: 'APPROVED', label: 'MNRE & KSEB' },
	{ number: 'DEDICATED', label: 'PARTNER SUPPORT' },
];

const AffliateHero = () => {
	return (
		<>
			<section
					className="relative w-full flex items-center bg-cover bg-center bg-no-repeat lg:py-15"
					style={{
						backgroundImage: 'url(https://golden-ray.b-cdn.net/images/affiliate-hero.png)',
						backgroundPosition: 'center right',
						minHeight: 'clamp(280px, 100vw, 450px)',
					}}
				>
					{/* Overlay - responsive width */}
					<div className="absolute inset-0 w-full sm:w-3/4 md:w-2/3 bg-gradient-to-r from-white/90 sm:from-white/85 to-transparent z-0" />

					<div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16 gap-3 sm:gap-4">
					<div className="mb-2">
						<span className="flex items-center gap-1 bg-[#074A4D1A] text-[#074A4D] text-xs sm:text-sm font-medium rounded px-3 py-1">
							<Award color="#0B4740" /> Solar Affiliate Program Kerala | Earn Rs.8,000+ Per Installation
						</span>
					</div>
					<h1 className="font-bold text-[#171717] text-lg sm:text-2xl md:text-4xl lg:text-5xl leading-snug sm:leading-tight">
						Kerala&apos;s Most Trusted Solar Brand<br />
						<span className="text-[#F88A22]">Now Paying You</span> to Refer.
					</h1>
					<p className="text-[#444444] w-full max-w-2xl font-semibold text-xs sm:text-base md:text-lg leading-relaxed">
						Earn a <span className="text-[#16A34A]">structured commission for every successful solar installation you refer</span> with zero investment, no solar expertise required, and a dedicated partner manager handling every lead you send.
					</p>
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 w-full sm:w-auto">
	                    <LinkingButton content="Apply as Affiliate Partner →" ButtonLink="#apply" ButtonBg="bg-[#F7BA41]" ButtonHover="hover:bg-[#e6a73a]" Buttontext="text-[#272218]" />
						
						<Link href="#how-it-works" className="btn border border-[#074A4D] flex items-center justify-center gap-2 bg-transparent text-[#074A4D] hover:bg-[#f5f5f5] transition-all duration-200 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base">
							See How it works
						</Link>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="w-full bg-[#F3F4F6] py-6 sm:py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
						{STATS.map((stat, idx) => (
							<div key={idx} className="flex flex-col items-start text-center gap-1">
								<div className="text-base sm:text-xl font-semibold text-[#16A34A]">{stat.number}</div>
								<div className="text-base sm:text-xl font-medium text-[#525252]">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default AffliateHero;
