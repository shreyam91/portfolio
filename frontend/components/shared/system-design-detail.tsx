"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  Database,
  Layers,
  Server,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import {
  DifficultyBadge,
  EASE,
  SectionLabel,
  TagPill,
} from "@/components/shared/codestreak-ui";
import { toSlug, useCodeStreakBasePath } from "@/lib/codestreak";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "requirements", label: "Requirements" },
  { id: "components", label: "Deep Dive" },
  { id: "flow", label: "HLD Flow" },
  { id: "algorithms", label: "Algorithms" },
  { id: "followups", label: "Follow-ups" },
];

export function SystemDesignDetail({ question }: { question: any }) {
  const basePath = useCodeStreakBasePath();
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 160) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
  };

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 flex flex-col lg:flex-row gap-12">
        {/* Sticky section nav */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-28 flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-left text-sm font-light py-1.5 border-l pl-4 transition-colors ${
                  active === s.id
                    ? "border-[#3b82f6] text-[#3b82f6]"
                    : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 max-w-3xl pb-16">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href={`${basePath}/system-design`}
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All case studies
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="mt-10 mb-10"
          >
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <DifficultyBadge difficulty={question.difficulty} />
              {question.category && (
                <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                  {question.category}
                </TagPill>
              )}
              {question.estimatedTime && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-mono text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3" /> {question.estimatedTime}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
              {question.title}
            </h1>
            {question.description && (
              <p className="mt-5 text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                {question.description}
              </p>
            )}
            {(question.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-6">
                {question.tags.map((tag: string) => (
                  <TagPill key={tag}>{tag}</TagPill>
                ))}
              </div>
            )}
          </motion.div>

          {/* Problem overview */}
          <section id="overview" className="mb-8 scroll-mt-28">
            <Card>
              <SectionLabel>Overview</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(question.functionalRequirements?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-mono text-[#3b82f6] mb-3">
                      Functional Requirements
                    </p>
                    <ul className="space-y-2.5">
                      {question.functionalRequirements.map(
                        (req: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400"
                          >
                            <Check className="w-3.5 h-3.5 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
                            {req}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {(question.nonFunctionalRequirements?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-mono text-[#3b82f6] mb-3">
                      Non-Functional Requirements
                    </p>
                    <ul className="space-y-2.5">
                      {question.nonFunctionalRequirements.map(
                        (req: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400"
                          >
                            <Database className="w-3.5 h-3.5 mt-0.5 text-[#3b82f6] shrink-0" />
                            {req}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Deep dive components */}
          {(question.deepDiveComponents?.length ?? 0) > 0 && (
            <section id="components" className="mb-8 scroll-mt-28">
              <Card>
                <SectionLabel>Deep Dive Components</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.deepDiveComponents.map((comp: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] p-5"
                    >
                      <div className="flex items-center gap-2 mb-2 text-[#3b82f6]">
                        <Server className="w-4 h-4" />
                        <h3 className="text-sm font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc]">
                          {comp.component}
                        </h3>
                      </div>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                        {comp.responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* HLD flow */}
          {(question.highLevelDesign?.length ?? 0) > 0 && (
            <section id="flow" className="mb-8 scroll-mt-28">
              <Card>
                <SectionLabel>High Level Design Flow</SectionLabel>
                <div className="space-y-4">
                  {question.highLevelDesign.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border border-[#3b82f6]/40 text-[#3b82f6] flex items-center justify-center font-mono text-xs shrink-0">
                          {i + 1}
                        </div>
                        {i < question.highLevelDesign.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 dark:bg-white/10 my-1" />
                        )}
                      </div>
                      <p className="flex-1 text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed pt-2">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Algorithms & trade-offs */}
          {(question.coreAlgorithms?.length ?? 0) > 0 && (
            <section id="algorithms" className="mb-8 scroll-mt-28">
              <SectionLabel>Algorithms &amp; Trade-offs</SectionLabel>
              <div className="space-y-4">
                {question.coreAlgorithms.map((algo: any, i: number) => (
                  <Card key={i}>
                    <h3 className="flex items-center gap-2 text-sm font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] mb-4">
                      <Layers className="w-4 h-4 text-[#3b82f6]" />
                      {algo.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {(algo.pros?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-mono text-green-600 dark:text-green-400 mb-2">
                            Pros
                          </p>
                          <ul className="space-y-1.5">
                            {algo.pros.map((p: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400"
                              >
                                <Check className="w-3.5 h-3.5 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(algo.cons?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-2">
                            Cons
                          </p>
                          <ul className="space-y-1.5">
                            {algo.cons.map((c: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400"
                              >
                                <X className="w-3.5 h-3.5 mt-0.5 text-red-600 dark:text-red-400 shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Follow-up questions */}
          {(question.followUpQuestions?.length ?? 0) > 0 && (
            <section id="followups" className="mb-8 scroll-mt-28">
              <Card>
                <SectionLabel>Follow-up Questions</SectionLabel>
                <div className="space-y-3">
                  {question.followUpQuestions.map((q: string, i: number) => (
                    <p
                      key={i}
                      className="text-sm font-light text-gray-600 dark:text-gray-400 border-l-2 border-[#3b82f6]/40 pl-4"
                    >
                      {q}
                    </p>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Skip-to-slug link for convenience */}
          <p className="mt-6 text-xs font-mono text-gray-400 dark:text-gray-600">
            slug / {toSlug(question.title)}
          </p>
        </div>
      </div>
    </div>
  );
}
