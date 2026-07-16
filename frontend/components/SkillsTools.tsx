"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tech } from "../app/data/types";

import {
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiMongodb,
  SiExpress,
  SiSpringboot,
  SiGit,
  SiDocker,
  SiFigma,
  SiGithub,
  SiJavascript,
  SiHtml5,
  SiCss3,
} from "react-icons/si";

import { FaJava, FaCode, FaServer, FaCogs } from "react-icons/fa";

import { IconType } from "react-icons";

const getIconForTech = (name: string): IconType => {
  const iconMap: Record<string, IconType> = {
    "Next.js": SiNextdotjs,
    React: SiReact,
    "Node.js": SiNodedotjs,
    TypeScript: SiTypescript,
    "Tailwind CSS": SiTailwindcss,
    "Framer Motion": SiFramer,
    MongoDB: SiMongodb,
    "Express.js": SiExpress,
    Java: FaJava,
    "Spring Boot": SiSpringboot,
    Git: SiGit,
    Docker: SiDocker,
    Figma: SiFigma,
    Github: SiGithub,
    GitHub: SiGithub,
    JavaScript: SiJavascript,
    HTML5: SiHtml5,
    CSS3: SiCss3,
    "RESTful APIs": FaServer,
    "REST APIs": FaServer,
    Microservices: FaCogs,
  };

  return iconMap[name] || FaCode;
};

const journey = [
    
    {
      title: "Frontend Technology",
      description:
        "Strengthened frontend development skills with modern frameworks, reusable components, and clean UI practices.",
      techs: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Responsive Design",
        "React",
        "Next.js",
        "TypeScript",
        "Redux Toolkit",
        "Tailwind CSS",
        "Framer Motion",
        "REST APIs",
      ],
    },
    {
      title: "Backend Technology",
      description:
        "Started building server-side applications, APIs, and database-driven systems for full-stack development.",
      techs: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "JWT Authentication",
        "REST APIs",
        "Postman",
        "Java",
        "Spring Boot",
        "SQL"
      ],
    },
    {
      title: "Software Architecture",
      description:
        "Explored scalable system design, deployment workflows, and engineering best practices for production-ready applications.",
      techs: [
        "Docker",
        "Microservices",
        "CI/CD",
        "Linux",
        "NGINX",
        "Git",
        "Spring Boot",
        "GitHub"
      ],
    },
    {
      title: "Distributed Systems",
      description:
        "Focused on advanced backend architecture, scalability, and designing reliable distributed applications.",
      techs: [
        "Kafka",
        "Redis",
        "Kubernetes",
        "System Design",
        "Load Balancing",
        "Spring Boot",
      ],
    },
    {
      title: "Cloud, DevOps & AI",
      description:
        "Expanding expertise in cloud-native infrastructure, automation, monitoring, and highly available production systems.",
      techs: ["AWS", "Docker", "GitHub Actions", "Copilot", "Cursor", "Claude"],
    },
  ];

export default function SkillsJourney({
  skills = [],
  techStack = [],
}: {
  skills?: string[];
  techStack?: Tech[];
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
const [open, setOpen] = useState<string | null>(journey[0]?.title || null);
  

  return (
    <section className="relative w-full py-10 md:py-14 bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      {/* Style Injection to Hide Scrollbars */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
        .scrollbar-none {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-3 block">
            02
          </span>

          <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-4">
            My Tech{" "}
            <span className="font-serif italic text-gray-500 dark:text-gray-400">
              Journey
            </span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light">
            A timeline of technologies I’ve explored while building products.
          </p>
        </div>

        {/* ========================= */}
        {/* DESKTOP TIMELINE (md+) */}
        {/* ========================= */}
        <div className="hidden md:block relative w-full overflow-hidden">
          {/* Cards Scrolling Track */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto px-10 pb-8 pt-8 snap-x snap-mandatory scroll-smooth scrollbar-none relative z-10 w-full"
          >
            {/* Horizontal Timeline Path Line inside scroll container (vertical center matches 70px perfectly) */}
            <div className="absolute top-[70px] left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-800 z-0 pointer-events-none min-w-[3000px]" />

            {journey.map((item, index) => {
              return (
                <div
key={item.title}                  className="snap-center flex-shrink-0 w-[420px] relative flex flex-col"
                >
                  {/* Centered Circle Dot (Vertically centered perfectly on the horizontal line) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[22px] z-20">
                    <div className="w-8 h-8 rounded-full border-4 border-[#fafafa] dark:border-[#0a0a0a] bg-blue-500 shadow-md flex items-center justify-center text-white text-[11px] font-mono font-bold select-none transition-colors duration-300">
                      {index + 1}
                    </div>
                  </div>

                  {/* Vertical Dotted Connector Line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[38px] w-[2px] h-14 border-l-2 border-dashed border-blue-400/40 dark:border-blue-600/40 z-0" />

                  {/* Card wrapper */}
                  <div className="mt-24 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 relative overflow-hidden flex flex-col h-[340px] group w-full">
                    {/* Hover Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-100/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* <span className="text-xs font-mono text-blue-500 dark:text-blue-400 tracking-[0.3em] block mb-2 font-semibold">
                      {item.year}
                    </span> */}

                    <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow font-light mb-4">
                      {item.description}
                    </p>

                    {/* Tech Pills (wrap naturally with enough height for 2 rows) */}
                    <div className="flex flex-wrap gap-2 min-h-[76px] items-start w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                      {item.techs.map((techName) => {
                        const tech = techStack?.find(
                          (t) => t.name === techName,
                        );
                        const IconComponent = getIconForTech(techName);
                        const colorClass = tech?.color
                          ? tech.color
                              .replace("text-", "text-")
                              .replace("-400", "-500")
                              .replace("-300", "-600")
                          : "text-gray-500 dark:text-gray-400";

                        return (
                          <div
                            key={techName}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200/60 dark:border-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222] hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                          >
                            <div className={`text-xs ${colorClass}`}>
                              <IconComponent />
                            </div>
                            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {techName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================= */}
        {/* MOBILE ACCORDION (<md) */}
        {/* ========================= */}
        <div className="md:hidden space-y-4">
          {journey.map((item) => {
  const isOpen = open === item.title;

            return (
              <div
                key={item.title}
                className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300"
              >
                {/* HEADER */}
                <button
                  onClick={() => setOpen(isOpen ? null : item.title)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  {/* LEFT STRIP */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${isOpen ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400"}
                    `}
                    >
                      <span className="text-sm font-bold">
                        {item.title.charAt(0)}
                      </span>
                    </div>

                    <div className="text-left">
                      {/* <p className="text-[10px] font-mono tracking-widest text-blue-500 dark:text-blue-400">
                        {item.year}
                      </p> */}
                      <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* TOGGLE */}
                  <div
                    className={`
                    text-xl transition-transform duration-300
                    ${isOpen ? "rotate-45 text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}
                  `}
                  >
                    +
                  </div>
                </button>

                {/* CONTENT */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 120,
                          damping: 18,
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          duration: 0.2,
                        },
                      }}
                      className="px-5 pb-5 overflow-hidden border-t border-gray-100 dark:border-gray-800"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed font-light mt-3">
                        {item.description}
                      </p>

                      {/* TECH PILLS WITH ICONS (wrapping naturally inside accordion too) */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {item.techs.map((techName) => {
                          const tech = techStack?.find(
                            (t) => t.name === techName,
                          );
                          const IconComponent = getIconForTech(techName);
                          const colorClass = tech?.color
                            ? tech.color
                                .replace("text-", "text-")
                                .replace("-400", "-500")
                                .replace("-300", "-600")
                            : "text-gray-500 dark:text-gray-400";

                          return (
                            <div
                              key={techName}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200/60 dark:border-gray-800 rounded-full text-gray-700 dark:text-gray-300"
                            >
                              <div className={`text-xs ${colorClass}`}>
                                <IconComponent />
                              </div>
                              <span className="text-[11px] font-medium whitespace-nowrap">
                                {techName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
