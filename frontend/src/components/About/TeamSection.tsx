import React from "react";
import TeamMember from "./TeamMember";

// Sample data structure for team members (can be replaced with API data)
const defaultDescription =
  "Bookworm, creative software developer with precision";

const teamMembers = [
  {
    name: "Jude Jame",
    title: "Operations Manager",
    description: defaultDescription,
    linkedin: "https://www.linkedin.com/in/jude-james-38b45263/",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Jude%20James.jpeg",
  },
  {
    name: "Aromal K M",
    title: "CTO - Chief Technology Officer",
    description: defaultDescription,
    linkedin:
      "https://www.linkedin.com/in/aromal-km-627ba3325/?originalSubdomain=in",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Aromal%20KM.jpg",
  },
  {
    name: "Ananthakrishnan G",
    title: "Project Manager",
    description: defaultDescription,
    linkedin:
      "https://www.linkedin.com/in/ananthakrishnan-g-4421b1276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl:
      "https://golden-ray.b-cdn.net/About%20us/Team/Ananthakrishnnan%20G.jpeg",
  },
  {
    name: "Anupriya MS",
    title: "Sales Head",
    description: defaultDescription,
    linkedin:
      "https://www.linkedin.com/in/anupriya-m-s-22b989338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Anupriya%20MS.jpeg",
  },
  
];

const TeamSection = ({ members = teamMembers }) => {
  return (
    <section
      id="team"
      className="scroll-mt-[65px] py-16 px-4 sm:px-6 lg:px-4 xl:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#123532]">
            The People Behind Us
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {members.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              title={member.title}
              description={member.description}
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
