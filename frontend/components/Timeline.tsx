"use client";

import { motion } from "framer-motion";
import type { Experience } from "../app/data/types";

/**
 * Journey — the personal/building journey (section 11).
 *
 * The travel metaphor returns, now as the site's own spine: a vertical route
 * from START to NOW that echoes the intro loader. Real milestones (from the
 * `experience` data) sit along the way. The message: "my work is a journey,
 * not a collection of disconnected projects."
 */

const STAGES = [
  {
    tag: "START",
    stage: "Learning",
    note: "Foundation, curiosity, and way too many browser tabs.",
  },
  {
    tag: "02",
    stage: "First steps in industry",
  },
  {
    tag: "03",
    stage: "Building for a team",
  },
  {
    tag: "04",
    stage: "Independent product builder",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Node {
  tag: string;
  stage: string;
  note?: string;
  exp?: Experience;
}

export default function Timeline({ experience }: { experience: Experience[] }) {
  // Merge curated stages with the real experience data.
  // experience is ordered newest-first, so reverse it: START gets the oldest
  // milestone and the journey progresses chronologically up to NOW.
  const nodes: Node[] = STAGES.map((s, i) => ({
    ...s,
    exp: experience[experience.length - 1 - i] ?? undefined,
  }));

  return (
    <section
      id="journey"
      className="relative w-full py-24 md:py-36 bg-white dark:bg-[#0d0d0d] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
            Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            My work is a <span className="text-[#3b82f6]">journey</span>, not a
            list of projects.
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-6 max-w-2xl">
            Every build is a chapter — learning, experimenting, shipping, and
            iterating. Here&apos;s the route I&apos;ve travelled so far, and
            where the next chapter starts.
          </p>
        </motion.div>

        {/* Vertical journey route */}
        <div className="relative mt-4">
          {/* Spine */}
          <div className="absolute left-[7px] md:left-1/2 top-2 bottom-2 w-px md:-translate-x-1/2 bg-gradient-to-b from-[#3b82f6]/60 via-gray-300 dark:via-gray-700 to-transparent" />

          {/* START marker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col md:flex-row gap-6 md:gap-14 pb-16 pl-10 md:pl-0"
          >
            <div className="md:w-1/2 md:pr-14 flex md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                  Start
                </span>
                <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                  →
                </span>
              </div>
            </div>
            <span className="hidden md:block absolute left-0 top-1.5 rounded-full bg-[#3b82f6] p-[5px] md:left-1/2 md:-translate-x-1/2" />
          </motion.div>

          {/* Milestones */}
          {nodes.map((node, i) => (
            <motion.div
              key={node.tag}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className={`relative flex flex-col md:flex-row gap-6 md:gap-14 pb-16 pl-10 md:pl-0 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Spine dot */}
              <span className="absolute left-[3px] md:left-1/2 md:-translate-x-1/2 top-2 h-2.5 w-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

              {/* Stage label (opposite side of card on desktop) */}
              <div
                className={`hidden md:flex w-1/2 md:pr-14 items-start ${
                  i % 2 === 1
                    ? "md:order-none md:justify-start md:pl-14 md:pr-0"
                    : "justify-end"
                }`}
              >
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    {node.tag}
                  </span>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1 md:text-left">
                    {node.stage}
                  </p>
                </div>
              </div>

              {/* Card */}
              <div className="w-full md:w-1/2">
                <div className="rounded-xl bg-[#fafafa] dark:bg-[#171717] border border-gray-200 dark:border-white/10 p-7">
                  {/* Mobile stage chip */}
                  <span className="inline-block md:hidden text-[10px] font-mono uppercase tracking-[0.2em] text-[#3b82f6] mb-3">
                    {node.tag} · {node.stage}
                  </span>

                  {node.exp ? (
                    <>
                      <h3 className="text-lg md:text-xl font-normal text-[#1a1a1a] dark:text-white">
                        {node.exp.role}
                      </h3>
                      <p className="text-sm font-serif italic text-gray-500 dark:text-gray-400 mt-0.5">
                        {node.exp.company}
                      </p>
                      <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-3 mb-3">
                        {node.exp.duration}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                        {node.exp.description[0]}
                      </p>
                    </>
                  ) : (
                    <p className="text-base text-gray-500 dark:text-gray-400 font-light italic leading-relaxed">
                      {node.note}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* NOW destination */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col md:flex-row gap-6 md:gap-14 pl-10 md:pl-0"
          >
            <div className="hidden md:block w-1/2" />
            <div className="w-full md:w-1/2 md:pl-14 flex items-center gap-3">
              <span className="inline-block h-3 w-3 rounded-full bg-[#3b82f6] shadow-[0_0_14px_rgba(59,130,246,0.8)]" />
              <span className="text-sm font-mono tracking-[0.3em] text-[#1a1a1a] dark:text-[#fcfcfc]">
                NOW
              </span>
              <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                — building the next chapter
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
