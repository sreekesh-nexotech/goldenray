// src/components/Projects/GoalsChallengesSolutionSection.tsx
import React from 'react';

interface GoalsChallengesSolutionProps {
  projectGoals: string[];
  challenges: string[];
  solution: string[];
}

export default function GoalsChallengesSolutionSection({
  projectGoals,
  challenges,
  solution,
}: GoalsChallengesSolutionProps) {
  return (
    <div className="mb-12 space-y-12">
      {/* Project Goals */}
      {projectGoals && projectGoals.length > 0 && (
        <div className="p-8 md:px-20 flex flex-col text-left items-start xl:mx-70 mb-12">   
          <h2 className="text-xl md:text-[28px] font-semibold text-[#201D1D] mb-6">Project Goals</h2>
          <ul className="list-disc list-inside text-[#535862] text-base md:text-xl space-y-2">
            {projectGoals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenges */}
      {challenges && challenges.length > 0 && (
        <div className="p-8 rounded-2xl bg-[#F9F5E8] md:px-20 flex flex-col text-left items-start xl:mx-70 mb-12 mx-4">
          <h2 className="text-xl md:text-[28px] font-semibold text-[#201D1D] mb-6">Challenges</h2>
          <ul className="list-disc list-inside text-[#535862] text-base md:text-xl space-y-2">
            {challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
      )}

      {/* How We Solved Them */}
      {solution && solution.length > 0 && (
        <div className="p-8 rounded-2xl bg-[#E5F4F2] md:px-20 flex flex-col text-left items-start xl:mx-70 mb-12 mx-4">
          <h2 className="text-xl md:text-[28px] font-semibold text-[#201D1D] mb-6">How We Solved Them</h2>
          <ul className="list-disc list-inside text-[#535862] text-base md:text-xl space-y-2">
            {solution.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}