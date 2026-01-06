export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  featured: boolean;
  year: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Lucide icon name
  username: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

export interface GameConfig {
  game: string;
  experience: string;
  settings: { label: string; value: string }[];
}

export interface ThemeConfig {
  name: string;
  primary: string; // RGB values like "249 115 22"
  secondary: string; // RGB values
  hex: string; // Hex code for UI display
}

export interface PortfolioData {
  personal: {
    firstName: string;
    lastName: string;
    role: string;
    tagline: string;
    bio: string;
    location: string;
    avatarUrl: string;
    availability: string;
    email: string;
    stats: { label: string; value: string }[];
  };
  theme: ThemeConfig;
  socials: SocialLink[];
  projects: Project[];
  stack: string[];
  experience: Experience[];
  services: string[];
  process: ProcessStep[];
  gameSettings: {
    freeFire: GameConfig;
    valorant: GameConfig;
  };
  pricing: PricingPlan[];
  faqs: FAQ[];
  testimonials: Testimonial[];
}