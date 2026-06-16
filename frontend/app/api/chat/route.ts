import { NextResponse } from "next/server";
import { projects } from "../../data/projectsData";

// Basic in-memory rate limiting (Note: not perfect for serverless/edge environments but better than nothing)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 10; // 10 messages per minute
const WINDOW_MS = 60 * 1000; // per minute

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    
    if (record && now - record.lastReset < WINDOW_MS) {
      if (record.count >= RATE_LIMIT) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
      record.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid payload format: messages array required" }, { status: 400 });
    }

    const { messages, role } = body;

    const userMessage = messages[messages.length - 1]?.content || "";
    const lowerMessage = userMessage.toLowerCase();

    // Context / Persona definition
    const systemPrompt = `You are a smart AI portfolio assistant for Shreyam Kanaujiya, an exceptional full-stack developer.
You only use the provided project data from projectsData.ts. You explain projects clearly, professionally, and ground all answers in Shreyam's real project data.
The current role/profile tone you should adapt is: ${role || "visitor"}.
- recruiter: Focus on business impact, engineering decisions, scale, architecture, and Shreyam's readiness for interviews and projects. Be structured, impact-driven, and highly professional.
- visitor: Warm, creative, engaging, easy to understand. Tell stories about the projects.
- developer: Technical, precise, talk about tech stack, libraries, databases (Convex, PostgreSQL, MongoDB), state management, APIs (OpenAI, PhonePe), and architectural choices.

Shreyam's project details:
${JSON.stringify(projects, null, 2)}

Strict rules:
1. Ground all answers ONLY in the real project data provided. Do NOT hallucinate new projects, skills, or metrics.
2. Be direct, structured, and recruiter-friendly.
3. Keep answers concise but detailed enough to answer the recruiter's or engineer's questions fully.
4. If a question is not related to Shreyam's work, politely steer it back.`;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Use Gemini API if key is available
    if (geminiKey) {
      try {
        const geminiHistory = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: geminiHistory,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const assistantReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (assistantReply) {
            return NextResponse.json({ reply: assistantReply });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back", err);
      }
    }

    // Use OpenAI if key is available
    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const assistantReply = data.choices?.[0]?.message?.content;
          if (assistantReply) {
            return NextResponse.json({ reply: assistantReply });
          }
        }
      } catch (err) {
        console.error("OpenAI API call failed, falling back", err);
      }
    }

    // HIGH-FIDELITY LOCAL FALLBACK (Rule-based NLP matcher grounded in projectsData)
    let reply = "";

    if (lowerMessage.includes("pulse") || lowerMessage.includes("job")) {
      const proj = projects.find((p) => p.id === "jobpulse");
      reply = `### 💼 JobPulse – AI Powered Job Search Platform
**JobPulse** is an AI-powered career assistant that personalizes job discovery, resume optimization, and application tracking.

**🛠️ Tech Stack:** Next.js, Node.js, PostgreSQL, OpenAI API, Tailwind CSS

**⚠️ The Problem:** Job searching today is fragmented and inefficient. Job seekers struggle with irrelevant job listings, a lack of resume optimization feedback, and have no centralized application tracking system.
**✨ The Solution:** JobPulse solves this by analyzing user resumes using AI to recommend relevant jobs and centralizing the entire workflow.

**🚀 What Shreyam Built:**
* AI-based job recommendation engine.
* Resume parsing and optimization system.
* Application tracking dashboard.
* Smart filtering based on skills, experience, and role.
* Secure authentication system.

**📈 Impact:**
* Reduces job search time significantly.
* Improves resume quality using AI suggestions.
* Centralizes job applications in one platform.`;
    } else if (lowerMessage.includes("streak") || lowerMessage.includes("code")) {
      const proj = projects.find((p) => p.id === "codestreak");
      reply = `### ⚡ CodeStreak – Developer Progress Tracking Platform
**CodeStreak** is a structured, gamified platform to track DSA, system design, and coding preparation with analytics and streaks.

**🛠️ Tech Stack:** Next.js, Convex, Auth.js, Tailwind CSS

**⚠️ The Problem:** Most developers preparing for interviews struggle with consistency and structured tracking across multiple topics like DSA, System Design, and Machine Coding.
**✨ The Solution:** CodeStreak provides daily streak tracking, learning dashboards, and study analytics to build discipline.

**🚀 What Shreyam Built:**
* Daily streak tracking engine.
* Progress dashboards for DSA & System Design.
* Study analytics and visualization.
* Structured preparation workflows.
* Secure authentication system.

**📈 Impact:**
* Substantially improves consistency in learning.
* Helps visualize preparation progress.
* Builds discipline through a streak-based system.`;
    } else if (lowerMessage.includes("medical") || lowerMessage.includes("e-commerce") || lowerMessage.includes("pharmacy")) {
      reply = `### 🏥 Medical E-Commerce Platform
A healthcare e-commerce platform for ordering medicines with secure payments and inventory tracking.

**🛠️ Tech Stack:** React, Node.js, Express.js, PostgreSQL, JWT, PhonePe API

**⚠️ The Problem:** Access to medicines is often limited by dependency on physical stores, availability issues, and lack of real-time stock visibility.
**✨ The Solution:** A full-stack online pharmacy where users browse, purchase, and track medicines securely.

**🚀 What Shreyam Built:**
* Product catalog for medicines.
* Cart and checkout system.
* PhonePe payment gateway integration.
* Order tracking and history system.
* Inventory management system.

**📈 Impact:**
* Significantly improves medicine accessibility.
* Enables fast, secure online ordering and reduces physical dependency.`;
    } else if (lowerMessage.includes("visualizer") || lowerMessage.includes("algo")) {
      reply = `### 📊 Algorithm Visualizer
An interactive tool that visually demonstrates sorting, searching, and graph algorithms to make complex concepts intuitive.

**🛠️ Tech Stack:** JavaScript, HTML, CSS

**🚀 What Shreyam Built:**
* Sorting algorithm visualizations (Bubble, Selection, Insertion, etc.).
* Searching algorithm animations.
* Graph traversal (DFS, BFS) animations.
* Adjustable speed controls and interactive control UI.

**📈 Impact:**
* Turns abstract algorithm execution flow into clear, real-time animations.
* Greatly improves understanding and retention for technical interviews.`;
    } else if (lowerMessage.includes("task") || lowerMessage.includes("management")) {
      reply = `### 📋 Task Management System
A collaborative task management system with authentication and role-based access control (RBAC).

**🛠️ Tech Stack:** Node.js, Express.js, MongoDB, JWT

**🚀 What Shreyam Built:**
* JWT authentication system.
* Role-based access control (RBAC) permissions.
* Task creation, assignment, and status updates system.
* Secure RESTful API endpoints and MongoDB data modeling.

**📈 Impact:**
* Improves team collaboration and provides a structured, secure task workflow.`;
    } else if (lowerMessage.includes("blog") || lowerMessage.includes("firebase")) {
      reply = `### ✍️ Blog App
A real-time blogging platform with authentication and content management using Firebase.

**🛠️ Tech Stack:** React, Firebase, Firestore

**🚀 What Shreyam Built:**
* Firebase authentication system.
* Real-time post updates and comments functionality.
* Full CRUD blog system and responsive UI.

**📈 Impact:**
* Enables real-time content publishing and high user engagement.`;
    } else if (lowerMessage.includes("excel") || lowerMessage.includes("java") || lowerMessage.includes("poi")) {
      reply = `### 📁 Excel Data Segregation Tool
A Java-based automation utility for processing and segregating large Excel datasets efficiently.

**🛠️ Tech Stack:** Java, Apache POI

**🚀 What Shreyam Built:**
* Excel file parser using Apache POI.
* Automated data segmentation engine.
* Rule-based output generator.

**📈 Impact:**
* Automates large dataset handling, saving hours of manual data sorting and reducing human error.`;
    } else if (lowerMessage.includes("tech") || lowerMessage.includes("stack") || lowerMessage.includes("skill") || lowerMessage.includes("use")) {
      reply = `### 🛠️ Shreyam's Technology Stack
Here are Shreyam's core engineering skills:

* **Frontend:** Next.js, React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Framer Motion
* **Backend & APIs:** Node.js, Express.js, Java, RESTful APIs
* **Databases & State:** PostgreSQL, MongoDB, Convex, Firestore, Zustand
* **Integrations & AI:** OpenAI API, PhonePe API, Apache POI, JWT, Auth.js`;
    } else if (lowerMessage.includes("system design") || lowerMessage.includes("architecture")) {
      reply = `### 🏗️ Shreyam's System Design & Architecture Highlights
Shreyam applies robust architectural patterns across all systems:

1. **Reactive Data Modeling (CodeStreak):** Uses **Convex** for real-time reactivity, eliminating complex REST API synchronization boilerplate and providing immediate state updates.
2. **AI Pipelines (JobPulse):** Architected resume analysis pipelines utilizing **OpenAI API** to parse, score, and map user experience to target roles.
3. **Role-Based Security (Task Manager):** Built robust JWT-based authentication and role-based access control (RBAC) schemas in Express and MongoDB.
4. **Automated Batch Processing (Excel Tool):** Engineered automated, memory-safe file-streaming batch segregations using **Java** and Apache POI.`;
    } else if (lowerMessage.includes("best") || lowerMessage.includes("favorite") || lowerMessage.includes("top")) {
      reply = `### 🌟 Shreyam's Signature Projects
Shreyam's most advanced work includes:

1. **JobPulse (AI-Powered Job Platform):** Next.js, PostgreSQL, OpenAI. Features deep resume parsing, optimization suggestions, and application tracking.
2. **CodeStreak (Interview Prep Tracker):** Next.js, Convex, Auth.js. Gamifies developer interview prep with streak mechanics and real-time study analytics.

Both showcase full-stack fluency, clean system architecture, and elegant user interfaces!`;
    } else {
      // General response matching role tone
      if (role === "recruiter") {
        reply = `Hello! I am Shreyam's AI Portfolio Assistant. I can help you evaluate Shreyam's fit for your engineering team!

You can ask me questions such as:
* **"What did you build in JobPulse?"**
* **"Explain CodeStreak's architecture"**
* **"What tech stack do you use?"**
* **"Show me Shreyam's system design experience"**

What project or technology can I walk you through today?`;
      } else if (role === "developer") {
        reply = `Hey there, fellow dev! I am Shreyam's Project Explainer Assistant. Let's dig into the code!

I can detail the technical specifics behind Shreyam's work. Ask me about:
* **"Explain CodeStreak architecture"** (Nex.js + Convex reactivity)
* **"What did you build in JobPulse?"** (OpenAI parsing + Node.js/PostgreSQL)
* **"What problem does your medical project solve?"** (Express + PostgreSQL + PhonePe)

Which architecture stack should we inspect?`;
      } else {
        reply = `Hi! I'm Shreyam's AI Assistant. I'm here to guide you through Shreyam's creative journey and technical projects!

Feel free to ask me questions like:
* **"Tell me about your best project"**
* **"Explain JobPulse in detail"**
* **"What tech stack do you use?"**
* **"What problem does your medical project solve?"**

How can I help you explore today?`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
