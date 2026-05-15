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
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Jude%20James.jpeg",
  },
  {
    name: "AROMAL KM",
    title: "CTO - Chief Technology Officer",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/aromal-km-627ba3325/?originalSubdomain=in",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Aromal%20KM.jpg",
  },
  {
    name: "ANANTHAKRISHNAN G",
    title: "Project Manager",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/ananthakrishnan-g-4421b1276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl:
      "https://golden-ray.b-cdn.net/About%20us/Team/Ananthakrishnnan%20G.jpeg",
  },
  {
    name: " ANUPRIYA MS ",
    title: "Sales Head",
    // description:
    //   "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin:
      "https://www.linkedin.com/in/anupriya-m-s-22b989338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Anupriya%20MS.jpeg",
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
    <section
      id="team"
      className="scroll-mt-[65px] py-16 px-4 sm:px-6 lg:px-4 xl:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#2D3748]">
            Meet Our Team
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-24 lg:gap-28 max-w-5xl mx-auto">
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
