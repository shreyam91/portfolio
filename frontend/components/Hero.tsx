"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowRight,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import type { Hero as HeroData } from "@/app/data/types";
import { track } from "@/lib/track";

/**
 * Hero — the single most important section.
 *
 * Purpose: answer "who", "what", and "why care" in one strong statement,
 * then invite a conversation. Deliberately quiet and typographic — no cards,
 * floating logos, or gradient noise. The only interactive accent is a faint
 * travelling point on a thin line that leads the eye toward "Start a project".
 */

export default function Hero({ heroData }: { heroData: HeroData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [pointerFine, setPointerFine] = useState(false);

  // Faint crosshair that trails the cursor inside the hero (spring, GPU-friendly).
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPointerFine(hasFinePointer && !prefersReduced);

    const el = sectionRef.current;
    if (!el || !hasFinePointer || prefersReduced) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const headline = heroData.headline as string;
  const [headlineLead, headlineTail] = headline.split("digital products");

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Subtle, hand-drawn journey accent: a point travels a line toward the CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="absolute inset-x-0 bottom-[18%] hidden md:flex justify-center"
        aria-hidden="true"
      >
        <div className="relative w-[min(46rem,70vw)] h-px bg-gradient-to-r from-transparent via-gray-300/70 dark:via-white/15 to-transparent">
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#3b82f6]"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2.4, delay: 1.2, ease: [0.45, 0, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* Faint cursor crosshair — the developer accent */}
      {pointerFine && (
        <motion.div
          className="pointer-events-none absolute z-20 hidden sm:block h-7 w-7 -translate-x-1/2 -translate-y-1/2"
          style={{ x: sx, y: sy, left: 0, top: 0 }}
          aria-hidden="true"
        >
          <div className="h-full w-full rounded-full border border-[#3b82f6]/25" />
          <div className="absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/40" />
        </motion.div>
      )}

      <div className="relative z-10 max-w-4xl w-full px-6 md:px-12 flex flex-col items-start text-left pb-28 sm:pb-0">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xs font-mono text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase mb-6 sm:mb-8 flex items-center gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
          Shreyam Kanaujiya
        </motion.p>

        {/* One strong statement */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-[2.1rem] leading-[1.12] sm:text-6xl sm:leading-[1.05] lg:text-7xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] mb-7 sm:mb-10"
        >
          {headlineLead}
          <span className="text-[#3b82f6]">digital products</span>
          {headlineTail}
        </motion.h1>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-xl leading-relaxed mb-9 sm:mb-12"
        >
          {heroData.tagline}
        </motion.p>

        {/* Invitation CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6"
        >
          {/* biome-ignore lint/a11y/useValidAnchor: in-page section anchor */}
          <a
            href="#contact"
            onClick={() => track("hero_cta")}
            className="group inline-flex items-center gap-2 text-[#1a1a1a] dark:text-white font-medium text-sm tracking-wide"
          >
            <span className="border-b border-[#3b82f6]/60 pb-1 transition-colors group-hover:border-[#3b82f6]">
              Start a project
            </span>
            <FiArrowRight className="text-[#3b82f6] transition-transform group-hover:translate-x-1" />
          </a>

          {/* biome-ignore lint/a11y/useValidAnchor: in-page section anchor */}
          <a
            href="#work"
            onClick={() => track("explore_work")}
            className="group inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors font-light"
          >
            Explore my work
            <FiArrowDown className="transition-transform group-hover:translate-y-0.5" />
          </a>

          <a
            href={heroData.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors font-light"
          >
            <FiFileText className="text-gray-400" />
            Résumé
          </a>
        </motion.div>
      </div>

      {/* Minimal bottom social row — quiet, not filling the screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="absolute bottom-8 inset-x-0 flex justify-center sm:justify-start sm:left-10 gap-5 z-10"
      >
        {[
          {
            Icon: FiGithub,
            href: "https://github.com/shreyam91",
            label: "GitHub",
          },
          {
            Icon: FiLinkedin,
            href: "https://www.linkedin.com/in/shreyam-kanaujiya/",
            label: "LinkedIn",
          },
          {
            Icon: FiMail,
            href: "mailto:shreyam91183@gmail.com",
            label: "Email",
          },
          {
            Icon: SiLeetcode,
            href: "https://leetcode.com/u/Shrey91leet/",
            label: "LeetCode",
          },
        ].map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onClick={() => track("click_social", { platform: label })}
            className="text-gray-400 dark:text-gray-500 hover:text-[#3b82f6] transition-colors"
          >
            <Icon size={17} />
          </a>
        ))}
      </motion.div>
    </section>
  );
}
