import React from 'react';
import Image from 'next/image'; 
import ButtonYellow from '../ui/Button-yellow';
import ButtonWhite from '../ui/Button-white';

type SolutionBoxProps = {
    BoxBgColor:string;
    TextColor:string;
    circleBgColor:string;
    showYellowBtn?:boolean;
    showWhiteBtn?:boolean;
    BoxTitle:string;
    BoxDescription:string;
    BoxList1:string;
    BoxList2:string;
    BoxList3:string;
    BoxList4:string;
    BoxImg:string;
}



export default function SolutionBox({
    BoxBgColor,
    TextColor,
    circleBgColor,
    showYellowBtn = false,
    showWhiteBtn = false,
    BoxTitle,
    BoxDescription,
    BoxList1,
    BoxList2,
    BoxList3,
    BoxList4,
    BoxImg,
}:SolutionBoxProps){
  return (
    <section className="w-full py-5   flex items-center justify-center">
        {/* Main content card with responsive layout */}
        <div className={`bg-${BoxBgColor} rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden max-w-6xl mx-4 md:mx-8 xl:mx-auto justify-center items-center p-4 md:p-10`}>
            {/* Image only visible in mobile device */}
            <div className="w-full relative  min-h-0  lg:hidden block mb-4">
            <Image
              src={BoxImg}
              width={300}
              height={300}
              alt={BoxTitle}
              className="rounded-xl w-full h-full" 
            />
          </div>





          {/* Left Section: Text Content */}
          <div className={`lg:w-1/2 ${TextColor} flex flex-col justify-center`}>
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 leading-tight">
              {BoxTitle}
            </h2>
            <p className="text-base md:text-lg mb-6 opacity-90">
              {BoxDescription}
            </p>
            
            {/* List of benefits */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"> 
                <div className="relative w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center"> {/* Outer circle container */}
                  <span className={`absolute w-4 h-4 rounded-full bg-${circleBgColor} opacity-20`}></span> {/* Outer circle */}
                  <span className={`w-2 h-2 bg-${circleBgColor}  rounded-full`}></span> {/* Inner solid circle */}
                </div>
                <span className="text-base md:text-lg opacity-90">{BoxList1}</span>
              </li>

              <li className="flex items-center"> 
                <div className="relative w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center"> {/* Outer circle container */}
                  <span className={`absolute w-4 h-4 rounded-full bg-${circleBgColor} opacity-20`}></span> {/* Outer circle */}
                  <span className={`w-2 h-2 bg-${circleBgColor}  rounded-full`}></span> {/* Inner solid circle */}
                </div>
                <span className="text-base md:text-lg opacity-90">{BoxList2}</span>
              </li>

              <li className="flex items-center"> 
                <div className="relative w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center"> {/* Outer circle container */}
                  <span className={`absolute w-4 h-4 rounded-full bg-${circleBgColor} opacity-20`}></span> {/* Outer circle */}
                  <span className={`w-2 h-2 bg-${circleBgColor}  rounded-full`}></span> {/* Inner solid circle */}
                </div>
                <span className="text-base md:text-lg opacity-90">{BoxList3}</span>
              </li>

              <li className="flex items-center"> 
                <div className="relative w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center"> {/* Outer circle container */}
                  <span className={`absolute w-4 h-4 rounded-full bg-${circleBgColor} opacity-20`}></span> {/* Outer circle */}
                  <span className={`w-2 h-2 bg-${circleBgColor}  rounded-full`}></span> {/* Inner solid circle */}
                </div>
                <span className="text-base md:text-lg opacity-90">{BoxList4}</span>
              </li>

              
            </ul>

            {/* Call to action button */}
            <div>
                {showYellowBtn && <ButtonYellow content="View Projects" ButtonLink='/projects' />}
                {showWhiteBtn && <ButtonWhite content="View Projects" ButtonLink='/projects' />}
            </div>
          </div>

           {/* Right Section: Image only visible in larger device */}
          <div className="lg:w-1/2 relative  lg:min-h-0 hidden lg:block">
            <Image
              src={BoxImg}
              width={300}
              height={300}
              alt="Residential Solar Solution"
              className="rounded-xl w-full h-full" 
            />
          </div>
        </div>
    </section>
  );
};
