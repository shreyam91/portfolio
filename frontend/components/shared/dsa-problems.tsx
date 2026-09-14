"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { contentApi } from "@/lib/api";
import { platformLabel } from "@/lib/dsaForge";
import type { DSAQuestion } from "@/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PLATFORMS = [
  { value: "all", label: "All" },
  { value: "leetcode", label: "LeetCode" },
  { value: "gfg", label: "GeeksforGeeks" },
] as const;

type PlatformFilter = (typeof PLATFORMS)[number]["value"];

const difficultyStyles: Record<string, { label: string; className: string }> = {
  Easy: {
    label: "Easy",
    className:
      "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5",
  },
  Medium: {
    label: "Medium",
    className:
      "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5",
  },
  Hard: {
    label: "Hard",
    className: "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5",
  },
};

export function DSAProblems() {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await contentApi.getDsaQuestions();
        if (res.data?.data) {
          setQuestions(res.data.data);
        } else if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else if (Array.isArray(res)) {
          setQuestions(res);
        }
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return questions.filter((item) => {
      if (platform !== "all" && item.platform !== platform) return false;
      if (q && !item.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [questions, platform, deferredSearch]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/codestreak"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to CodeStreak
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="mt-10 mb-12 max-w-2xl"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
            DSA · DSAForge
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            Problems I&apos;ve <span className="text-[#3b82f6]">solved</span>,
            <br />
            straight from GitHub.
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-6">
            Every problem here is auto-synced from my DSAForge GitHub repo — no
            hand-written notes, just the problems I actually solved and the code
            I submitted. Filter by platform or search by title.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
          className="flex flex-col md:flex-row md:items-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {PLATFORMS.map((p) => {
              const active = platform === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPlatform(p.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-colors ${
                    active
                      ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#3b82f6]/40 hover:text-[#3b82f6]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72 md:ml-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-sm text-[#1a1a1a] dark:text-[#fcfcfc] outline-none focus:border-[#3b82f6]/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* List */}
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              No problems found.{" "}
              {questions.length === 0
                ? "Seed some DSAForge metadata to get started."
                : "Try a different filter."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((item, i) => {
              const diff = item.difficulty
                ? difficultyStyles[item.difficulty]
                : null;
              return (
                <motion.div
                  key={item._id ?? item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                >
                  <Link
                    href={`/codestreak/dsa/${item.slug}`}
                    className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 hover:border-[#3b82f6]/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#3b82f6] border border-[#3b82f6]/30 rounded-full px-2.5 py-0.5">
                        {platformLabel(item.platform)}
                      </span>
                      {diff && (
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest rounded-full px-2.5 py-0.5 border ${diff.className}`}
                        >
                          {diff.label}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {item.topics && item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {item.topics.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full px-2.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
