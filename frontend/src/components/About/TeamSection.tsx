import React from 'react';
import TeamMember from './TeamMember';

// Sample data structure for team members (can be replaced with API data)
const teamMembers = [
  {
    name: "John Doe",
    title: "Founder & CEO",
    description: "With a vision to make clean energy mainstream, John leads Flarece with innovation and sustainability at the core. When he's not revolutionizing the solar industry, he's exploring new tech for a greener future.",
    linkedin: "#",
    imageUrl: "/team1.png"
  },
  {
    name: "Sarah Smith",
    title: "Founder & CEO",
    description: "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    twitter: "#",
    imageUrl: "/team2.png"
  },
  {
    name: "Mark Johnson",
    title: "Head of Operations",
    description: "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin: "#",
    imageUrl: "/team3.png"
  },
  {
    name: "Sarah Smith",
    title: "Founder & CEO",
    description: "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    twitter: "#",
    imageUrl: "/team3.png"
  },
  {
    name: "Mark Johnson",
    title: "Head of Operations",
    description: "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin: "#",
    imageUrl: "/team1.png"
  },
  {
    name: "John Doe",
    title: "Founder & CEO",
    description: "With a vision to make clean energy mainstream, John leads Flarece with innovation and sustainability at the core. When he's not revolutionizing the solar industry, he's exploring new tech for a greener future.",
    linkedin: "#",
    imageUrl: "/team2.png"
  }
];

const TeamSection = ({ members = teamMembers }) => {
  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-16">
      {/* Section Heading Container */}
      <div className="max-w-7xl mx-auto text-center mb-16"> 
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532]">
          Meet Our Team
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            title={member.title}
            description={member.description}
            linkedin={member.linkedin}
            twitter={member.twitter}
            imageUrl={member.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamSection;