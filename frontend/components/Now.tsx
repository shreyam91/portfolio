"use client";

import { motion } from "framer-motion";

/**
 * Now — the personality strip (section 12).
 *
 * A brief, honest look at what's currently occupying attention.
 * Not a skills list, not a status update — just a human moment
 * between the journey and the proof. Four quiet columns:
 * exploring, building, learning, thinking.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NOW_ITEMS = [
  {
    label: "Exploring",
    text: "How AI-native interfaces change the way products are shaped — not just built.",
  },
  {
    label: "Building",
    text: "Products with AI in the loop — recommendations, assistance, and automation that feel genuinely useful.",
  },
  {
    label: "Learning",
    text: "AI engineering in practice — RAG, embeddings, vector databases, and orchestrating LLMs into real products.",
  },
  {
    label: "Thinking",
    text: "What separates products people tolerate from products people return to.",
  },
];

export default function Now() {
  return (
    <section className="relative w-full py-20 md:py-24 bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 md:mb-18"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-4 block">
            Now
          </span>
          <h2 className="text-2xl md:text-4xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            What&apos;s on my mind{" "}
            <span className="text-[#3b82f6]">right now</span>.
          </h2>
        </motion.div>

        {/* Four columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {NOW_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 block mb-4">
                {item.label}
              </span>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
