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
    title: 'Jose V P -Vadackkal, Alapuzha',
    cardDescription:"Rooftop installation for a townhouse for a family of four in Calicut, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg' , 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(2).jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(4).jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(2).jpg',
    area: '10,400 m2',
    power: '3 kW',
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
      author: 'Jose V P & Family, Vadackkal, Alapuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(1).jpg',
    },
  },

  //2nd project
  {
    id: '2',
    category: 'Residential',
    title: 'Siraj K P- Cherthala, Alapuzha',
    cardDescription:"500KW solar panel installation for a 5 story office building space in Palakkad, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/middleslide2%20ENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/rightsideslide%20ENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/leftsideslide%20ENHANCED.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/middleslide2%20ENHANCED.jpg',
    area: '10,400 m2',
    power: '3 kW',
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
      quote: 'Flarize delivered an outstanding solar solution for our home. The project was completed on schedule, and the energy savings have exceeded our expectations. We are proud to embrace sustainable practices, thanks to their expertise.',
      author: 'Siraj K P & Family, Cherthala, Alapuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/belowsection%20ENHANCED.jpg',
    },
  },

  //3rd project
  {
    id: '3',
    category: 'Residential',
    title: 'Stephen V C- Vattayal, Alapuzha',
    cardDescription:"See how we’re transforming homes, businesses, and industries with smart solar solutions",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/middleslide%20ENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/rightsideslide%20ENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/leftsideslide%20ENHANCED.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/middleslide%20ENHANCED.jpg',
    area: '10,400 m2',
    power: '3 kW',
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
      author: 'Stephen V C & Family, Vattayal, Alapuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/belowsectionimage%20ENHANCED.jpg',
    },
  },

  //4th project
  {
    id: '4',
    category: 'Residential',
    title: 'Ushaviswanathan - Thiruvambady, Alappuzha',
    cardDescription:"200KW solar panel installation for a two story house in Cochin, Kerala",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/middleimageENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/rightslideimageENHANCED.jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/leftsideimageENHANCED.jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/middleimageENHANCED.jpg',
    area: '10,400 m2',
    power: '5 kW',
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
      author: 'Ushaviswanathan & Family, Thiruvambady, Alappuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/belowsectionimageENHANCED.jpg',
    },
  },

  
];