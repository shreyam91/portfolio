"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Github,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { CopyButton } from "@/components/shared/codestreak-ui";
import { contentApi } from "@/lib/api";
import {
  buildGithubUrl,
  formatConstraints,
  formatInputFormat,
  parseDescription,
  platformLabel,
  statusLabel,
  stripHtml,
  viewProblemLabel,
} from "@/lib/dsaForge";
import type { DSAQuestion } from "@/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const difficultyClass: Record<string, string> = {
  Easy: "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5",
  Medium:
    "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5",
  Hard: "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5",
};

function FormattedTime({ iso }: { iso?: string }) {
  const label = useMemo(() => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [iso]);
  return label === null ? null : label;
}

export function DSAProblemDetail({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const problem = useMemo(
    () => questions.find((q) => q.slug === slug),
    [questions, slug],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <CodeStreakNav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <CodeStreakNav />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-base font-light text-gray-500 dark:text-gray-400">
            Problem not found.
          </p>
          <Link
            href="/codestreak/dsa"
            className="inline-block mt-4 text-sm font-mono text-[#3b82f6] hover:underline"
          >
            ← All problems
          </Link>
        </div>
      </div>
    );
  }

  const sub = problem.submission ?? {};
  // GFG data is stored structured (description = statement only); LeetCode
  // embeds statement + examples + constraints in one HTML description, so we
  // parse it apart so each renders as its own section.
  const isStructured = Array.isArray(problem.examples) && problem.examples.length > 0;
  const parsed = parseDescription(problem.description);
  const statement = isStructured
    ? problem.description
      ? stripHtml(problem.description)
      : ""
    : parsed.statement;
  const examples = (isStructured ? problem.examples : parsed.examples) as Array<{
    input?: string;
    output?: string;
    explanation?: string;
  }>;
  const constraintsLines = Array.isArray(problem.constraints)
    ? formatConstraints(problem.constraints)
    : parsed.constraints;
  const inputFormatLines = formatInputFormat(problem.inputFormat);
  const githubUrl = buildGithubUrl({
    githubPath: sub.githubPath,
    slug: problem.slug,
    language: sub.language,
  });
  const diff = problem.difficulty ? difficultyClass[problem.difficulty] : null;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 block mb-4">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/codestreak/dsa"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All problems
          </Link>
        </motion.div>

        {/* Problem block */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="mt-10"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3b82f6] border border-[#3b82f6]/30 rounded-full px-2.5 py-0.5">
              {platformLabel(problem.platform)}
            </span>
            {diff && (
              <span
                className={`text-[10px] font-mono uppercase tracking-widest rounded-full px-2.5 py-0.5 border ${diff}`}
              >
                {problem.difficulty}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight max-w-3xl">
            {problem.title}
          </h1>

          {problem.problemUrl && (
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-mono text-[#3b82f6] hover:underline"
            >
              {viewProblemLabel(problem.platform)}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Description */}
          {statement && (
            <div className="mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
              <SectionLabel>Problem</SectionLabel>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {statement}
              </p>
            </div>
          )}

          {/* Examples */}
          {examples.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
              <SectionLabel>Examples</SectionLabel>
              <div className="space-y-6">
                {examples.map((ex, i) => (
                  <div key={`${ex.input}-${ex.output}-${i}`}>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
                      Example {i + 1}
                    </p>
                    {ex.input != null && (
                      <div className="mb-2">
                        <span className="text-xs font-mono text-[#3b82f6]">
                          Input:
                        </span>
                        <div className="relative mt-1">
                          <pre className="overflow-x-auto rounded-lg bg-[#0f0f0f] dark:bg-black/40 text-gray-100 text-xs p-3">
                            {String(ex.input)}
                          </pre>
                          <CopyButton text={String(ex.input)} className="absolute right-2 top-2 bg-[#1a1a1a]/80 hover:bg-[#222]" />
                        </div>
                      </div>
                    )}
                    {ex.output != null && (
                      <div className="mb-2">
                        <span className="text-xs font-mono text-[#3b82f6]">
                          Output:
                        </span>
                        <div className="relative mt-1">
                          <pre className="overflow-x-auto rounded-lg bg-[#0f0f0f] dark:bg-black/40 text-gray-100 text-xs p-3">
                            {String(ex.output)}
                          </pre>
                          <CopyButton text={String(ex.output)} className="absolute right-2 top-2 bg-[#1a1a1a]/80 hover:bg-[#222]" />
                        </div>
                      </div>
                    )}
                    {ex.explanation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                        <span className="font-mono text-xs text-gray-400 mr-2">
                          Explanation:
                        </span>
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input format / constraints / expected complexity */}
          {(inputFormatLines.length > 0 ||
            constraintsLines.length > 0 ||
            problem.expectedTimeComplexity ||
            problem.expectedAuxiliarySpace) && (
            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
              <SectionLabel>Format &amp; Complexity</SectionLabel>
              <div className="space-y-6">
                {inputFormatLines.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
                      Input Format
                    </p>
                    <ul className="space-y-1">
                      {inputFormatLines.map((line) => (
                        <li
                          key={line}
                          className="text-sm font-mono text-gray-600 dark:text-gray-400"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {constraintsLines.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
                      Constraints
                    </p>
                    <ul className="space-y-1 list-inside">
                      {constraintsLines.map((line) => (
                        <li
                          key={line}
                          className="text-sm text-gray-600 dark:text-gray-400 font-light"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(problem.expectedTimeComplexity ||
                  problem.expectedAuxiliarySpace) && (
                  <div>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
                      Expected Complexity
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {problem.expectedTimeComplexity && (
                        <span className="text-[11px] font-mono border border-gray-200 dark:border-white/10 rounded-full px-2.5 py-1 text-gray-600 dark:text-gray-400">
                          Time · {problem.expectedTimeComplexity}
                        </span>
                      )}
                      {problem.expectedAuxiliarySpace && (
                        <span className="text-[11px] font-mono border border-gray-200 dark:border-white/10 rounded-full px-2.5 py-1 text-gray-600 dark:text-gray-400">
                          Auxiliary Space · {problem.expectedAuxiliarySpace}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {(problem.topics.length > 0 ||
            (problem.companies?.length ?? 0) > 0) && (
            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
              {(problem.topics.length > 0 ||
                (problem.companies?.length ?? 0) > 0) && (
                <div className="space-y-5">
                  {problem.topics.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-3">
                        Topics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {problem.topics.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono border border-[#3b82f6]/30 text-[#3b82f6] rounded-full px-2.5 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {problem.companies && problem.companies.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-3">
                        Companies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((c) => (
                          <span
                            key={c}
                            className="text-[11px] font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full px-2.5 py-1"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* My Solution block */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-16"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-[#3b82f6]" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                My Solution
              </span>
            </div>
            {(sub.status != null || sub.runtime != null) && (
              <div className="flex items-center gap-3 flex-wrap">
                {sub.status != null && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {statusLabel(sub.status)}
                  </span>
                )}
                {sub.runtime != null && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {String(sub.runtime)}
                    {typeof sub.runtime === "number" ? " s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mb-4 text-sm font-mono text-[#3b82f6] hover:underline"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {sub.submittedAt && (
            <p className="text-xs font-light text-gray-400 dark:text-gray-500 mb-4">
              Submitted <FormattedTime iso={sub.submittedAt} />
            </p>
          )}

          {sub.code ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-[#0f0f0f]">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/20 border-b border-white/5">
                <span className="w-2 h-2 rounded-full bg-red-400/70" />
                <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                <span className="w-2 h-2 rounded-full bg-green-400/70" />
                <span className="ml-3 text-[11px] font-mono text-gray-400">
                  {sub.language || "Code"}
                </span>
                <div className="ml-auto">
                  <CopyButton text={sub.code} />
                </div>
              </div>
              <pre className="overflow-x-auto p-6 text-xs md:text-sm leading-relaxed text-gray-100 font-mono">
                <code>{sub.code}</code>
              </pre>
            </div>
          ) : (
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              No solution code saved for this problem.
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}
