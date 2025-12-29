// src/data/mockProjects.ts

// mock data for project page
export type Project = {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  title: string;
  cardDescription:string;
  description: string;
  PublishDate: string;
  images: string[];

  imageUrl: string;
  area?: string;
  power?: string;
  usp?: string;
  uspTextColor?: string;
  uspBgColor?: string;

  clientOverview?: {
    ClientOverviewDescription:string;
  };
  projectGoals?: string[];
  challenges?: string[];
  solution?: string[];
  metrics?: {
    systemSize: string;
    installationType: string;
    annualGeneration: string;
    roiPeriod: string;
  };
  lifestyleImpact?: string;
  testimonial?: {
    quote: string;
    author: string;
    image: string;
  };
};

export const mockProjects: Project[] = [
  //1st project
  {
    id: '1',
    category: 'Residential',
    title: 'Residential Project in Calicut, Kerala',
    cardDescription:"Rooftop installation for a townhouse for a family of four in Calicut, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/images/p1%20middle%20slide%20image%20.jpg', 'https://golden-ray.b-cdn.net/images/P1%20right%20side%20slide.jpg', 'https://golden-ray.b-cdn.net/images/P1%20leftside%20slide%20.jpg' ],
    imageUrl: 'https://golden-ray.b-cdn.net/images/p1%20middle%20slide%20image%20.jpg',
    area: '10,400 m2',
    power: '200 KW',
    usp: '1 TON CO₂ SAVED ANNUALLY',
    uspTextColor: 'text-[#AD812A]',
    uspBgColor: 'bg-[#FFF8E9]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Achieve significant savings on electricity bills',
      'Reduce carbon footprint and contribute to sustainability',
      'Become energy independent with a reliable solar solution',
    ],
    challenges: [
      'Limited rooftop space: careful layout required to maximize solar panel utilization.',
      'Aesthetics: Integrating panels without compromising the home’s appeal.',
      'Budget constraints: balancing cost-effectiveness with high-quality components.',
      'Intermittent power: ensuring consistent energy supply despite varying sunlight.'
    ],
    solution: [
      'Used premium-grade monocrystalline solar panels strategically positioned to maximize sun absorption throughout the day.',
      'Designed a sleek, low-profile mounting system to merge seamlessly with the home\'s architecture, preserving its aesthetic appeal.',
      'Installed a smart energy management system to optimize power usage, prioritize solar, and ensure a seamless power supply during outages.'
    ],
    metrics: {
      systemSize: '10 kW Rooftop Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~7,000 kWh',
      roiPeriod: '~4.0 years',
    },
    lifestyleImpact: "Switching to solar energy was one of the best decisions our family has made. Before, we were constantly worried about rising electricity bills, especially during the summer months. After installing solar panels, not only have we seen a huge drop in our energy costs, but we also feel proud knowing we're doing our part for the environment.Daily life feels lighter — literally and financially. We no longer hesitate to run the AC or charge all our devices. Plus, explaining clean energy to our kids has made them more conscious about sustainability from a young age.",
    testimonial: {
      quote: 'Switching to solar with Flarize was the best decision for my home. The team made the entire process seamless, from consultation to installation. Not only have I reduced my electricity bills by nearly 75%, but I also feel great knowing I’m contributing to a sustainable future. Their support team is always available, and the maintenance services are top-notch. Highly recommended!',
      author: 'Rajesh Sharma & Family, Cochin',      image: 'https://golden-ray.b-cdn.net/images/P1below%20section%20.jpg',    },
  },

  //2nd project
  {
    id: '2',
    category: 'Commercial',
    title: 'Commercial Project in Palakkad, Kerala',
    cardDescription:"500KW solar panel installation for a 5 story office building space in Palakkad, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/images/p2_middle_slide.jpg', 'https://golden-ray.b-cdn.net/images/P2_right_side_slide_.jpg', 'https://golden-ray.b-cdn.net/images/P2_left_side_slide_.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/images/p2_middle_slide.jpg',
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 1 WEEK',
    uspTextColor: 'text-[#124944]',
    uspBgColor: 'bg-[#EFF8F8]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Achieve substantial savings on electricity bills for the commercial operation.',
      'Enhance corporate social responsibility (CSR) initiatives.',
      'Ensure a consistent and reliable power supply for business operations.',
    ],
    challenges: [
      'Integrating solar panels on a large, existing building without disrupting operations.',
      'Optimizing panel placement for maximum energy harvest on varied roof surfaces.',
      'Meeting stringent safety regulations for commercial installations.',
      'Managing initial investment costs while ensuring long-term ROI.',
    ],
    solution: [
      'Implemented a comprehensive rooftop solar array covering all available space, using high-efficiency panels.',
      'Utilized advanced monitoring systems to track energy production and consumption in real-time.',
      'Phased installation approach to minimize disruption to daily business activities.',
      'Provided robust safety protocols and training for all personnel involved in the project.'
    ],
    metrics: {
      systemSize: '500 kW Commercial Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~350,000 kWh',
      roiPeriod: '~3.5 years',
    },
    lifestyleImpact: 'The commercial complex now operates with significantly reduced electricity costs, allowing for reinvestment into business growth. The company has enhanced its green credentials, appealing to environmentally conscious clients and employees. The reliable solar supply ensures uninterrupted business operations, even during peak demand periods. This project serves as a model for sustainable commercial development in the region.',
    testimonial: {
      quote: 'Flarize delivered an outstanding solar solution for our office. The project was completed on schedule, and the energy savings have exceeded our expectations. We are proud to be a leader in sustainable practices, thanks to their expertise.',
      author: 'CEO, GreenCorp Solutions',
      image: 'https://golden-ray.b-cdn.net/images/P2_below_section.jpg',
    },
  },

  //3rd project
  {
    id: '3',
    category: 'Residential',
    title: 'Residential Project in Thrissur, Kerala',
    cardDescription:"See how we’re transforming homes, businesses, and industries with smart solar solutions",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/images/P3_middle_slide.jpg', 'https://golden-ray.b-cdn.net/images/P3_right_side_slide.jpg', 'https://golden-ray.b-cdn.net/images/P3_left_side_slide.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/images/P3_middle_slide.jpg',
    area: '10,400 m2',
    power: '200 KW',
    usp: '1.2L ANNUAL SAVINGS PER YEAR',
    uspTextColor: 'text-[#1989BB]',
    uspBgColor: 'bg-[#E9F8FF]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Achieve substantial savings on electricity bills',
      'Transition to renewable energy for a greener household',
      'Ensure uninterrupted power supply for daily needs',
    ],
    challenges: [
      'Limited roof space and specific architectural design to consider for panel placement.',
      'Ensuring aesthetic integration with the traditional Kerala home style.',
      'Minimizing disruption during installation while maintaining daily family routines.',
    ],
    solution: [
      'Designed a custom solar solution that maximized available roof area while complementing the home’s design.',
      'Used high-efficiency solar panels and a robust inverter system for optimal energy conversion.',
      'Managed installation with minimal intrusion, ensuring rapid deployment and commissioning.',
      'Provided a user-friendly monitoring system for homeowners to track energy production and consumption.'
    ],
    metrics: {
      systemSize: '15 kW Residential Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~10,000 kWh',
      roiPeriod: '~4.5 years',
    },
    lifestyleImpact: 'The family in Thrissur now enjoys significantly lower electricity bills, allowing them to allocate savings to other areas. They benefit from a consistent power supply, avoiding outages that were previously common. This shift has also fostered a greater environmental awareness within the family, aligning with their desire for a sustainable lifestyle. The project has become a proud feature of their home, showcasing their commitment to green living.',
    testimonial: {
      quote: 'Flarize made going solar incredibly easy. The team was professional, efficient, and the system looks great on our home. We are already seeing huge savings and feel good about our reduced carbon footprint. Highly recommend their services!',
      author: 'The Menon Family, Thrissur',
      image: 'https://golden-ray.b-cdn.net/images/P3_below_section_image_.jpg',
    },
  },

  //4th project
  {
    id: '4',
    category: 'Residential',
    title: 'Residential Project in Cochin, Kerala',
    cardDescription:"200KW solar panel installation for a two story house in Cochin, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/images/P4_middle_image.jpg', 'https://golden-ray.b-cdn.net/images/P4_right_slide_image.jpg', 'https://golden-ray.b-cdn.net/images/P4_leftside_image_.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/images/P4_middle_image.jpg',
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 3 DAYS',
    uspTextColor: 'text-[#124944]',
    uspBgColor: 'bg-[#EFF8F8]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Achieve quick installation to immediately start generating solar power.',
      'Maximize energy independence for the household.',
      'Reduce long-term energy costs and environmental impact.',
    ],
    challenges: [
      'Short installation timeline requiring precise planning and execution.',
      'Ensuring minimal disturbance to the household during the installation process.',
      'Optimizing panel layout on a two-story roof for maximum sun exposure.',
    ],
    solution: [
      'Pre-fabricated components and streamlined logistics for rapid deployment.',
      'Utilized a highly skilled installation team to ensure efficiency and safety.',
      'Conducted thorough site assessment to plan optimal panel placement and wiring.',
      'Implemented a user-friendly monitoring system for homeowners to track daily energy production.'
    ],
    metrics: {
      systemSize: '8 kW Residential Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~6,000 kWh',
      roiPeriod: '~4.0 years',
    },
    lifestyleImpact: 'The Cochin family quickly realized the benefits of their new solar system, enjoying reduced electricity bills within days of installation. The rapid turnaround meant minimal disruption to their lives, and they now benefit from a consistent, clean energy supply. This project highlights Flarize’s ability to deliver efficient and impactful solar solutions on tight schedules, ensuring customer satisfaction and environmental benefit.',
    testimonial: {
      quote: 'We were amazed by how quickly Flarize installed our solar system. The team was incredibly professional and efficient. We are already seeing a significant drop in our electricity bills and are very happy with the results. Truly a seamless experience!',
      author: 'The Thomas Family, Cochin',
      image: 'https://golden-ray.b-cdn.net/images/p4_below_section_image_.jpg',
    },
  },

  //5th project
  {
    id: '5',
    category: 'Industrial',
    title: 'Industrial Project in Tuticorin, Tamil Nadu',
    cardDescription:"1MW solar panel installation for a 5 story office building space in Palakkad, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://gym-manager-pull.b-cdn.net/golden_ray/projects/Industrial-1.png', 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Industrial-1.png', 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Industrial-1.png'],
    imageUrl: 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Industrial-1.png',
    area: '10,400 m2',
    power: '200 KW',
    usp: '75000 KWH GENERATED PER YEAR',
    uspTextColor: 'text-[#AD812A]',
    uspBgColor: 'bg-[#FFF8E9]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Achieve significant cost savings on energy consumption.',
      'Ensure stable and reliable power supply for continuous industrial operations.',
      'Improve environmental compliance and corporate image through renewable energy adoption.',
    ],
    challenges: [
      'Designing a system for a large industrial footprint with complex roof structures and limited ground space.',
      'Integrating the solar system with existing plant machinery and electrical infrastructure.',
      'Adhering to strict industrial safety standards and operational timelines during installation.',
      'Ensuring maximum energy generation efficiency in challenging environmental conditions.',
    ],
    solution: [
      'Developed a custom large-scale rooftop solar solution optimized for the plant\'s unique layout and energy demands.',
      'Implemented a robust grid-tied system with advanced inverters for seamless power integration and stability.',
      'Executed installation during scheduled maintenance windows to minimize disruption to production.',
      'Installed a comprehensive monitoring and maintenance system to ensure peak performance and longevity.'
    ],
    metrics: {
      systemSize: '1 MW Industrial Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~750,000 kWh',
      roiPeriod: '~5.0 years',
    },
    lifestyleImpact: 'The industrial plant in Tuticorin now benefits from massively reduced operational electricity costs, contributing significantly to their bottom line. The reliable solar power ensures consistent production without fear of outages. This strategic investment has also boosted their sustainability profile, attracting environmentally conscious partners and reinforcing their commitment to responsible manufacturing. The project stands as a testament to efficient industrial-scale solar integration.',
    testimonial: {
      quote: 'Flarize delivered a monumental solar project for our facility. The entire process, from initial design to commissioning, was handled with utmost professionalism. Our energy savings are remarkable, and we are now a beacon of green industrial practices.',
      author: 'Operations Director, EnviroFab Inc.',
      image: 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-2.png',
    },
  },

  //6th project
  {
    id: '6',
    category: 'Residential',
    title: 'Residential Project in Madurai, Tamil Nadu',
    cardDescription:"See how we’re transforming homes, businesses, and industries with smart solar solutions",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-2.png', 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-1.png', 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-3.png'],
    imageUrl: 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-2.png',
    area: '10,400 m2',
    power: '200 KW',
    usp: 'INSTALLATION DONE IN 1 WEEK',
    uspTextColor: 'text-[#124944]',
    uspBgColor: 'bg-[#EFF8F8]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Ravi Menon, a homeowner in Calicut, wanted to reduce his dependency on the grid and lower his monthly electricity bills while embracing a greener lifestyle. He lives with his wife and two kids in a townhouse with 5 bedrooms.His monthly electricity bill was incredibly high, especially in the summers where it goes above 40deg and using air conditioning becomes expensive."
    },
    projectGoals: [
      'Minimize dependency on the grid and reduce electricity costs.',
      'Contribute to environmental conservation through renewable energy.',
      'Ensure a consistent power supply for household needs.',
    ],
    challenges: [
      'Optimizing panel placement on a multi-sloped residential roof.',
      'Ensuring quick and efficient installation with minimal disruption to the household.',
      'Designing a system that performs optimally in Madurai\'s hot climate.',
    ],
    solution: [
      'Customized solar panel layout to maximize sun exposure and energy generation on the specific roof design.',
      'Utilized high-temperature tolerant solar panels and efficient cooling techniques for optimal performance in heat.',
      'Coordinated installation to be completed within a week, ensuring minimal inconvenience to the family.',
      'Provided advanced monitoring tools for the homeowners to track their energy production and savings easily.'
    ],
    metrics: {
      systemSize: '12 kW Residential Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '~8,500 kWh',
      roiPeriod: '~4.2 years',
    },
    lifestyleImpact: 'The Madurai family now enjoys substantial reductions in their electricity bills and the peace of mind that comes with energy independence. The new solar system provides consistent power, even during peak demand, enhancing their comfort. They are proud to contribute to a sustainable future, setting an example for their community. This project demonstrates Flarize\'s commitment to delivering tailored and efficient solar solutions for every home.',
    testimonial: {
      quote: 'Flarize provided an excellent solar solution for our home in Madurai. The team was very professional and efficient, completing the installation quickly. We are thrilled with the savings on our electricity bills and are proud to be part of the green movement.',
      author: 'The Sharma Family, Madurai',
      image: 'https://gym-manager-pull.b-cdn.net/golden_ray/projects/Residential-2.png',
    },
  },
];