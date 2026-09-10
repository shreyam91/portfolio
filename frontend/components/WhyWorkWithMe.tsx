"use client";

import { motion } from "framer-motion";

/**
 * WhyWorkWithMe — the explicit case for starting a conversation (section 09-10)
 * and the only place technology appears, deliberately de-emphasized.
 *
 * Capabilities first; tools second — and quiet. The message is "tools are how
 * I build, they aren't what I sell."
 */

const CAPABILITIES = [
  {
    n: "01",
    title: "Product thinking",
    body: "I don't start with code. I start with what we're actually building — and who it's for.",
  },
  {
    n: "02",
    title: "AI + full-stack execution",
    body: "One idea, one connected system: AI model and API, application logic, backend, data, and interface — end to end.",
  },
  {
    n: "03",
    title: "Design & experience",
    body: "I care how the final product feels, not only whether it works. Craft is part of the brief.",
  },
  {
    n: "04",
    title: "Ownership",
    body: "I take responsibility for the whole journey — from rough idea to shipped product — and keep iterating.",
  },
];

const TOOLS = [
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "Express",
      "Java · Spring Boot",
      "REST APIs",
      "PostgreSQL · MongoDB",
    ],
  },
  {
    group: "Product",
    items: ["Figma", "System design", "Architecture", "Prototyping"],
  },
  {
    group: "Deployment",
    items: ["AWS", "Vercel", "Docker", "CI/CD", "Git & GitHub"],
  },
  {
    group: "AI",
    items: [
      "OpenAI API",
      "Prompt Engineering",
      "LLM Integration",
      "RAG & Embeddings (exploring)",
    ],
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function WhyWorkWithMe() {
  return (
    <section
      id="about"
      className="relative w-full py-24 md:py-28 bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
            About
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            I care about the whole journey —{" "}
            <span className="text-[#3b82f6]">not just the code</span>.
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-6 max-w-2xl">
            Most of the value in a product isn&apos;t in any single technology —
            it&apos;s in understanding the problem, shaping the experience, and
            carrying it through to something people actually use. That&apos;s
            what I focus on.
          </p>
        </motion.div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-2 gap-px bg-gray-200/70 dark:bg-white/10 border border-gray-200/70 dark:border-white/10">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
              className="bg-[#fafafa] dark:bg-[#0a0a0a] p-8 md:p-10 group"
            >
              <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                {cap.n}
              </span>
              <h3 className="text-xl md:text-2xl font-light text-[#1a1a1a] dark:text-white mt-3 mb-3 tracking-tight">
                {cap.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                {cap.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tools — de-emphasized but designed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20"
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-gray-300 dark:bg-white/20" />
            Tools are how I build
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {TOOLS.map((group, gi) => (
              <motion.div
                key={group.group}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: gi * 0.06,
                  ease: EASE,
                }}
                className="p-5 rounded-xl border border-gray-200/70 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02]"
              >
                <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#3b82f6] mb-4">
                  {group.group}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-block px-2.5 py-1 text-[11px] text-gray-600 dark:text-gray-400 font-light border border-gray-200 dark:border-white/[0.08] rounded-full bg-white/60 dark:bg-white/[0.03] hover:border-[#3b82f6]/30 hover:text-[#3b82f6] dark:hover:text-[#3b82f6] transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
