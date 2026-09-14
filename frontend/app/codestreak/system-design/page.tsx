"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import {
  DifficultyBadge,
  EASE,
  PageHeader,
  TagPill,
} from "@/components/shared/codestreak-ui";
import { contentApi } from "@/lib/api";
import { toSlug, useCodeStreakBasePath } from "@/lib/codestreak";

type SystemQuestion = {
  _id?: string;
  title?: string;
  difficulty?: string;
  category?: string;
  estimatedTime?: string;
  description?: string;
  tags?: string[];
  companies?: string[];
};

export default function SystemDesignPage() {
  const basePath = useCodeStreakBasePath();
  const [items, setItems] = useState<SystemQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    async function load() {
      try {
        const res = await contentApi.getSystemDesignQuestions();
        const data = res.data?.data ?? res.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load system design questions", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const levels = useMemo(() => {
    const set = new Set<string>();
    for (const i of items) {
      if (i.difficulty) set.add(i.difficulty);
    }
    return ["All", ...[...set].sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return items.filter((item) => {
      if (difficulty !== "All" && item.difficulty !== difficulty) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.category} ${item.description} ${(
        item.tags ?? []
      ).join(" ")} ${(item.companies ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, difficulty, deferredSearch]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <PageHeader
          eyebrow="System Design"
          title="Real architectural"
          titleAccent="case studies"
          subtitle="Systems I've designed end to end — requirements, high-level flows, deep dives and the trade-offs that shaped the final call."
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            {levels.map((lvl) => {
              const active = difficulty === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-colors ${
                    active
                      ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#3b82f6]/40 hover:text-[#3b82f6]"
                  }`}
                >
                  {lvl}
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
              placeholder="Search systems, topics, companies…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-sm text-[#1a1a1a] dark:text-[#fcfcfc] outline-none focus:border-[#3b82f6]/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

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
              No case studies found. Try a different filter.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((item, i) => (
              <motion.div
                key={item._id ?? toSlug(item.title)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                className="h-full"
              >
                <Link
                  href={`${basePath}/system-design/${toSlug(item.title)}`}
                  className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 hover:border-[#3b82f6]/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <DifficultyBadge difficulty={item.difficulty} />
                    {item.category && (
                      <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                        {item.category}
                      </TagPill>
                    )}
                  </div>
                  <h3 className="text-base font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-3 text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto pt-5">
                    {(item.tags?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags?.slice(0, 4).map((tag) => (
                          <TagPill key={tag}>{tag}</TagPill>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 text-xs">
                      <span className="font-mono text-gray-500 dark:text-gray-400">
                        {item.estimatedTime || "Design case"}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[#3b82f6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Open <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
