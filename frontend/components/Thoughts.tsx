"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiBook, FiEdit3, FiArrowRight } from "react-icons/fi";

/**
 * Thoughts — Campfire Notes (blog section).
 *
 * A quiet, editorial list of notes. Cards reveal on scroll, open into a
 * focused reading modal that renders the full note as markdown. Design follows
 * the site language: mono eyebrow, serif-italic secondary voice, light weight.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function NoteIcon({ index }: { index: number }) {
  return index % 2 === 0 ? <FiBook /> : <FiEdit3 />;
}

export default function Thoughts({ blogs }: { blogs: any[] }) {
  const [expanded, setExpanded] = useState(false);

  const visibleBlogs = expanded ? blogs : blogs.slice(0, 3);

  return (
    <section className="relative w-full py-20 md:py-24 bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
              Writing
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
              Campfire{" "}
              <span className="font-serif italic text-[#3b82f6]">Notes</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-4">
              Thoughts on engineering, design, and growth.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-light text-gray-600 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
          >
            {expanded ? "Hide all notes ↑" : "Explore all notes →"}
          </button>
        </motion.div>

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visibleBlogs.map((blog, i) => (
              <motion.a
                layout
                key={blog._id || blog.id}
                href={blog.mediumUrl || `/codestreak/blogs/${blog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: (i % 3) * 0.08,
                  ease: EASE,
                }}
                className="group cursor-pointer flex flex-col p-6 rounded-2xl bg-[#fafafa] dark:bg-[#111111] border border-gray-200 dark:border-white/10 hover:border-[#3b82f6]/40 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-[#3b82f6] group-hover:border-[#3b82f6]/40 transition-colors">
                    <NoteIcon index={i} />
                  </div>
                  <div>
                    <h3 className="text-base font-normal text-[#1a1a1a] dark:text-white group-hover:text-[#3b82f6] dark:group-hover:text-[#3b82f6] transition-colors mb-1 tracking-tight">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 dark:text-gray-500">
                      {/* {blog.date && <span>{blog.date}</span>} */}
                      {blog.readTime && (
                        <>
                          {/* <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" /> */}
                          <span>{blog.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed flex-grow mb-4">
                  {blog.description || blog.excerpt}
                </p>
                <div className="mt-auto text-xs font-mono text-[#3b82f6] uppercase tracking-widest flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read <FiArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
