"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock,
  Code2,
  ExternalLink,
  FileCode2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import {
  DifficultyBadge,
  EASE,
  SectionLabel,
  TagPill,
} from "@/components/shared/codestreak-ui";
import { toSlug, useCodeStreakBasePath } from "@/lib/codestreak";

export function MachineCodingDetail({ challenge }: { challenge: any }) {
  const basePath = useCodeStreakBasePath();

  const Card = ({ children }: { children: ReactNode }) => (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
      {children}
    </div>
  );

  const CheckList = ({ items }: { items?: string[] }) => {
    if (!items || items.length === 0) return null;
    return (
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            <Check className="w-3.5 h-3.5 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href={`${basePath}/machine-coding`}
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All challenges
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
            <DifficultyBadge difficulty={challenge.difficulty} />
            {challenge.category && (
              <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                {challenge.category}
              </TagPill>
            )}
            {challenge.estimatedTime && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-mono text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" /> {challenge.estimatedTime}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            {challenge.title}
          </h1>
          {challenge.description && (
            <p className="mt-5 text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
              {challenge.description}
            </p>
          )}
          {(challenge.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-6">
              {challenge.tags.map((tag: string) => (
                <TagPill key={tag}>{tag}</TagPill>
              ))}
            </div>
          )}
          {challenge.githubSolution && (
            <a
              href={challenge.githubSolution}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-mono text-[#3b82f6] hover:underline"
            >
              <Code2 className="w-4 h-4" />
              View my solution
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </motion.div>

        {/* Requirements */}
        {(challenge.requirements?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Requirements</SectionLabel>
              <CheckList items={challenge.requirements} />
              {challenge.bonusRequirements?.length > 0 && (
                <div className="mt-5 border-t border-gray-200 dark:border-white/10 pt-5">
                  <p className="text-xs font-mono text-[#3b82f6] mb-3">Bonus</p>
                  <CheckList items={challenge.bonusRequirements} />
                </div>
              )}
            </Card>
          </section>
        )}

        {/* Component structure */}
        {(challenge.componentStructure?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Component Structure</SectionLabel>
              <div className="flex items-center gap-2 text-[#3b82f6] mb-3">
                <FileCode2 className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">
                  Recommended structure
                </span>
              </div>
              <div className="rounded-xl bg-[#0f0f0f] border border-white/10 p-5 overflow-x-auto">
                <div className="text-xs font-mono leading-relaxed text-gray-100 whitespace-pre">
                  {challenge.componentStructure
                    .map((c: string) => `  <${c} />\n`)
                    .join("")}
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Expected concepts */}
        {(challenge.expectedConcepts?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Engineering Concepts</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {challenge.expectedConcepts.map((c: string) => (
                  <TagPill
                    key={c}
                    className="text-[#3b82f6] border-[#3b82f6]/30"
                  >
                    {c}
                  </TagPill>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Edge cases */}
        {(challenge.edgeCases?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Edge Cases</SectionLabel>
              <CheckList items={challenge.edgeCases} />
            </Card>
          </section>
        )}

        {/* Common mistakes */}
        {(challenge.commonMistakes?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Common Mistakes</SectionLabel>
              <ul className="space-y-2.5">
                {challenge.commonMistakes.map((m: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed"
                  >
                    <X className="w-3.5 h-3.5 mt-0.5 text-red-600 dark:text-red-400 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* Evaluation criteria */}
        {(challenge.evaluationCriteria?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>What Interviewers Look For</SectionLabel>
              <CheckList items={challenge.evaluationCriteria} />
            </Card>
          </section>
        )}

        {/* Follow-up questions */}
        {(challenge.followUpQuestions?.length ?? 0) > 0 && (
          <section className="mb-6">
            <Card>
              <SectionLabel>Follow-up Questions</SectionLabel>
              <div className="space-y-3">
                {challenge.followUpQuestions.map((q: string, i: number) => (
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

        {challenge.githubSolution && (
          <a
            href={challenge.githubSolution}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-mono text-[#3b82f6] hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open solution in the Machine-coding repo
          </a>
        )}

        <p className="mt-6 text-xs font-mono text-gray-400 dark:text-gray-600">
          slug / {toSlug(challenge.title)}
        </p>
      </div>
    </div>
  );
}
