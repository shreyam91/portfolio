export interface Hero {
  name: string;
  title: string;
  tagline: string;
  photo: string;
  resume: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string[];
  content: string;
}

export interface Tech {
  name: string;
  color: string;
  proficiency: string;
}

export interface AboutData {
  techStack: any;
  highlights: {
    Frontend: string[];
    Backend: string[];
    Tools: string[];
    Other: string[];
    Cloud: string[];
    AI: string[];
  };
}

export interface Contact {
  cta: string;
  link: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Highlight {
  icon: string;
  text: string;
}

export interface PortfolioData {
  hero: Hero;
  experience: Experience[];
  techStack: Tech[];
  skills: string[];
  aboutData: AboutData;
  contact: Contact;
  socialLinks: SocialLink[];
  highlights: Highlight[];
}

export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  longDescription: string;
  tags: string[];
  github: string;
  live?: string;

  featured?: boolean;
  year?: string;
  status?: string;
  role?: string;
  team?: string;
}
