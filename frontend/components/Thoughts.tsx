"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiBook, FiEdit3, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import type { BlogPost } from "../app/data/blogsData";

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

export default function Thoughts({ blogs }: { blogs: BlogPost[] }) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
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
              <motion.article
                layout
                key={blog.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: (i % 3) * 0.08,
                  ease: EASE,
                }}
                onClick={() => setSelectedBlog(blog)}
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
                      {blog.date && <span>{blog.date}</span>}
                      {blog.readTime && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span>{blog.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed flex-grow">
                  {blog.description}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Reading modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 md:p-8 bg-black/60 backdrop-blur-md cursor-pointer overflow-y-auto"
          >
            <motion.div
              initial={{ y: 32, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] my-6 flex flex-col bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden cursor-default"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gray-100 dark:border-white/10">
                <span className="text-[11px] font-mono text-[#3b82f6] uppercase tracking-[0.25em]">
                  Campfire Note
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  aria-label="Close note"
                  className="p-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                {selectedBlog.image && (
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-[#151515]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedBlog.image}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
                    <div className="absolute bottom-5 left-6 right-6 md:left-8">
                      <h2 className="text-xl md:text-2xl font-light text-white tracking-tight leading-tight">
                        {selectedBlog.title}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="p-7 md:p-10">
                  {(selectedBlog.date || selectedBlog.readTime) && (
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-widest">
                      {selectedBlog.date && <span>{selectedBlog.date}</span>}
                      {selectedBlog.readTime && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span>{selectedBlog.readTime}</span>
                        </>
                      )}
                    </div>
                  )}

                  {!selectedBlog.image && (
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] dark:text-white mb-6">
                      {selectedBlog.title}
                    </h2>
                  )}

                  <div className="prose prose-sm max-w-none prose-headings:font-light prose-h3:text-2xl prose-a:text-[#3b82f6] text-gray-700 dark:text-gray-300 dark:prose-headings:text-white dark:prose-invert">
                    <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
