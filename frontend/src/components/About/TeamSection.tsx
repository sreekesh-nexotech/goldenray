import React from "react";
import TeamMember from "./TeamMember";

// Sample data structure for team members (can be replaced with API data)
const teamMembers = [
  {
    name: "Jude James",
    title: "Operations Manager",
    linkedin: "https://www.linkedin.com/in/jude-james-38b45263/",
    imageUrl: "https://golden-ray.b-cdn.net/images/Operations%20Manager.jpg",
  },
  {
    name: "Aromal K M",
    title: "CTO - Chief Technology Officer",
    linkedin:
      "https://www.linkedin.com/in/aromal-km-627ba3325/?originalSubdomain=in",
    imageUrl: "https://golden-ray.b-cdn.net/About%20us/Team/Aromal%20KM.jpg",
  },
  {
    name: "Ananthakrishnan G",
    title: "Project Head",
    linkedin: "https://www.linkedin.com/in/ananthakrishnan-g-4421b1276/",
    imageUrl: "https://golden-ray.b-cdn.net/images/Project%20Head%20.jpg",
  },
  {
    name: "Anupriya MS",
    title: "Sales Head",
    linkedin: "https://www.linkedin.com/in/anupriya-m-s-22b989338/",
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
