import React from "react";
import TeamMember from "./TeamMember";

// Sample data structure for team members (can be replaced with API data)
const teamMembers = [
  {
    name: "JUDE JAMES",
    title: "Operations Manager",
    // description:
    //   "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin: "https://www.linkedin.com/in/jude-james-38b45263/",
    imageUrl: "https://golden-ray.b-cdn.net/images/Jude%20James%20(1).jpeg",
  },
  {
    name: "AROMAL KM",
    title: "CTO - Chief Technology Officer",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/aromal-km-627ba3325/?originalSubdomain=in",
    imageUrl: "https://golden-ray.b-cdn.net/images/Aromal%20KM%20(1).jpg",
  },
  {
    name: "ANANTHAKRISHNAN G",
    title: "Project Manager",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/ananthakrishnan-g-4421b1276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl:
      "https://golden-ray.b-cdn.net/images/Ananthakrishnnan%20G%20(1).jpeg",
  },
  {
    name: " ANUPRIYA MS ",
    title: "Sales Head",
    // description:
    //   "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin:
      "https://www.linkedin.com/in/anupriya-m-s-22b989338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl: "https://golden-ray.b-cdn.net/images/Anupriya%20MS%20(1).jpeg",
  },
  // {
  //   name: "John Doe",
  //   title: "Founder & CEO",
  //   // description:
  //   //   "With a vision to make clean energy mainstream, John leads Flarece with innovation and sustainability at the core. When he's not revolutionizing the solar industry, he's exploring new tech for a greener future.",
  //   linkedin: "#",
  //   imageUrl: "https://gym-manager-pull.b-cdn.net/golden_ray/about/team2.png",
  // },
];

const TeamSection = ({ members = teamMembers }) => {
  return (
    <section id="team" className="scroll-mt-[65px]">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-16">
        {/* Section Heading */}
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3748]">
            Meet Our Team
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 lg:gap-24 max-w-7xl mx-auto">
          {members.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              title={member.title}
              linkedin={member.linkedin}
              imageUrl={member.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
