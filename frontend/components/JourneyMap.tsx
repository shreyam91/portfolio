"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

export default function JourneyMap({ projects }: { projects: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  const visibleProjects = expanded ? projects : projects.slice(0, 4);

  const handleViewAll = () => {
    const nextState = !expanded;
    setExpanded(nextState);
    if (nextState) {
      setShowScrollIndicator(true);
      setTimeout(() => {
        setShowScrollIndicator(false);
      }, 2500);
    }
  };

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // A simple SVG curve that spans across the width dynamically based on visibleProjects count
  const lineWidth = Math.max(1000, visibleProjects.length * 250);
  
  const generatePath = () => {
    let d = "M0,50 ";
    for (let i = 0; i < visibleProjects.length; i++) {
      const x = i * 250 + 125;
      const nextX = (i + 1) * 250 + 125;
      const y1 = i % 2 === 0 ? 150 : -50;
      const y2 = i % 2 === 0 ? -50 : 150;
      d += `C${x},${y1} ${nextX - 50},${y2} ${nextX},50 `;
    }
    return d;
  };

  const wavyLine = (
    <svg className="absolute top-1/2 left-0 h-32 -translate-y-1/2 z-0 pointer-events-none text-slate-300 dark:text-slate-700" style={{ width: `${lineWidth}px` }} preserveAspectRatio="none" viewBox={`0 0 ${lineWidth} 100`}>
      <path
        d={generatePath()}
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
    </svg>
  );

  return (
    <section id="projects" className="relative w-full max-w-7xl mx-auto py-18 px-2">
      <div className="mb-20 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">01</span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-4">
            Journey <span className="font-serif italic text-gray-400 dark:text-gray-500">Map</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg font-light">
            A trail of projects, each solving real problems and creating real impact.
          </p>
        </div>
        <button onClick={handleViewAll} className="text-sm font-medium text-[#1a1a1a] dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-widest flex items-center gap-2">
          {expanded ? "View less ↑" : "View all projects →"}
        </button>
      </div>

      <div className="relative w-full overflow-x-auto pb-14 hide-scrollbar" ref={containerRef}>
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center bg-white/5 dark:bg-black/20 backdrop-blur-[2px]"
            >
              <div className="bg-black/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 text-white border border-white/10 animate-bounce">
                <span className="text-2xl">👉 Swipe / Scroll</span>
                <span className="text-xs font-mono tracking-widest uppercase font-semibold text-blue-400">
                  Explore Projects Rightwards
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="relative h-[500px]" style={{ minWidth: `${Math.max(1000, visibleProjects.length * 250)}px` }}>
          {wavyLine}
          
          <div className="absolute inset-0 flex items-center px-4" style={{ gap: '10px' }}>
            {visibleProjects.map((project, index) => {
              // Zig-zag up and down
              const isTop = index % 2 !== 0;
              return (
                <motion.div
                  key={project._id || project.projectId || project.id || index}
                  layout
                  initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                  className={`relative z-10 w-[240px] flex-shrink-0 flex flex-col ${isTop ? 'mt-[-180px]' : 'mt-[180px]'}`}
                >
                  <div 
                    onClick={() => setSelectedProject(project)}
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] shadow-md mb-4 group cursor-pointer border border-gray-200 dark:border-gray-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-white/0 dark:bg-black/0 group-hover:bg-white/10 dark:group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 backdrop-blur-[2px]">
                      <span className="bg-white dark:bg-[#111111] text-black dark:text-white px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider">
                        View Project
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-[#1a1a1a] dark:text-white">{project.title}</h3>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{project.tags[0]}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        {project.tags.slice(1, 3).map((tag: string) => (
                          <React.Fragment key={tag}>
                            <span>{tag}</span>
                            <span className="last:hidden">•</span>
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                  
                  {/* The dot connector */}
                  <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none ${isTop ? 'bottom-[-40px] h-[40px]' : 'top-[-40px] h-[40px] flex-col-reverse'}`}>
                    <div className="w-[1px] h-[24px] bg-gradient-to-b from-blue-300 to-blue-500 opacity-60" />
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <div className="absolute w-4 h-4 bg-blue-400/40 rounded-full animate-ping" />
                      <div className="absolute w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Modal / Expanded View for Project */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col cursor-default max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in duration-300"
            >
                {/* Close Button overlay with backdrop-blur for maximum contrast */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-3 bg-white/80 dark:bg-[#1a1a1a]/80 hover:bg-white dark:hover:bg-[#1a1a1a] backdrop-blur-md rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white shadow-md transition-all duration-200 z-10 active:scale-95"
                >
                  <FiX size={20} />
                </button>
  
                {/* Full Width landscape layout image container */}
                <div className="w-full aspect-video relative bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 overflow-hidden border-b border-gray-100 dark:border-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
  
                {/* Content description column below the banner */}
                <div className="p-8 md:p-12 flex flex-col">
                  <span className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4 block font-semibold">
                    Project Overview
                  </span>
                  
                  <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white mb-4 tracking-tight">
                    {selectedProject.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-light">
                    {selectedProject.description}
                  </p>
  
                  {selectedProject.longDescription && (
                    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-blue-500 mb-6">
                      <ReactMarkdown>{selectedProject.longDescription}</ReactMarkdown>
                    </div>
                  )}
  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
  
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                    {selectedProject.live && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        View Live <FiExternalLink />
                      </a>
                    )}
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                      >
                        GitHub <FiGithub />
                      </a>
                    )}
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
