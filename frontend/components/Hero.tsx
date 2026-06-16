"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

export default function Hero({ heroData }: { heroData: any }) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Image with Light Overlay */}
      {/* <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/background/adventure.png')" }}
      /> */}
      {/* <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[2px]" /> */}
      
      {/* Diagonal Bottom Cut to transition to next section */}
      {/* <div className="absolute bottom-0 left-0 w-full h-24 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} /> */}

      {/* Social Links on the Left */}
<div className="hidden lg:flex absolute left-10 xl:left-16 top-1/2 -translate-y-1/2 flex-col gap-6 z-20">
        {[
          { icon: FiGithub, href: "https://github.com/shreyam91", label: "GitHub" },
          { icon: FiLinkedin, href: "https://www.linkedin.com/in/shreyam-kanaujiya/", label: "LinkedIn" },
          { icon: FiMail, href: "mailto:shreyam91183@gmail.com", label: "Email" },
          { icon: SiLeetcode, href: "https://leetcode.com/u/Shrey91leet/", label: "LeetCode" },
          { icon: SiGeeksforgeeks, href: "https://www.geeksforgeeks.org/profile/shreyam91", label: "GeeksForGeeks" },
        ].map((social, i) => (
          <motion.a
            key={i}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="text-gray-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full"
            aria-label={social.label}
          >
            <social.icon size={20} />
          </motion.a>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 md:px-12 lg:px-24 flex flex-col items-center text-center mt-12">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm font-mono text-gray-500 tracking-[0.3em] uppercase mb-2 mt-6"
        >
          {heroData.title}
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-light text-[#1a1a1a] dark:text-white leading-[1.1] tracking-tight mb-8"
        >
          {(heroData.headline || "Every great system begins with a journey.").split(' ').map((word: string, i: number) => (
            <React.Fragment key={i}>
              {word.toLowerCase().includes("journey") ? (
                <span className="font-serif italic text-blue-600 block sm:inline mt-2 sm:mt-0">{word}</span>
              ) : (
                <span className="inline-block mr-3 md:mr-4">{word}</span>
              )}
            </React.Fragment>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mb-12"
        >
          {heroData.shortBio || heroData.tagline || "Exploring systems, interfaces, and digital experiences."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a href="#projects" className="group relative px-8 py-3 bg-[#1a1a1a] dark:bg-white rounded-full overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white dark:text-[#1a1a1a] font-medium text-sm tracking-wide flex items-center gap-2">
              Begin Journey <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          
          <a href="/shreyam_kanaujiya_Fullstack_developer.pdf" download className="group relative px-8 py-3 bg-white/50 dark:bg-[#111111]/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <span className="relative text-[#1a1a1a] dark:text-white font-medium text-sm tracking-wide flex items-center gap-2">
              <FiFileText /> Resume
            </span>
          </a>
        </motion.div>

        {/* Mobile Social Links in standard flow to prevent overlap */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="lg:hidden flex items-center justify-center gap-6 mt-10 bg-white/60 backdrop-blur-md px-5 py-3 rounded-full border border-gray-200/80 shadow-md"
        >
          {[
            { icon: FiGithub, href: "https://github.com/shreyam91" },
            { icon: FiLinkedin, href: "https://www.linkedin.com/in/shreyam-kanaujiya/" },
            { icon: FiMail, href: "mailto:shreyam91183@gmail.com" },
            { icon: SiLeetcode, href: "https://leetcode.com/u/Shrey91leet/" },
            { icon: SiGeeksforgeeks, href: "https://www.geeksforgeeks.org/profile/shreyam91" },
          ].map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <social.icon size={18} />
            </a>
          ))}
        </motion.div> */}
      </div>

      {/* <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-gray-300 to-transparent" />
      </motion.div> */}
      
      {/* Scroll indicator for the right side (page position) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10 hidden md:flex">
        <span className="text-[10px] font-mono text-gray-400">01</span>
        <div className="w-[1px] h-32 bg-gray-200 relative">
          <motion.div 
            className="absolute top-0 left-0 w-full h-8 bg-blue-500"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-[10px] font-mono text-gray-400">08</span>
      </div>
    </section>
  );
}
