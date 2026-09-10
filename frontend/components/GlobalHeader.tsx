"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * GlobalHeader — minimal, unobtrusive navigation.
 *
 * Quiet wordmark + four anchor links + one persistent invitation. It recedes
 * when you scroll (a faint blur backdrop appears) and never fights the content
 * underneath.
 */

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function GlobalHeader() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-[#fcfcfc]/80 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-gray-200/60 dark:border-white/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2 text-[#1a1a1a] dark:text-[#fcfcfc]"
          aria-label="Shreyam Kanaujiya — back to top"
        >
          <span className="font-sans font-medium tracking-[0.18em] text-sm sm:text-base">
            SHREYAM
          </span>
          <span className="text-[#3b82f6] font-medium">KANAUJIYA</span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-light text-gray-600 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#3b82f6] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Persistent invitation + theme */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-light text-[#1a1a1a] dark:text-[#fcfcfc] border border-gray-300 dark:border-white/15 px-3 py-1.5 rounded-full hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
          >
            Let&apos;s work together
            <FiArrowUpRight className="text-xs" />
          </a>
          {mounted && <ThemeToggle />}
        </div>
      </div>
    </motion.header>
  );
}
