import React from "react";
import TeamMember from "./TeamMember";

// Sample data structure for team members (can be replaced with API data)
const teamMembers = [
  {
    name: "Harikrishnan",
    title: "Founder & CEO",
    // description:
    //   "With a vision to make clean energy mainstream, John leads Flarece with innovation and sustainability at the core. When he's not revolutionizing the solar industry, he's exploring new tech for a greener future.",
    linkedin: "#",
    imageUrl: "https://gym-manager-pull.b-cdn.net/golden_ray/about/team1.png",
  },
  {
    name: "ANANTHAKRISHNAN G",
    title: "Project Head",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/ananthakrishnan-g-4421b1276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl: "https://golden-ray.b-cdn.net/images/Ananthakrishnnan%20G.jpeg",
  },
  {
    name: "JUDE JAMES",
    title: "Operational Manager",
    // description:
    //   "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin: "https://www.linkedin.com/in/jude-james-38b45263/",
    imageUrl: "https://golden-ray.b-cdn.net/images/Jude%20James.jpeg",
  },
  {
    name: "AROMAL KM",
    title: "CTO",
    // description:
    //   "Sarah is the mastermind behind Flarece's cutting-edge solar tech. With years of experience in renewable energy, she ensures our solutions are efficient, and future-proof.",
    linkedin:
      "https://www.linkedin.com/in/aromal-km-627ba3325/?originalSubdomain=in",
    imageUrl: "https://golden-ray.b-cdn.net/images/Aromal%20KM.jpg",
  },
  {
    name: " ANUPRIYA MS ",
    title: "Sales Head",
    // description:
    //   "From installations to customer support, Mark makes sure everything runs smoothly. His mission? A seamless, hassle-free solar experience for every customer.",
    linkedin:
      "https://www.linkedin.com/in/anupriya-m-s-22b989338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl: "https://golden-ray.b-cdn.net/images/Anupriya%20MS.jpeg",
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
              // description={member.description}
              linkedin={member.linkedin}
              // twitter={member.twitter}
              imageUrl={member.imageUrl}
              imageScale={index === 2 ? 2 : 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
