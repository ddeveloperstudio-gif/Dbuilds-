export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  isConcept: boolean;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  image: string;
  metricsLabel?: string;
  metricsValue?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  iconType: 'business' | 'ai' | 'creative';
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export const SITE_METADATA = {
  brand: 'DBUILDS 2.0',
  tagline: 'Ideas into Digital Reality',
  creator: 'Dhanush',
  role: 'Independent Digital Creator & Web Developer',
  domain: 'buildbyd.com',
  email: 'professional1511new@gmail.com',
  instagram: '@dbuilds.2.0',
  instagramUrl: 'https://instagram.com/dbuilds.2.0',
  heroLabel: 'INDEPENDENT DIGITAL CREATOR / DBUILDS 2.0',
  heroHeadline1: 'IDEAS INTO',
  heroHeadline2: 'DIGITAL REALITY.',
  heroDescription:
    'I build modern digital experiences and professional websites that help businesses establish their presence online.',
  introHeadline1: 'NOT JUST WEBSITES.',
  introHeadline2: 'DIGITAL EXPERIENCES.',
  introDescription:
    'From first impression to final interaction, every detail should give your business a stronger digital presence.',
};

export const CORE_PRINCIPLES = [
  {
    num: '01',
    title: 'Purposeful Design',
    desc: 'Every layout decision serves clarity, business credibility, and immediate customer action.',
  },
  {
    num: '02',
    title: 'Thoughtful Interaction',
    desc: 'Physical, tactile motion that guides attention without sacrificing speed or accessibility.',
  },
  {
    num: '03',
    title: 'Built for Real Businesses',
    desc: 'Robust responsive architecture that converts visitors into genuine inquiries and clients.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'beauty-trendz',
    number: '001',
    title: 'Beauty Trendz',
    category: 'Salon & Beauty',
    isConcept: true,
    tagline: 'Polished aesthetic experience for high-end personal care',
    description:
      'A refined salon website preview featuring bespoke editorial typography, signature service showcase cards, seamless appointment booking call-to-actions, and an inviting warm-luxury visual language.',
    deliverables: ['Custom Brand Typography', 'Interactive Service Showcase', 'Booking CTA Flow', 'Mobile-First Responsive Layout'],
    techStack: ['React', 'Tailwind CSS', 'Accessible UI', 'Responsive Design'],
    image: '/src/assets/images/project_beauty_trendz_1792579443841.jpg',
  },
  {
    id: 'wincraft',
    number: '002',
    title: 'WİNCRAFT',
    category: 'Retail & E-commerce Concept',
    isConcept: true,
    tagline: 'Curated luxury dark-mode retail shop interface',
    description:
      'A modern boutique shop concept with sophisticated product presentation, category navigation tabs, fluid customer purchasing affordances, and high-contrast editorial photography framing.',
    deliverables: ['Product Architecture', 'Category Navigation', 'Cart & Checkout Affordances', 'Micro-Interactions'],
    techStack: ['React', 'Modern CSS Grid', 'Custom Layouts', 'State Management'],
    image: '/src/assets/images/project_wincraft_1792579445076.jpg',
  },
  {
    id: 'digital-frontier',
    number: '003',
    title: 'Digital Frontier',
    category: 'Experimental Web Design',
    isConcept: true,
    tagline: 'Dimensional futuristic interface showcase',
    description:
      'A cutting-edge technology landing page concept demonstrating multi-layered spatial layouts, atmospheric lighting, and sophisticated scroll-driven interaction design.',
    deliverables: ['Spatial Typography', 'Layered Lighting & Grids', 'Perspective Transforms', 'Interactive Lab Demo'],
    techStack: ['WebGL / CSS 3D', 'Perspective Engine', 'Semantic HTML', 'Smooth Physics'],
    image: '/src/assets/images/project_digital_frontier_lab_1792579445534.jpg',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'service-business',
    number: '01',
    title: 'Business Websites',
    tagline: 'Clear, credible, and conversion-focused digital presence',
    description:
      'Professional, responsive websites designed to introduce your business, present your services, and help customers contact you.',
    deliverables: [
      'Business landing pages',
      'Service-based websites',
      'Contact and enquiry sections',
      'Mobile-responsive layouts',
    ],
    iconType: 'business',
  },
  {
    id: 'service-ai',
    number: '02',
    title: 'AI-Assisted Web Development',
    tagline: 'Accelerated concept iteration paired with human precision',
    description:
      'Modern website experiences created with AI-assisted workflows, careful design decisions, and practical implementation.',
    deliverables: [
      'Rapid concept development',
      'Custom visual direction',
      'Interactive website prototypes',
      'Iterative design refinement',
    ],
    iconType: 'ai',
  },
  {
    id: 'service-creative',
    number: '03',
    title: 'Creative Digital Experiences',
    tagline: 'Distinctive cinematic interfaces with thoughtful motion',
    description:
      'Distinctive digital interfaces with polished layouts, cinematic transitions, and thoughtful motion.',
    deliverables: [
      'Creative landing pages',
      'Portfolio websites',
      'Scroll-driven storytelling',
      'Visual interaction design',
    ],
    iconType: 'creative',
  },
];

export const ABOUT_CREATOR = {
  sectionLabel: 'BEHIND THE BUILDS / 003',
  headline: 'CURIOUS BY NATURE. PRECISE BY DESIGN.',
  bio: `I'm an independent digital creator exploring the intersection of design, technology, and AI-assisted development. My focus is on creating modern websites that look distinctive, communicate clearly, and give businesses a stronger online presence.`,
  principles: [
    {
      title: 'Design with intention.',
      description: 'Every font, line of space, and visual element exists for a defined purpose rather than decoration.',
    },
    {
      title: 'Build for the people who use it.',
      description: 'Speed, mobile responsiveness, and effortless legibility come before gratuitous visual tricks.',
    },
    {
      title: 'Keep learning and improving.',
      description: 'Embracing next-generation web technologies and AI capabilities to ship better websites faster.',
    },
  ],
  image: '/src/assets/images/creator_dhanush_abstract_1792579445798.jpg',
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'DISCOVER',
    description: 'Understand the business, its audience, goals, and essential website requirements.',
    deliverables: ['Audience Analysis', 'Site Architecture', 'Content Strategy'],
    duration: 'Phase 1',
  },
  {
    step: '02',
    title: 'DESIGN',
    description: 'Develop the visual direction, structure, and content hierarchy.',
    deliverables: ['Art Direction', 'Wireframes & UI Mockups', 'Interaction Blueprint'],
    duration: 'Phase 2',
  },
  {
    step: '03',
    title: 'BUILD',
    description: 'Create the responsive website and refine its layout, interactions, and functionality.',
    deliverables: ['Frontend Architecture', 'Motion Integration', 'Backend & Forms'],
    duration: 'Phase 3',
  },
  {
    step: '04',
    title: 'LAUNCH',
    description: 'Test the experience across screen sizes, resolve issues, and prepare the site for deployment.',
    deliverables: ['Cross-Device QA', 'Performance Optimization', 'Live Domain Deployment'],
    duration: 'Phase 4',
  },
];
