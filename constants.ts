import { PortfolioData } from './types';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook,
  Phone,
  Mail,
  Figma,
  Code2,
  Terminal,
  Cpu,
  PenTool,
  Workflow,
  Zap,
  Layout,
  Globe,
  Smartphone,
  CheckCircle2,
  Gamepad2,
  FileSpreadsheet,
  Video
} from 'lucide-react';

export const DATA: PortfolioData = {
  personal: {
    firstName: "Abeer",
    lastName: "Hasan", 
    role: "Front-end Dev & Digital Creator",
    tagline: "Bridging Code, Gaming & Creativity.",
    bio: `I am Abeer, a versatile digital professional from Bangladesh with expertise in front-end development, freelance digital work, gaming, and content creation. As a front-end developer, I specialize in crafting clean, responsive, and user-friendly websites using HTML and CSS, focusing on performance, usability, and modern design principles.

In my freelance work, I have successfully handled projects involving data entry, lead generation, data scraping, document preparation, and creating professional content in Microsoft Word, Excel, and PowerPoint. This experience has honed my organizational skills, attention to detail, and ability to deliver high-quality results under deadlines.

Beyond the technical realm, I am a competitive gamer and former VALORANT esports player with Team Liquid, which has instilled discipline, strategic thinking, teamwork, and adaptability. I also run a gaming-focused YouTube channel and have extensive experience in video editing and content production, allowing me to combine creativity with technical precision.

I am driven by continuous learning and growth, blending technical expertise, creative skills, and professional discipline to produce meaningful digital experiences. My goal is to develop as a front-end developer and digital professional while expanding my creative, gaming, and freelance pursuits.`,
    location: "Bangladesh",
    // Using a tech/gaming aesthetic placeholder
    avatarUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&h=400", 
    availability: "Open for opportunities",
    email: "abirshuvo71@gmail.com",
    stats: [
      { label: "Esports Level", value: "Pro" },
      { label: "Clients Happy", value: "100%" },
      { label: "Dedication", value: "High" },
      { label: "Gaming Exp", value: "Elite" }
    ]
  },
  theme: {
    name: 'Deep Orange',
    primary: '249 115 22',
    secondary: '253 186 116',
    hex: '#F97316'
  },
  socials: [
    { platform: "Facebook", url: "https://www.facebook.com/abirFaahim", icon: "Facebook", username: "Abir Faahim" },
    { platform: "Instagram", url: "https://www.instagram.com/xbir_0007/", icon: "Instagram", username: "@xbir_0007" },
    { platform: "GitHub", url: "https://github.com/OPabeer", icon: "Github", username: "OPabeer" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/abeer-hasan007/", icon: "Linkedin", username: "Abeer Hasan" },
    { platform: "WhatsApp", url: "https://wa.me/8801868995304", icon: "Phone", username: "+880 1868995304" },
  ],
  stack: [
    "HTML5", "CSS3", "MS Excel", "MS Word", "PowerPoint", "Video Editing", "Data Scraping", "Lead Gen"
  ],
  services: [
    "Front-End Development",
    "Data Entry & Scraping",
    "Video Editing",
    "Esports Strategy"
  ],
  experience: [
    {
      id: "1",
      role: "Freelancer",
      company: "Self-Employed",
      period: "Present",
      description: "Providing data entry, lead generation, scraping, and document formatting services with precision."
    },
    {
      id: "2",
      role: "Content Creator",
      company: "YouTube",
      period: "Ongoing",
      description: "Producing and editing gaming gameplay, utilizing visual storytelling and consistent pacing."
    },
    {
      id: "3",
      role: "Competitive Player",
      company: "Team Liquid (VALORANT)",
      period: "Former",
      description: "Competed at a professional level, mastering teamwork, communication, and performance under pressure."
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Gaming Content Hub",
      description: "A digital channel featuring high-quality gameplay editing and visual storytelling.",
      tags: ["Video Editing", "Content"],
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      link: "#",
      featured: true,
      year: "2024"
    },
    {
      id: "p2",
      title: "Corporate Data Suite",
      description: "Comprehensive data organization and presentation formatting for business clients.",
      tags: ["Excel", "PowerPoint"],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      link: "#",
      featured: true,
      year: "2023"
    },
    {
      id: "p3",
      title: "Front-end Portfolio",
      description: "Clean, responsive interface designs built with HTML & CSS.",
      tags: ["HTML", "CSS"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      link: "#",
      featured: true,
      year: "2023"
    }
  ],
  process: [
    {
      id: "step1",
      title: "Strategize",
      description: "Apply strategic thinking from esports to plan the project roadmap.",
      icon: "Cpu"
    },
    {
      id: "step2",
      title: "Execute",
      description: "Implement clean code or accurate data entry with extreme attention to detail.",
      icon: "Terminal"
    },
    {
      id: "step3",
      title: "Polish",
      description: "Refine visual layouts or edit content for maximum clarity and engagement.",
      icon: "Sparkles"
    }
  ],
  gameSettings: {
    freeFire: {
      game: "Free Fire (Emulator)",
      experience: "6+ Years",
      settings: [
        { label: "Former Team", value: "NG BD" },
        { label: "Resolution", value: "1920x1080" },
        { label: "DPI", value: "280" },
        { label: "Device", value: "Asus ROG 2" },
        { label: "Emulators", value: "BS 4.240, E4VX 4.250, MSI 5.9" },
        { label: "Tweaks", value: "Tweaks 2" },
        { label: "Gamepad Sens", value: "1,000,000" },
        { label: "Fire Button", value: "1% Size" },
        { label: "X Axis", value: "0.11 - 0.13" },
        { label: "Y Axis", value: "2.8 - 3.7" },
        { label: "Mouse DPI", value: "1250" },
        { label: "Polling Rate", value: "500Hz" },
      ]
    },
    valorant: {
      game: "Valorant",
      experience: "5+ Years",
      settings: [
        { label: "Resolution", value: "1080p" },
        { label: "Mouse DPI", value: "1100" },
        { label: "Polling Rate", value: "1000Hz" },
        { label: "Sensitivity", value: "0.67" },
        { label: "Crosshair", value: "Green, Size 2" },
        { label: "Viewmodel", value: "Standard" },
        { label: "Keybinds", value: "Default" },
        { label: "Video", value: "High Performance" },
      ]
    }
  },
  pricing: [
    {
      id: "basic",
      title: "Data & Admin",
      price: "$20",
      period: "/ hour",
      features: [
        "Data Entry & Cleaning",
        "Lead Generation",
        "Document Formatting",
        "MS Office Tasks",
        "Fast Turnaround"
      ],
      highlight: false
    },
    {
      id: "creative",
      title: "Web & Creative",
      price: "$40",
      period: "/ hour",
      features: [
        "HTML/CSS Development",
        "Video Editing",
        "Responsive Layouts",
        "Content Strategy",
        "Revisions Included"
      ],
      highlight: true
    }
  ],
  faqs: [
    {
      id: "f1",
      question: "What is your main focus?",
      answer: "I sit at the intersection of technical front-end development, precise data work, and creative digital editing."
    },
    {
      id: "f2",
      question: "Do you offer esports coaching?",
      answer: "Yes, I leverage my Team Liquid experience to offer strategic insights and coaching for VALORANT."
    },
    {
      id: "f3",
      question: "What tools do you use?",
      answer: "I am proficient in VS Code (HTML/CSS), the Microsoft Office Suite, and video editing software."
    },
    {
      id: "f4",
      question: "Are you available for freelance?",
      answer: "Absolutely. I am currently open to data, development, and editing projects."
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Pro Gaming Lead",
      role: "Esports Manager",
      quote: "Abeer brings the same discipline and communication skills from the server to his professional work. Reliable, sharp, and talented.",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=200&h=200"
    }
  ]
};

export const ICON_MAP: Record<string, any> = {
  Github, Twitter, Linkedin, Instagram, Facebook, Phone, Mail, Figma, Code2, Terminal, Cpu, PenTool, Workflow, Zap, Layout, Globe, Smartphone, CheckCircle2, Gamepad2, FileSpreadsheet, Video
};