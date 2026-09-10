"use client";

import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { LiveProject } from "@/app/data/liveProjects";
import { track } from "@/lib/track";

/**
 * LiveProjects — a grid of deployed projects.
 *
 * Each card shows a compact browser-mockup header (traffic lights + domain),
 * the project description, tech tags, and links to the live site / GitHub.
 * Replaces the single-project CodeStreakSection with a multi-project grid
 * that follows the existing portfolio design language.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ProjectCard({
  project,
  index,
}: {
  project: LiveProject;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.1, ease: EASE }}
      className="group flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-[#3b82f6]/40 transition-colors"
    >
      {/* Mini browser header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="px-4 py-0.5 rounded-md bg-white dark:bg-white/5 text-[11px] text-gray-500 dark:text-gray-400 font-mono border border-gray-200 dark:border-white/5 truncate max-w-[200px]">
            {project.domain}
          </span>
        </div>
        <div className="w-[52px]" />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-base font-normal text-[#1a1a1a] dark:text-white mb-2 tracking-tight">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-mono text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("live_project_visit", { project: project.id })}
            className="inline-flex items-center gap-1.5 text-sm text-[#3b82f6] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors font-light"
          >
            Live
            <FiExternalLink
              size={13}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("live_project_code", { project: project.id })
              }
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors font-light"
            >
              <FiGithub size={14} />
              Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveProjects({
  projects,
}: {
  projects: LiveProject[];
}) {
  return (
    <section className="relative w-full py-24 md:py-36 bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl mb-14 md:mb-20"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
            Shipped
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            Live{" "}
            <span className="font-serif italic text-[#3b82f6]">Projects</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-4">
            Things I&apos;ve built and deployed — products, platforms, and tools
            that are live right now.
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
