export type Project = {
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
  status?: "Completed" | "In Progress";
  role?: string;
  team?: string;
};

export const projects: Project[] = [
  {
    id: "jobpulse",
    title: "JobPulse – AI Powered Job Search Platform",
    image: "/images/projects/jobpulse.png",
    description:
      "AI-powered job platform that personalizes job discovery, resume optimization, and application tracking.",
    longDescription: `
Job searching today is fragmented and inefficient. Users apply on multiple platforms but rarely get personalized recommendations or proper tracking of applications.

## Problem
Job seekers struggle with:
- Irrelevant job listings
- Lack of resume optimization feedback
- No centralized application tracking system
- Time-consuming manual filtering

## Solution
JobPulse is an AI-powered career assistant that simplifies the entire job search journey.

It analyzes user resumes with AI, understands skill sets, and recommends relevant jobs. It also provides a centralized dashboard to track every application.

## How the AI layer works
The AI isn't bolted on as a novelty — it sits at the core of the matching loop:

- **Resume parsing.** The system extracts skills, experience level, and role signals from a user's resume.
- **Smart matching.** OpenAI reasons over how a candidate's profile maps to live job postings, scoring relevance and surfacing roles that would otherwise stay buried.
- **Recommendation logic.** The backend turns those signals into a ranked list, persisted alongside application data in PostgreSQL.
- **Prompt design.** Every AI call uses a deliberately structured prompt that returns consistent, parseable results — so the model's output plugs straight into the product logic.

## AI Architecture
OpenAI (model) → recommendation logic → backend API → PostgreSQL → frontend

## What I Built
- AI-based job recommendation engine
- Resume parsing and optimization grounded in the AI layer
- Application tracking dashboard
- Smart filtering based on skills, experience, and role
- Secure authentication system

## Challenge
Making the AI output reliable. The hard part wasn't calling the API — it was engineering the prompts and the parsing so the model's answers consistently mapped to structured data the rest of the app could trust.

## Result
- Reduces job search time significantly
- Improves resume quality using AI suggestions
- Centralizes job applications in one platform

## Tech Stack
Next.js, Node.js, PostgreSQL, OpenAI API, Tailwind CSS
`,
    tags: ["Next.js", "AI", "OpenAI", "LLM", "Node.js", "PostgreSQL"],
    github: "https://github.com/shreyam91/AI-Job",
    featured: true,
    year: "2025",
    status: "Completed",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "medical-ecommerce",
    title: "Medical E-Commerce Platform",
    image: "/images/projects/medical-ecommerce.png",
    description:
      "Healthcare e-commerce platform for ordering medicines with secure payments and inventory tracking.",
    longDescription: `
Access to medicines and healthcare products is often limited by physical store dependency and availability issues.

## Problem
- Limited access to pharmacies in some areas
- Manual purchase process is time-consuming
- Lack of real-time stock visibility
- No unified digital platform for medicines

## Solution
A full-stack medical e-commerce platform that allows users to browse, purchase, and track medicines online with secure payment integration.

## What I Built
- Product catalog for medicines
- Cart and checkout system
- Secure authentication system
- PhonePe payment integration
- Order tracking and history system
- Inventory management system

## Impact
- Improves accessibility to medicines
- Reduces dependency on physical pharmacies
- Enables fast and secure online ordering

## Tech Stack
React, Node.js, Express.js, PostgreSQL, JWT, PhonePe API
`,
    tags: ["React", "Node.js", "PostgreSQL", "JWT", "E-Commerce"],
    github: "https://github.com/shreyam91/Medical-Ecommerce",
    featured: true,
    year: "2024",
    status: "Completed",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "algorithm-visualizer",
    title: "Algorithm Visualizer",
    image: "/images/projects/algo.png",
    description:
      "Interactive tool that visually demonstrates sorting, searching, and graph algorithms.",
    longDescription: `
Understanding algorithms is difficult when learning only through code.

## Problem
- Abstract nature of algorithms makes learning difficult
- Students struggle to visualize execution flow
- Lack of interactive learning tools

## Solution
An interactive algorithm visualizer that turns abstract logic into real-time animations.

## What I Built
- Sorting algorithm visualizations
- Searching algorithm animations
- Graph traversal (DFS, BFS)
- Adjustable speed controls
- Interactive UI for learning

## Impact
- Makes learning algorithms intuitive
- Improves understanding through visualization
- Helps students prepare for interviews

## Tech Stack
JavaScript, HTML, CSS
`,
    tags: ["JavaScript", "Algorithms", "Visualization"],
    github: "https://github.com/shreyam91/Algo-Visualizer",
    // live: "https://algorithm-visualizer.vercel.app",
    featured: false,
    year: "2024",
    status: "Completed",
    role: "Frontend Developer",
    team: "Solo Project",
  },

  {
    id: "task-management-system",
    title: "Task Management System",
    image: "/images/projects/task-management.png",
    description:
      "A collaborative task management system with authentication and role-based access control.",
    longDescription: `
Teams often struggle with managing tasks efficiently across members.

## Problem
- Lack of centralized task tracking
- No role-based permission system
- Poor collaboration in small teams

## Solution
A backend-driven task management system with authentication and structured workflows.

## What I Built
- JWT authentication system
- Role-based access control
- Task creation and assignment system
- RESTful APIs
- MongoDB data modeling

## Impact
- Improves team collaboration
- Provides structured task workflow
- Ensures secure access control

## Tech Stack
Node.js, Express.js, MongoDB, JWT
`,
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/shreyam91/Task-Manager",
    featured: false,
    year: "2024",
    status: "Completed",
    role: "Backend Developer",
    team: "Solo Project",
  },

  {
    id: "blog-app",
    title: "Blog App",
    image: "/images/projects/blogs.png",
    description:
      "Real-time blogging platform with authentication and content management using Firebase.",
    longDescription: `
Traditional blogging platforms lack real-time interactivity and modern UI experience.

## Problem
- Slow content updates
- Lack of real-time synchronization
- Limited engagement features

## Solution
A real-time blogging platform powered by Firebase for instant updates and seamless content management.

## What I Built
- Firebase authentication system
- Real-time post updates
- CRUD blog system
- Comment functionality
- Responsive UI

## Impact
- Enables real-time content publishing
- Improves user engagement
- Simplifies blog management

## Tech Stack
React, Firebase, Firestore
`,
    tags: ["React", "Firebase", "Firestore"],
    github: "https://github.com/shreyam91/Blog-app",
    featured: false,
    year: "2023",
    status: "Completed",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "excel-data-tool",
    title: "Excel Data Segregation Tool",
    image: "/images/projects/excel.png",
    description:
      "Java-based automation tool for processing and segregating Excel data efficiently.",
    longDescription: `
Manually handling large Excel datasets is time-consuming and error-prone.

## Problem
- Repetitive manual data sorting
- High chance of human error
- Inefficient handling of large datasets

## Solution
A Java-based automation tool that processes and segregates Excel data automatically.

## What I Built
- Excel file parser using Apache POI
- Data segmentation engine
- Automated output generation
- Custom rule-based processing

## Impact
- Saves manual processing time
- Reduces human errors
- Automates large dataset handling

## Tech Stack
Java, Apache POI
`,
    tags: ["Java", "Apache POI", "Automation"],
    github: "https://github.com/shreyam91/Excel-File",
    featured: false,
    year: "2023",
    status: "Completed",
    role: "Backend Developer",
    team: "Solo Project",
  },
];
