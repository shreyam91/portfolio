"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { SiGeeksforgeeks, SiGithub, SiLeetcode, SiLinkedin } from "react-icons/si";
import { track } from "../lib/track";

/**
 * SocialProof — the signals, not the claims (section 13).
 *
 * Honest, verifiable proof only. No invented testimonials, no invented
 * metrics — instead, the places where the work is out in the world and
 * anyone can check it: coding profiles, credentials, open source.
 * Each row links to the real, public profile.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PROOF = [
  {
    name: "LeetCode",
    detail: "Data structures & algorithms practice",
    url: "https://leetcode.com/u/Shrey91leet/",
    Icon: SiLeetcode,
    meta: "leetcode.com/u/Shrey91leet",
  },
  {
    name: "GeeksforGeeks",
    detail: "Problem solving & DSA",
    url: "https://www.geeksforgeeks.org/profile/shreyam91",
    Icon: SiGeeksforgeeks,
    meta: "geeksforgeeks.org/profile/shreyam91",
  },
  {
    name: "GitHub",
    detail: "Open source, projects, and builds",
    url: "https://github.com/shreyam91",
    Icon: SiGithub,
    meta: "github.com/shreyam91",
  },
  {
  name: "LinkedIn",
  detail: "Professional network, experience, and career",
  url: "https://www.linkedin.com/in/shreyam-kanaujiya/",
  Icon: SiLinkedin,
  meta: "linkedin.com/in/shreyam91",
},

];

export default function SocialProof() {
  return (
    <section className="relative w-full py-20 md:py-20 bg-[#fafafa] dark:bg-[#0d0d0d] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl mb-14 md:mb-16"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-4 block">
            Proof, not promises
          </span>
          <h2 className="text-2xl md:text-4xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            The work is out in the open —{" "}
            <span className="text-[#3b82f6]">go check it</span>.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-5">
            No invented numbers here. These are the places where the work lives,
            public and verifiable.
          </p>
        </motion.div>

        {/* Proof rows */}
        <div className="border-t border-gray-200/70 dark:border-white/10">
          {PROOF.map((item, i) => {
            const { Icon } = item;
            return (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("click_social", { platform: item.name })}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="group flex items-center gap-5 py-6 md:py-8 border-b border-gray-200/70 dark:border-white/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 group-hover:text-[#3b82f6] group-hover:border-[#3b82f6]/50 transition-colors">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base md:text-lg text-[#1a1a1a] dark:text-white font-light">
                    {item.name}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-500 font-light truncate">
                    {item.detail}
                  </span>
                </span>
                <span className="ml-auto hidden sm:block text-xs font-mono text-gray-400 dark:text-gray-600 truncate">
                  {item.meta}
                </span>
                <FiArrowUpRight className="shrink-0 text-[#3b82f6] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
