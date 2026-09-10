"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { track } from "@/lib/track";

/**
 * SelectedWork — the strongest proof section (06-07).
 *
 * Each project is a mini case study, not a thumbnail card: problem first,
 * then what I built. Large visuals dominate; technology is quiet, supporting
 * detail. Clicking opens the fuller case-study view (the dedicated route
 * format lives as a next step).
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VISIBLE = 4;

interface CaseStudy {
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
  status?: string;
  role?: string;
}

export default function SelectedWork({ projects }: { projects: CaseStudy[] }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<CaseStudy | null>(null);

  const openStudy = (project: CaseStudy) => {
    track("open_case_study", { project: project.id });
    setSelected(project);
  };

  // Featured first, oldest of the rest last — a deliberate reading order.
  const ordered = [...projects].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
  );
  const visible = expanded ? ordered : ordered.slice(0, VISIBLE);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section
      id="work"
      className="relative w-full py-24 md:py-36 max-w-7xl mx-auto px-6 md:px-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-3xl mb-16 md:mb-24"
      >
        <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
          Selected work
        </span>
        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
          Built to solve problems,{" "}
          <span className="text-[#3b82f6]">not to fill a grid</span>.
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-6 max-w-2xl">
          Here&apos;s what I&apos;ve made and the problems behind it — the
          thinking, the build, and the outcome.
        </p>
      </motion.div>

      {/* Case studies */}
      <div>
        {visible.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className={`group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center pb-16 md:pb-24 ${
              i < visible.length - 1
                ? "border-b border-gray-200/70 dark:border-white/5 mb-16 md:mb-24"
                : ""
            }`}
          >
            {/* Text column */}
            <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <span className="font-mono text-xs tracking-[0.25em] text-gray-400 dark:text-gray-500">
                PROJECT / {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-[#1a1a1a] dark:text-white mt-4 mb-3 tracking-tight leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Quiet supporting detail */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-gray-400 dark:text-gray-500 mb-6">
                {project.role && <span>ROLE · {project.role}</span>}
                {project.year && <span>YEAR · {project.year}</span>}
                {project.status && <span>STATUS · {project.status}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-7">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 border border-gray-200 dark:border-white/10 text-[11px] text-gray-500 dark:text-gray-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openStudy(project)}
                className="group/cta inline-flex items-center gap-2 text-sm text-[#1a1a1a] dark:text-white"
              >
                <span className="border-b border-[#3b82f6]/60 pb-0.5 transition-colors group-hover/cta:border-[#3b82f6]">
                  View case study
                </span>
                <FiArrowUpRight className="text-[#3b82f6] transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </button>
            </div>

            {/* Visual column — the dominant element */}
            <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <button
                type="button"
                onClick={() => openStudy(project)}
                className="relative block w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-[#151515] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
                aria-label={`Open case study for ${project.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-60 transition-opacity group-hover:opacity-0" />
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-4 py-2 text-xs text-white/90"
                >
                  Open {project.title.split("–")[0].trim()}
                  <FiArrowUpRight size={14} />
                </motion.span>
              </button>
            </div>
          </motion.article>
        ))}

        {ordered.length > VISIBLE && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors font-light"
            >
              {expanded
                ? "Show less ↑"
                : `View all ${ordered.length} projects →`}
            </button>
          </div>
        )}
      </div>

      {/* Case-study modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
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
                  Case study
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close case study"
                  className="p-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                {/* Cover with overlaid title */}
                <div className="relative w-full aspect-video bg-gray-100 dark:bg-[#151515]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
                  <div className="absolute bottom-5 left-6 right-6 md:left-8">
                    <h2 className="text-xl md:text-2xl font-light text-white tracking-tight leading-tight">
                      {selected.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 md:p-9">
                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-gray-400 dark:text-gray-500 mb-6">
                    {selected.role && <span>ROLE · {selected.role}</span>}
                    {selected.year && <span>YEAR · {selected.year}</span>}
                    {selected.status && <span>STATUS · {selected.status}</span>}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-7">
                    {selected.description}
                  </p>

                  {selected.longDescription && (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-500 dark:prose-code:text-blue-400 dark:prose-invert mb-8">
                      <ReactMarkdown>{selected.longDescription}</ReactMarkdown>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex flex-wrap items-center gap-3 px-6 md:px-8 py-4 border-t border-gray-100 dark:border-white/10">
                {selected.live && (
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("view_live", { project: selected.id })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] dark:bg-[#3b82f6] text-white text-sm rounded-full hover:bg-gray-800 dark:hover:bg-[#2b6cb0] transition-colors"
                  >
                    View live <FiExternalLink size={14} />
                  </a>
                )}
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("view_code", { project: selected.id })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    <FiGithub size={14} /> Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
