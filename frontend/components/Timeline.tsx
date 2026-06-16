"use client";

import React from "react";
import { motion } from "framer-motion";
import { Experience } from "../app/data/types";

export default function Timeline({ experience }: { experience: Experience[] }) {
  return (
    <section className="relative w-full py-18 bg-white dark:bg-[#111111] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">03</span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-4">
            Journey <span className="font-serif italic text-gray-500 dark:text-gray-400">Timeline</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg font-light">
            Milestones from learning to building impact.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line (Mobile: left-4, Desktop: center) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gray-200 dark:from-gray-800 via-gray-300 dark:via-gray-700 to-transparent -translate-x-1/2 opacity-70" />

          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-16 mb-20 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 top-0 md:top-4 w-10 h-10 -translate-x-1/2 rounded-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-gray-700 flex items-center justify-center z-10 shadow-sm transition-colors duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>

              {/* Empty side for desktop alignment */}
              <div className="hidden md:block w-1/2" />

              {/* Content Side */}
              <div className="w-full pl-12 md:pl-0 md:w-1/2 flex flex-col">
                <div className={`p-8 rounded-2xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all ${
                  i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                }`}>
                  <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                    {exp.duration}
                  </span>
                  <h3 className="text-xl font-medium text-[#1a1a1a] dark:text-white mb-1">{exp.role}</h3>
                  <h4 className="text-base font-serif italic text-gray-500 dark:text-gray-400 mb-6">{exp.company}</h4>
                  
                  <ul className="space-y-3">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-3">
                        <span className="text-blue-400 mt-1.5">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* <div className="flex justify-center mt-20">
          <button className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-gray-500 transition-colors uppercase tracking-widest">
            View full timeline →
          </button>
        </div> */}
      </div>
    </section>
  );
}
