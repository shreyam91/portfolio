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
    id: "opsmind",
    title: "OpsMind – Secure AI Knowledge Retrieval System",
    image: "/images/projects/opsmind.png",
    description:
      "AI-powered enterprise knowledge retrieval platform that provides grounded answers from internal documents while enforcing strict role-based access control.",
    longDescription: `
Organizations often have large amounts of internal knowledge spread across documents, policies, guides, and technical resources. Finding the right information quickly is difficult, while giving employees unrestricted access to internal documents can create serious security risks.

## Problem
Enterprise knowledge systems need to solve two problems at the same time:
- Employees need fast and accurate answers from internal documents.
- Sensitive information must remain accessible only to authorized users.
- Traditional search can make finding relevant information difficult.
- AI systems must avoid exposing documents outside a user's permissions.

## Solution
OpsMind was built as a secure AI-powered internal knowledge retrieval system using Retrieval-Augmented Generation (RAG).

Users can ask questions in natural language and receive grounded answers based on internal documents. The key security feature is database-level RBAC filtering during vector retrieval, ensuring unauthorized document chunks are filtered out before they can ever reach the LLM context.

## What I Built
- RAG-based internal knowledge retrieval system
- Automated PDF and text document ingestion
- Document chunking and embedding pipeline
- PostgreSQL vector search using pgvector
- Database-level RBAC retrieval filtering
- JWT-based authentication and authorization
- Department-based access scopes
- AI-generated answers with controlled source citations
- Streaming responses using Server-Sent Events (SSE)
- User feedback and admin review workflow
- Extensible backend tool-calling architecture
- Docker-based development and deployment setup

## Security Architecture
Security is a core part of the retrieval pipeline rather than something applied only after search.

Users are assigned roles and departmental scopes such as ENGINEERING, HUMAN_RESOURCES, and FINANCE. During vector similarity search, authorization filters are applied at the PostgreSQL level.

This means unauthorized chunks are excluded before retrieval results are passed to the language model, significantly reducing the risk of sensitive information entering the AI context.

## RAG Workflow
The document processing pipeline follows a structured flow:

1. Documents are uploaded and processed.
2. Content is extracted from PDFs or text files.
3. Documents are divided into smaller chunks.
4. Chunks are converted into vector embeddings.
5. Embeddings and access metadata are stored in PostgreSQL using pgvector.
6. A user's question is converted into an embedding.
7. PostgreSQL performs similarity search with RBAC filters.
8. Only authorized and relevant chunks are provided to the LLM.
9. The LLM generates a grounded response with source references.

## Impact
- Provides secure access to organizational knowledge through natural language.
- Prevents unauthorized document chunks from reaching the LLM context.
- Reduces the time employees spend searching through internal documentation.
- Combines semantic search with database-level authorization.
- Creates a foundation for secure enterprise AI assistants.

## Architecture
OpsMind follows a modular monolith architecture to keep the MVP maintainable while separating the frontend, backend, data, and AI responsibilities.

The Next.js frontend communicates with the FastAPI backend through REST APIs and SSE streaming. The backend handles authentication, business logic, RAG workflows, document ingestion, and AI integration. PostgreSQL stores application data, embeddings, and access-control metadata, while pgvector handles similarity search.

## Trade-offs
OpsMind intentionally uses a modular monolith architecture for the current MVP instead of introducing microservices too early.

Synchronous document processing was chosen to reduce infrastructure complexity, while advanced retrieval techniques such as reranking and hybrid keyword search are planned areas for future improvement.

## Tech Stack
Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, FastAPI, Python, SQLAlchemy 2.0, Pydantic, Alembic, PostgreSQL 15, pgvector, OpenAI API, Azure OpenAI compatibility, Docker, Docker Compose
`,
    tags: [
      "Next.js",
      "FastAPI",
      "RAG",
      "AI",
      "pgvector",
      "PostgreSQL",
      "OpenAI",
      "RBAC",
      "TypeScript",
      "Docker",
    ],
    github: "https://github.com/shreyam91/OpsMind",
    featured: true,
    year: "2026",
    status: "In Progress",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "devboard",
    title: "DevBoard – Architectural Decision Intelligence Platform",
    image: "/images/projects/devboard.png",
    description:
      "AI-powered developer platform that analyzes GitHub repositories, git history, and pull requests to reconstruct architectural decisions and detect potential conflicts before they become technical debt.",
    longDescription: `
As software projects grow, important architectural decisions often become buried in pull requests, commits, and code changes. DevBoard helps developers recover this context and understand how a codebase has evolved over time.

## Problem
Development teams often struggle with:
- Losing context behind architectural decisions
- Understanding why technical choices were made
- Detecting conflicts between new and existing architectural decisions
- Identifying potential technical debt early
- Manually analyzing large Git histories and pull requests

## Solution
DevBoard is an AI-powered architectural decision intelligence platform that connects with GitHub and analyzes repositories, git history, and pull requests.

It uses this development history to reconstruct architectural decisions, preserve their context, and identify potential conflicts before they turn into larger technical debt.

## What I Built
- GitHub OAuth authentication and repository integration
- GitHub webhook-based event processing
- Git history and pull request analysis
- AI-powered architectural decision extraction
- Architectural decision tracking
- Conflict detection between architectural decisions
- Background processing using Redis and BullMQ
- Semantic search using PostgreSQL and pgvector
- Interactive architecture visualization using D3.js
- Developer-focused dashboard for architectural insights

## AI Workflow
DevBoard processes repository activity, commits, and pull requests to identify important architectural decisions and their surrounding context.

Relevant information can be converted into embeddings and stored using pgvector, allowing the platform to perform semantic searches across the project's architectural knowledge.

The Claude API can then use this context to help identify relationships between decisions, surface historical reasoning, and highlight potential conflicts with newer changes.

## Architecture
The application is built with Next.js and TypeScript, with PostgreSQL handling persistent data and pgvector supporting semantic retrieval.

Redis and BullMQ are used for background jobs so repository analysis and other resource-intensive operations can run asynchronously without blocking the main application.

GitHub OAuth and webhooks provide authentication and repository event integration, while D3.js is used to visualize architectural relationships in an interactive way.

## Impact
- Makes architectural history easier to discover
- Helps developers understand why technical decisions were made
- Detects potential architectural conflicts earlier
- Reduces dependency on undocumented tribal knowledge
- Turns GitHub development history into searchable architectural knowledge

## Why It Matters
Architecture is constantly evolving. A technical decision that made sense months ago can conflict with a newer implementation if the original context is forgotten.

DevBoard focuses on preserving that context and making it available when developers need it. Instead of treating Git history as only a timeline of code changes, it transforms development history into a source of architectural intelligence.

> Good architecture is not only about knowing what the system looks like today. It is also about understanding why it became that way.

## Tech Stack
Next.js, TypeScript, PostgreSQL, pgvector, Redis, BullMQ, D3.js, Claude API, GitHub OAuth, GitHub Webhooks
`,
    tags: [
      "Next.js",
      "TypeScript",
      "AI",
      "RAG",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "BullMQ",
      "D3.js",
      "Claude API",
      "GitHub",
    ],
    github: "https://github.com/shreyam91/DevBoard",
    featured: true,
    year: "2026",
    status: "In Progress",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "jobpulse",
    title: "JobPulse – AI Powered Job Search Platform",
    image: "/images/projects/jobpulse.png",
    description:
      "AI-powered job search platform that helps users discover relevant opportunities, improve their resumes, and manage applications from a single dashboard.",
    longDescription: `
Job searching can become overwhelming when users have to browse multiple platforms, customize resumes, and manually track every application.

## Problem
Job seekers often struggle with:
- Finding jobs that match their actual skills
- Knowing how to improve their resumes
- Managing applications across multiple platforms
- Spending too much time filtering irrelevant opportunities

## Solution
JobPulse was built as an AI-powered career assistant that brings important parts of the job search process into one platform.

The platform analyzes a user's resume, identifies relevant skills and experience, and uses that information to recommend suitable job opportunities. Users can also manage and track their applications through a centralized dashboard.

## How the AI layer works
The AI isn't bolted on as a novelty — it sits at the core of the matching loop:

- **Resume parsing.** The system extracts skills, experience level, and role signals from a user's resume.
- **Smart matching.** OpenAI reasons over how a candidate's profile maps to live job postings, scoring relevance and surfacing roles that would otherwise stay buried.
- **Recommendation logic.** The backend turns those signals into a ranked list, persisted alongside application data in PostgreSQL.
- **Prompt design.** Every AI call uses a deliberately structured prompt that returns consistent, parseable results — so the model's output plugs straight into the product logic.

## AI Architecture
OpenAI (model) → recommendation logic → backend API → PostgreSQL → frontend

## What I Built
- AI-powered job recommendation system
- Resume parsing and optimization workflow
- Application tracking dashboard
- Smart job filtering based on skills, experience, and role
- Secure user authentication
- Personalized career-focused experience

## Impact
- Makes job discovery more personalized
- Reduces time spent searching and filtering jobs
- Helps users improve resume quality
- Keeps applications organized in one place

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
      "Interactive learning tool that visualizes sorting, searching, and graph algorithms through real-time animations and controls.",
    longDescription: `
Algorithms can be difficult to understand when they are explained only through code and theory. Visual representation makes the execution process easier to follow.

## Problem
Students often struggle with:
- Understanding how algorithms execute step by step
- Visualizing comparisons and data movement
- Understanding graph traversal logic
- Connecting theoretical concepts with actual execution

## Solution
An interactive algorithm visualizer that converts algorithmic logic into real-time visual animations.

Users can select different algorithms, control the animation speed, and observe how each algorithm processes data step by step.

## What I Built
- Sorting algorithm visualizations
- Searching algorithm animations
- DFS and BFS graph traversal
- Adjustable animation speed
- Interactive learning interface
- Visual representation of algorithm execution

## Impact
- Makes complex algorithms easier to understand
- Helps students learn through visual interaction
- Provides useful preparation for coding interviews
- Makes algorithm practice more engaging

## Tech Stack
JavaScript, HTML, CSS
`,
    tags: ["JavaScript", "Algorithms", "Visualization"],
    github: "https://github.com/shreyam91/Algo-Visualizer",
    featured: false,
    year: "2024",
    status: "Completed",
    role: "Frontend Developer",
    team: "Solo Project",
  },

  {
    id: "dev-desk",
    title: "Dev Desk",
    image: "/images/projects/task-management.png",
    description:
      "Backend-focused task management system with secure authentication, role-based access control, task assignment, and RESTful APIs.",
    longDescription: `
Managing tasks across a team can become difficult when there is no centralized system for assigning work, tracking progress, and controlling access.

## Problem
Small teams often face:
- Scattered task management
- Lack of centralized workflows
- No clear role-based permissions
- Difficulty managing tasks across different users

## Solution
A backend-driven task management system designed to provide a structured workflow for creating, assigning, and managing tasks securely.

The system uses authentication and role-based access control to ensure that users can only perform actions allowed by their assigned roles.

## What I Built
- JWT-based authentication
- Role-based access control
- Task creation and assignment system
- RESTful API architecture
- MongoDB data modeling
- Secure user and task management

## Impact
- Provides a structured approach to team task management
- Improves collaboration between users
- Adds secure role-based permissions
- Demonstrates practical backend architecture

## Tech Stack
Node.js, Express.js, MongoDB, JWT
`,
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/shreyam91/DevDesk",
    featured: false,
    year: "2025",
    status: "Completed",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  {
    id: "blog-app",
    title: "Blog App",
    image: "/images/projects/blogs.png",
    description:
      "Real-time blogging platform built with React and Firebase, featuring authentication, content management, comments, and instant updates.",
    longDescription: `
Modern content platforms need more than basic blog publishing. Users expect fast updates, smooth interactions, and a simple way to manage and engage with content.

## Problem
Traditional blog applications may lack:
- Real-time content updates
- Simple content management
- Interactive engagement features
- Seamless synchronization between users

## Solution
A real-time blogging platform powered by Firebase that allows users to create, manage, and interact with blog content while keeping updates synchronized.

The application combines React for the user interface with Firebase Authentication and Firestore for authentication, data storage, and real-time updates.

## What I Built
- Firebase authentication system
- Blog post creation and management
- CRUD operations for blog content
- Real-time Firestore updates
- Comment functionality
- Responsive user interface

## Impact
- Enables instant content updates
- Provides a smooth blogging experience
- Improves user interaction through comments
- Simplifies content management

## Tech Stack
React, Firebase, Firestore
`,
    tags: ["React", "Firebase", "Firestore"],
    github: "https://github.com/shreyam91/Blog-app",
    featured: false,
    year: "2024",
    status: "Completed",
    role: "Full Stack Developer",
    team: "Solo Project",
  },

  
];
