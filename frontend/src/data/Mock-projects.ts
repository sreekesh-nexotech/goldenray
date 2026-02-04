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
    cardDescription:"For Jose, sustainability was a way of life. Solar was about the future, not just savings.",
    description: 'Published Completed',
    PublishDate: 'January 23, 2025',
    images: ['https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg' , 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(2).jpg', 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(4).jpg'],
    imageUrl: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(3).jpg',
    area: '10,400 m2',
    power: '3 kW',
    usp: '1 TON CO₂ SAVED ANNUALLY',
    uspTextColor: 'text-[#AD812A]',
    uspBgColor: 'bg-[#FFF8E9]',

    clientOverview: {
      ClientOverviewDescription: "Mr. Jose V P wanted more than just lower electricity bills. Living in Vadackkal, Alapuzha, his goal was to create a home that runs responsibly, without disturbing its calm surroundings or daily routines. Rising power costs and unreliable supply made solar the right step forward, but only if it was done right, safely, and beautifully."
    },
    projectGoals: [
      'Reduce monthly electricity expenses without compromising comfort.',
      'Build a future-ready home powered by clean energy.',
      'Install a system that blends seamlessly with the house\'s aesthetics.',
      'Ensure long-term reliability with minimal maintenance.',
    ],
    challenges: [
      'Limited roof space with partial shading from nearby trees.',
      'Maintaining the home\'s visual appeal while installing solar panels.',
      'Ensuring consistent power output during varying weather conditions.',
      'Selecting components that balance performance, safety, and durability.'
    ],
    solution: [
      'We carefully assessed the roof layout and sunlight patterns before finalizing the system design. High-efficiency panels were strategically placed to maximize output even during partial shade. All wiring and components were neatly concealed to preserve the home\'s look, while a robust system configuration ensured reliable power generation throughout the year.'
    ],
    metrics: {
      systemSize: '10 kW Rooftop Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '4380 units',
      roiPeriod: '~6.6 years',
    },
    lifestyleImpact: "Switching to solar brought a noticeable shift in the household. Monthly electricity worries reduced, and everyday usage felt lighter and stress-free. Simple habits like running appliances without hesitation became easier. Beyond savings, there's pride in knowing their home now contributes to a cleaner, more sustainable future for the next generation.",
    testimonial: {
      quote: 'Choosing solar with Flarize was one of the best decisions for our home. From the first consultation to final installation, everything felt clear and well-managed. Our electricity bills have reduced significantly, but more than that, we feel confident knowing our home is powered responsibly. The team is always supportive, and the service quality truly stands out.',
      author: 'Jose V P & Family, Alapuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project1/belowsection%20ENHANCED%20(1).jpg',
    },
  },

  //2nd project
  {
    id: '2',
    category: 'Residential',
    title: 'Siraj K P- Cherthala, Alapuzha',
    cardDescription:"Unpredictable electricity expenses were becoming a constant concern. Solar helped Siraj regain control, month after month.",
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
      ClientOverviewDescription: "Mr. Siraj KP, a business owner in Cherthala, Alappuzha, was looking for a practical solution to rising electricity costs that were directly affecting his operational expenses. With increasing energy usage and unpredictable tariffs, he wanted a dependable power source that would support business growth without adding financial stress. Solar energy emerged as the most sensible and future-proof decision."
    },
    projectGoals: [
      'Reduce monthly electricity expenses for commercial operations.',
      'Ensure an uninterrupted and reliable power supply.',
      'Improve long-term cost predictability for the business.',
      'Adopt a sustainable energy solution aligned with future growth.',
    ],
    challenges: [
      'Limited roof space and layout constraints.',
      'Making sure panels didn’t affect the look of the home.',
      'Completing installation without disturbing the family’s routine.',
    ],
    solution: [
      'Designed a custom rooftop solar system that used every usable inch wisely.',
      'Selected high-efficiency panels suited for Kerala’s climate.',
      'Planned installation carefully to keep noise and disruption minimal.',
      'Set up a simple monitoring system so the family can track power generation easily.',
    ],
    metrics: {
      systemSize: '500 kW Commercial Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '4380 units',
      roiPeriod: '~6.9 years',
    },
    lifestyleImpact: 'The shift to solar significantly reduced operational costs, allowing better financial planning and stability. Energy expenses became predictable, and reliance on the grid reduced noticeably. Beyond savings, the business now operates with the confidence of using clean energy—strengthening its reputation as a responsible and forward-thinking enterprise.',
    testimonial: {
      quote: 'Flarize delivered an excellent solar solution for our facility. The project was completed on time, and the system performance has been consistent. Our electricity expenses have reduced more than expected, and the entire process—from planning to installation—was handled professionally. We\'re proud to take a step toward sustainable energy with their support.',
      author: 'Siraj KP, Cherthala',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project2/belowsection%20ENHANCED.jpg',
    },
  },

  //3rd project
  {
    id: '3',
    category: 'Residential',
    title: 'Stephen V C- Vattayal, Alapuzha',
    cardDescription:"For Stephen and his family, comfort came from consistency. Solar brought that calm back into everyday living.",
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
      ClientOverviewDescription: "Stephen and his family live a simple, close-knit life in Vattayal, Alappuzha. Like most Kerala homes, electricity is part of everything — lights, fans, water motor, and daily comfort. Over time, monthly electricity bills kept climbing, especially during hot months. Power cuts were another worry. Stephen wanted a solution that felt practical, long-term, and peaceful, not complicated or risky. Solar felt right — but only if it was done properly."
    },
    projectGoals: [
      'Reduce monthly electricity bills without changing daily habits.',
      'Move to clean, renewable energy suitable for a Kerala home.',
      'Ensure uninterrupted power supply for daily needs',
      'You can just install a system that blends well with the house, not spoils it',
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
      annualGeneration: '4380 units',
      roiPeriod: '~6.9 years',
    },
    lifestyleImpact: 
      'Today, the family enjoys noticeably lower electricity bills and fewer worries during power cuts. Appliances run smoothly, and daily routines stay uninterrupted, and there’s a quiet satisfaction in knowing the home is powered by the sun. Solar didn’t just reduce expenses — it brought peace of mind. And a small sense of pride, too.',
    testimonial: {
      quote: 'Flarize made going solar incredibly easy. The team was professional, clear in communication, and respectful of our home. The system looks neat, and we can already see the difference in our bills. It feels good knowing we’re saving money and doing something positive for the environment',
      author: 'Stephen V C & Family, Vattayal, Alapuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project3/belowsectionimage%20ENHANCED.jpg',
    },
  },

  //4th project
  {
    id: '4',
    category: 'Residential',
    title: 'Ushaviswanathan - Thiruvambady, Alappuzha',
    cardDescription:"A rooftop that offers shade, comfort, and reliable power—without overspending. Solar that quietly improved life, one evening at a time.",
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
      ClientOverviewDescription: "This family from Thiruvambady, Alappuzha, has always believed in living within their means. Their household runs on careful planning, where every expense matters, but their hopes were simple. They wanted a calm, shaded space on the rooftop where their son could spend time in the evenings—somewhere peaceful and comfortable after a long day. High electricity bills made things harder every month. Instead of postponing their plans, they chose solar as a smart step forward—not as a luxury, but as a practical decision for the future."
    },
    projectGoals: [
      'Reduce monthly electricity expenses and gain better control over household spending.',
      'Use the limited rooftop space efficiently without losing its everyday usability.',
      'Create a shaded, comfortable rooftop area suitable for regular evening use.',
    ],
    challenges: [
      'The budget was limited, so every expense had to be justified.',
      'The rooftop space was small and had to be used wisely.',
      'The family wanted the rooftop to remain usable—not just filled with panels.',
      'Reliable power in the evenings was important for daily comfort. They needed clear answers without technical confusion or unrealistic promises.',
    ],
    solution: [
      'We planned a compact solar system that delivered maximum output without overspending. The solar structure was designed to function as a shaded rooftop space, allowing comfortable use in the evenings. Panels were carefully positioned to ensure good sunlight exposure while keeping the area open and functional. Every step was explained in simple terms, helping the family feel confident and stress-free throughout the process.'
    ],
    metrics: {
      systemSize: '8 kW Residential Solar PV',
      installationType: 'Rooftop',
      annualGeneration: '4380 units',
      roiPeriod: '~6.4 years',
    },
    lifestyleImpact: 'Life gradually became easier. Monthly electricity bills came down. Evenings felt calmer and more relaxed. Today, their rooftop is more than just a roof—it is a comfortable space where their son spends time under the solar shade as the lights glow on. There is no worry about power cuts and no fear of high bills. Solar did not change their lifestyle overnight, but it delivered something more valuable: stability, peace of mind, and a home that feels balanced every day.',
    testimonial: {
      quote: 'We were surprised by how quickly everything was completed. The team was professional, well-organized, and respectful of our home. We can already see a clear reduction in our electricity bills, and the entire experience felt smooth from start to finish.',
      author: 'Ushaviswanathan, Thiruvambady, Alappuzha',
      image: 'https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/belowsectionimageENHANCED.jpg',
    },
  },

  
];