"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiBook, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

export default function Thoughts({ blogs }: { blogs: any[] }) {
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visibleBlogs = expanded ? blogs : blogs.slice(0, 3);

  return (
    <section className="relative w-full py-18 bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">
              04
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-4">
              Campfire{" "}
              <span className="font-serif italic text-gray-500 dark:text-gray-400">
                Notes
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg font-light">
              Thoughts on engineering, design, and growth.
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-[#1a1a1a] dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            {expanded ? "Hide all notes ↑" : "Explore all notes →"}
          </button>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {visibleBlogs.map((blog, i) => (
              <motion.article
                layout
                key={blog._id || blog.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                onClick={() => setSelectedBlog(blog)}
                className="group cursor-pointer flex flex-col p-6 rounded-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    {i % 2 === 0 ? <FiBook /> : <FiEdit3 />}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#1a1a1a] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        {blog.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow pl-14">
                  {blog.description}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal / Expanded View for Blog */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-8 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="sticky top-6 right-6 float-right p-3 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#222222] hover:text-black dark:hover:text-white transition-colors z-10"
              >
                <FiX size={20} />
              </button>

              <div className="p-8 md:p-16">
                <span className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4 block">
                  Campfire Note
                </span>
                <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-8">
                  {selectedBlog.title}
                </h2>

                {selectedBlog.image && (
                  <div className="relative w-full h-[300px] md:h-[400px] mb-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedBlog.image}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none prose-headings:font-light prose-h3:text-2xl prose-a:text-blue-500 text-gray-700 dark:text-gray-300 dark:prose-headings:text-white dark:prose-invert">
                  <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
