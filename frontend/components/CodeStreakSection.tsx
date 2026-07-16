"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiServer,
  FiLayers,
  FiBook,
  FiEdit3,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";

const features = [
  {
    title: "DSA Problems",
    description:
      "Curated coding challenges covering essential data structures and algorithms.",
    icon: <FiCode className="text-blue-400" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20 group-hover:border-blue-500/40",
    shadow: "group-hover:shadow-blue-500/10",
  },
  {
    title: "System Design",
    description: "Real-world architecture questions and design case studies.",
    icon: <FiServer className="text-purple-400" />,
    bg: "bg-purple-500/10",
    border: "border-purple-500/20 group-hover:border-purple-500/40",
    shadow: "group-hover:shadow-purple-500/10",
  },
  {
    title: "Machine Coding",
    description:
      "Practical coding assignments that simulate technical interviews.",
    icon: <FiLayers className="text-indigo-400" />,
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20 group-hover:border-indigo-500/40",
    shadow: "group-hover:shadow-indigo-500/10",
  },
  {
    title: "Resources",
    description:
      "Curated notes, cheat sheets, roadmaps, and interview preparation material.",
    icon: <FiBook className="text-teal-400" />,
    bg: "bg-teal-500/10",
    border: "border-teal-500/20 group-hover:border-teal-500/40",
    shadow: "group-hover:shadow-teal-500/10",
  },
  {
    title: "Blogs",
    description:
      "Technical articles, interview experiences, and engineering insights.",
    icon: <FiEdit3 className="text-pink-400" />,
    bg: "bg-pink-500/10",
    border: "border-pink-500/20 group-hover:border-pink-500/40",
    shadow: "group-hover:shadow-pink-500/10",
  },
];

export default function CodeStreakSection() {
  return (
    <section className="relative w-full py-10 bg-[#f8fafc] dark:bg-[#0B0F19] overflow-hidden transition-colors duration-500">
      {/* Animated Gradient Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
            05
          </span>
          <h2 className="text-3xl md:text-6xl font-light text-[#1a1a1a] dark:text-white mb-6">
            Platform
            <span className="font-serif italic text-gray-500 dark:text-gray-400">
              Showcase
            </span>
          </h2>
        </div>

        {/* Browser Mockup */}
        <div className="w-full max-w-7xl mx-auto rounded-[24px] border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-[#0f172a]/80 backdrop-blur-2xl shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/30 overflow-hidden">
          {/* Browser Header */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-100/50 dark:bg-white/5">
            <div className="flex space-x-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-6 py-1 rounded-md bg-white dark:bg-white/5 text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-2 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-inner">
                codestreak.dev
              </div>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>

          {/* Browser Content */}
          <div className="p-8 md:p-14 lg:p-16">
            {/* Hero Section inside Browser */}
            <div className="text-center mb-10">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-gray-900 dark:text-white tracking-tight mb-3">
                CodeStreak
              </h3>
              <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 font-semibold mb-2">
                Your all-in-one interview preparation platform.
              </p>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Practice coding, master system design, solve machine coding
                challenges, and learn from curated resources—all in one place.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className={`group p-6 rounded-2xl border ${f.border} border-gray-200 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:dark:bg-white/10 hover:shadow-xl ${f.shadow}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bg} text-xl border border-gray-100 dark:border-white/5`}
                  >
                    {f.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {f.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              ))}
              {/* Optional 6th card or fill empty space nicely */}
              <motion.div
                whileHover={{ y: -5 }}
                className="group p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-xl border border-gray-200 dark:border-white/5">
                  <FiExternalLink />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  And much more...
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Join the platform to unlock all available features.
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <Link
                href="/codestreak"
                target="_blank"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Platform
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

