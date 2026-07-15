"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function GlobalHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="group flex items-center gap-2 bg-white/85 dark:bg-[#111111]/85 hover:bg-white dark:hover:bg-[#1a1a1a] backdrop-blur-md pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-serif font-bold text-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <span
            className="font-medium text-gray-800 dark:text-gray-200 tracking-wide text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Shreyam Kanaujiya
          </span>
        </Link>

        {mounted && <ThemeToggle />}
      </div>
    </motion.header>
  );
}
