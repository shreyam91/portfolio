export interface LiveProject {
  id: string;
  title: string;
  description: string;
  url: string;
  domain: string;
  image?: string;
  github?: string;
  tags: string[];
}

/**
 * Live Projects — deployed builds the user can visit.
 *
 * Add new entries as projects go live. Each card in the LiveProjects section
 * renders one of these. `domain` shows in the mini browser URL bar; `url` is
 * the actual link.
 */
export const liveProjects: LiveProject[] = [
  {
    id: "codestreak",
    title: "CodeStreak",
    description:
      "All-in-one interview prep platform — DSA problems, system design, machine coding, resources, and blogs.",
    url: "https://codestreak.dev",
    domain: "codestreak.dev",
    image: "/images/projects/codestreak.png",
    github: "https://github.com/shreyam91/Code-Streak",
    tags: ["Next.js", "React", "Node.js", "MongoDB"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description:
      "This site — a designed, engineered, and AI-positioned portfolio built with Next.js, Framer Motion, and Tailwind.",
    url: "https://shreyam.online",
    domain: "shreyam.online",
    github: "https://github.com/shreyam91/portfolio",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },

  // ── Add more live projects below ──────────────────────────────
  // Example:
  // {
  //   id: "my-saas",
  //   title: "My SaaS",
  //   description: "Short description of what it does.",
  //   url: "https://my-saas.vercel.app",
  //   domain: "my-saas.vercel.app",
  //   github: "https://github.com/shreyam91/my-saas",
  //   tags: ["Next.js", "PostgreSQL"],
  // },
];
