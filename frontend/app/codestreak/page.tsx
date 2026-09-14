"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  FileText,
  Layers,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { DifficultyBadge, EASE, Stat } from "@/components/shared/codestreak-ui";
import { contentApi } from "@/lib/api";
import { toSlug, useCodeStreakBasePath } from "@/lib/codestreak";

type FeedItem = {
  key: string;
  href: string;
  section: string;
  title?: string;
  difficulty?: string;
  platform?: string;
};

export default function Dashboard() {
  const basePath = useCodeStreakBasePath();
  const [counts, setCounts] = useState({
    dsa: 0,
    systemDesign: 0,
    machineCoding: 0,
    blogs: 0,
  });
  const [recent, setRecent] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dsa, sd, mc, blogs] = await Promise.all([
          contentApi
            .getDsaQuestions()
            .then((r: any) => r.data?.data ?? r.data ?? []),
          contentApi
            .getSystemDesignQuestions()
            .then((r: any) => r.data?.data ?? r.data ?? []),
          contentApi
            .getMachineCodingQuestions()
            .then((r: any) => r.data?.data ?? r.data ?? []),
          contentApi.getBlogs().then((r: any) => r.data?.data ?? r.data ?? []),
        ]);

        const feed: FeedItem[] = [
          ...(Array.isArray(dsa) ? dsa.slice(0, 2) : []).map((q: any) => ({
            key: q._id ?? q.slug,
            href: `${basePath}/dsa/${q.slug}`,
            section: "DSA",
            title: q.title,
            difficulty: q.difficulty,
            platform: q.platform,
          })),
          ...(Array.isArray(sd) ? sd.slice(0, 2) : []).map((q: any) => ({
            key: q._id ?? q.id,
            href: `${basePath}/system-design/${toSlug(q.title)}`,
            section: "System Design",
            title: q.title,
            difficulty: q.difficulty,
          })),
          ...(Array.isArray(mc) ? mc.slice(0, 2) : []).map((q: any) => ({
            key: q._id ?? q.id,
            href: `${basePath}/machine-coding/${toSlug(q.title)}`,
            section: "Machine Coding",
            title: q.title,
            difficulty: q.difficulty,
          })),
          ...(Array.isArray(blogs) ? blogs.slice(0, 2) : []).map((b: any) => ({
            key: b._id ?? b.id,
            href: `${basePath}/blogs/${toSlug(b.title)}`,
            section: "Blog",
            title: b.title,
          })),
        ];

        setCounts({
          dsa: Array.isArray(dsa) ? dsa.length : 0,
          systemDesign: Array.isArray(sd) ? sd.length : 0,
          machineCoding: Array.isArray(mc) ? mc.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
        });
        setRecent(feed.slice(0, 6));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [basePath]);

  const sections = useMemo(
    () => [
      {
        label: "DSA",
        count: counts.dsa,
        description: "Problems solved, auto-synced from DSAForge on GitHub.",
        href: `${basePath}/dsa`,
        icon: Code2,
      },
      {
        label: "System Design",
        count: counts.systemDesign,
        description: "Architectural case studies end to end.",
        href: `${basePath}/system-design`,
        icon: Layers,
      },
      {
        label: "Machine Coding",
        count: counts.machineCoding,
        description: "Frontend components built by hand.",
        href: `${basePath}/machine-coding`,
        icon: Terminal,
      },
      {
        label: "Blogs",
        count: counts.blogs,
        description: "Notes and technical writing.",
        href: `${basePath}/blogs`,
        icon: BookOpen,
      },
      {
        label: "Resources",
        count: null as number | null,
        description: "Handbooks and downloads.",
        href: `${basePath}/resources`,
        icon: FileText,
      },
    ],
    [counts, basePath],
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 max-w-2xl"
        >
          <span className="mb-5 block text-xs font-mono uppercase tracking-[0.3em] text-[#3b82f6]">
            CodeStreak
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            My practice,{" "}
            <span className="font-serif italic text-[#3b82f6]">
              in one place.
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
            Everything I&apos;ve solved, designed and written while prepping —
            DSA auto-synced from GitHub, real system-design and machine-coding
            walkthroughs, and my long-form notes. No fluff, no placeholder
            collections.
          </p>
        </motion.div>

        {/* Overview stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          <Stat label="DSA solved" value={loading ? "…" : counts.dsa} />
          <Stat
            label="System designs"
            value={loading ? "…" : counts.systemDesign}
          />
          <Stat
            label="Machine coding"
            value={loading ? "…" : counts.machineCoding}
          />
          <Stat label="Blog posts" value={loading ? "…" : counts.blogs} />
        </motion.div>

        {/* Section grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
            >
              <Link
                href={s.href}
                className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 hover:border-[#3b82f6]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/5 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  {s.count != null && (
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {s.count}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors">
                    {s.label}
                  </h2>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#3b82f6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                  {s.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recently added */}
        <section>
          <h2 className="mb-6 text-xs font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
            Recently added
          </h2>
          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#3b82f6]" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Nothing here yet — seed some content to get started.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-white/10 border-y border-gray-200 dark:border-white/10">
              {recent.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex items-center gap-4 py-4 hover:px-2 transition-all duration-300"
                >
                  <span className="w-24 shrink-0 text-[10px] font-mono uppercase tracking-widest text-[#3b82f6]">
                    {item.section}
                  </span>
                  <span className="flex-1 text-sm font-light text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors leading-snug flex items-center gap-3">
                    {item.title}
                    <DifficultyBadge difficulty={item.difficulty} />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#3b82f6] transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
