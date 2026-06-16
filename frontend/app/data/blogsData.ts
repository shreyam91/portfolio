interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  topics: string[];
  content: string;
  date?: string;
  readTime?: string;
}

export const blogs: BlogPost[] = [
  {
    id: 1,
    slug: "scaling-modern-web-applications",
    title: "Scaling Modern Web Applications with Microservices",
    image: "/images/blogs/microservices.webp",
    description:
      "Learn how microservices architecture improves scalability, maintainability, and deployment flexibility in modern applications.",
    topics: ["System Design", "Microservices", "Backend", "Architecture"],
    content: `# Scaling Modern Web Applications with Microservices

As applications grow, monolithic architectures often become difficult to maintain and scale. Microservices solve this by breaking applications into smaller, independent services.

## Why Microservices?

- Independent deployment cycles
- Better scalability
- Improved fault isolation
- Easier team collaboration
- Technology flexibility

## Key Components

- API Gateway
- Service Discovery
- Authentication Service
- Database per Service
- Message Queues

## Example Architecture

\`\`\`txt
Client → API Gateway → Auth Service
                    → User Service
                    → Payment Service
                    → Notification Service
\`\`\`

## Challenges

- Distributed system complexity
- Monitoring and logging
- Network latency
- Data consistency

## Conclusion

Microservices are powerful for scaling applications, but they require strong DevOps practices and system monitoring to succeed.`,
    date: "2024-04-12",
    readTime: "7 min read",
  },

  {
    id: 2,
    slug: "mastering-ai-development-workflow",
    title: "How AI Tools Are Transforming Developer Workflows",
    image: "/images/blogs/ai-workflow.png",
    description:
      "Explore how AI-powered coding assistants are improving productivity, debugging, and software development speed.",
    topics: ["AI", "Developer Productivity", "Automation", "Coding"],
    content: `# How AI Tools Are Transforming Developer Workflows

AI-powered development tools are reshaping how developers write, debug, and optimize code.

## Popular AI Tools

- GitHub Copilot
- Cursor AI
- ChatGPT
- Gemini

## Benefits

- Faster code generation
- Improved debugging
- Better documentation
- Rapid prototyping
- Learning assistance

## Example

\`\`\`javascript
function debounce(fn, delay) {
  let timeout;
  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
\`\`\`

AI tools can instantly generate utility functions like this, saving development time.

## Best Practices

- Always review AI-generated code
- Focus on understanding logic
- Use AI as an assistant, not a replacement

## Conclusion

Developers who effectively combine AI tools with strong engineering fundamentals can significantly improve productivity and code quality.`,
    date: "2024-03-28",
    readTime: "5 min read",
  },

  {
    id: 3,
    slug: "building-real-time-chat-apps",
    title: "Building Real-Time Applications with WebSockets",
    image: "/images/blogs/realtime-chat.webp",
    description:
      "Understand how WebSockets enable real-time communication for chat apps, notifications, and collaborative systems.",
    topics: ["WebSockets", "Node.js", "Real-time", "System Design"],
    content: `# Building Real-Time Applications with WebSockets

Traditional HTTP requests are not ideal for real-time communication. WebSockets solve this by maintaining persistent connections.

## Common Use Cases

- Chat applications
- Live notifications
- Multiplayer games
- Stock market dashboards

## Example Server

\`\`\`javascript
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
});
\`\`\`

## Advantages

- Low latency communication
- Efficient bidirectional messaging
- Real-time updates

## Conclusion

WebSockets are essential for modern interactive applications that require live communication and instant updates.`,
    date: "2024-02-16",
    readTime: "6 min read",
  },

  {
  id: 4,
  slug: "tamhini-ghat-roadtrip",
  title: "A Scenic Road Trip Through Tamhini Ghat",
  image: "/images/blogs/tamhini-ghat.avif",
  description:
    "Exploring the breathtaking waterfalls, misty roads, and peaceful landscapes of Tamhini Ghat on an unforgettable monsoon road trip.",
  topics: ["Travel", "Adventure", "Nature", "Road Trip"],
  content: `# A Scenic Road Trip Through Tamhini Ghat

Tamhini Ghat is one of Maharashtra’s most beautiful road trip destinations, especially during the monsoon season. Surrounded by lush green mountains, waterfalls, and fog-covered roads, the journey itself becomes the highlight of the adventure.

## The Journey Begins

Starting early in the morning, the cool breeze and empty roads made the ride peaceful and refreshing. As we entered the ghat section, the scenery completely transformed into dense greenery and misty mountain views.

## Highlights of the Trip

- Endless winding roads through the Western Ghats
- Waterfalls flowing beside the highways
- Fog-covered valleys and scenic viewpoints
- Local tea stalls with hot chai and pakoras
- Calm atmosphere away from city life

## Best Time to Visit

The monsoon season between June and September offers the best experience. The entire region turns vibrant green, and waterfalls can be seen almost everywhere along the route.

## Travel Tips

- Start early to avoid traffic
- Carry rain gear during monsoon
- Ride carefully on slippery curves
- Keep your camera ready for scenic stops
- Avoid late-night travel in heavy rain

## Photography Moments

Every few kilometers offered postcard-like views — from clouds floating over mountains to reflections on wet roads. Tamhini Ghat is truly a paradise for nature lovers and photographers.

## Conclusion

A road trip to Tamhini Ghat is not just about reaching a destination; it’s about enjoying every moment of the journey. The peaceful roads, fresh mountain air, and stunning landscapes make it an unforgettable travel experience.`,
  date: "2024-01-14",
  readTime: "5 min read",
},

  {
    id: 5,
    slug: "nextjs-performance-optimization",
    title: "Optimizing Next.js Applications for Maximum Performance",
    image: "/images/blogs/nextjs.webp",
    description:
      "Learn practical techniques to improve loading speed, SEO, and user experience in Next.js applications.",
    topics: ["Next.js", "Performance", "Frontend", "Optimization"],
    content: `# Optimizing Next.js Applications for Maximum Performance

Performance directly impacts user experience and SEO rankings.

## Optimization Techniques

- Image optimization
- Lazy loading
- Dynamic imports
- Server-side rendering
- Static site generation

## Example

\`\`\`javascript
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});
\`\`\`

## Best Practices

- Reduce unnecessary re-renders
- Use caching strategies
- Optimize API requests
- Compress assets

## Conclusion

Small performance improvements can significantly improve user retention and application responsiveness.`,
    date: "2023-12-18",
    readTime: "5 min read",
  },

  {
    id: 6,
    slug: "system-design-basics-for-developers",
    title: "System Design Basics Every Developer Should Know",
    image: "/images/blogs/system-design.png",
    description:
      "A beginner-friendly introduction to scalability, load balancing, caching, databases, and distributed systems.",
    topics: ["System Design", "Scalability", "Backend", "Architecture"],
    content: `# System Design Basics Every Developer Should Know

System design is about building scalable, reliable, and maintainable applications.

## Core Concepts

- Load Balancing
- Caching
- Database Scaling
- CDN
- Message Queues

## Example Flow

\`\`\`txt
User → Load Balancer → Application Servers → Database
\`\`\`

## Important Skills

- API design
- Database optimization
- Scalability planning
- Monitoring and logging

## Conclusion

Understanding system design helps developers build applications that perform reliably at scale.`,
    date: "2023-11-25",
    readTime: "8 min read",
  },
];