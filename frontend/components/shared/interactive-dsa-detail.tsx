"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lightbulb,
  Clock,
  Database,
  Building2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Check,
} from "lucide-react";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

import { AnimatedCodeEditor } from "./animated-code-editor";
import { motion } from "framer-motion";

export function InteractiveDSADetail({
  isDashboard = false,
}: {
  isDashboard?: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id ? parseInt(params.id as string) : 1;
  const [activeId, setActiveId] = useState(idParam);

  // States
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>(
    {},
  );
  const [activeApproachIdx, setActiveApproachIdx] = useState(0);

  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      setActiveId(parseInt(params.id as string));
    }
  }, [params.id]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);
        const { contentApi } = await import("@/lib/api");

        const res = await contentApi.getDsaQuestions();
        const data = res.data?.data || [];

        const found = data.find((q: any) => {
          if (q._id === params.id) return true;
          const slug = q.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
          return slug === params.id;
        });

        const activeQ = found || data[0];
        setActiveQuestion(activeQ);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestion();
  }, [params.id]);

  useEffect(() => {
    setActiveApproachIdx(0);
  }, [activeId]);

  const activeApproach = activeQuestion?.approaches?.[activeApproachIdx] || {
    name: "",
    code: "",
  };

  const toggleHint = (index: number) =>
    setExpandedHints((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleNote = (index: number) =>
    setExpandedNotes((prev) => ({ ...prev, [index]: !prev[index] }));

  if (isLoading || !activeQuestion) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans">
      {/* Header */}
      {isDashboard && (
        <header className="bg-background/80 backdrop-blur-md sticky top-0 flex h-16 shrink-0 items-center border-b border-border/50 px-4 justify-between z-20 shadow-sm">
          <div className="flex items-center gap-4">
            
            <div className="h-4 w-px bg-border"></div>
            <button
              onClick={() => router.push("/codestreak/dsa")}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <ArrowLeft size={16} />
              Back to List
            </button>
            <div className="h-4 w-px bg-border"></div>
            <h2 className="font-bold hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {activeQuestion.title}
            </h2>
          </div>
        </header>
      )}

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-dot-pattern">
        {/* Left Panel: Problem Context (Sticky/Scrollable) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border/50 bg-background/60 backdrop-blur-3xl relative min-h-0"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="max-w-2xl mx-auto">
            {/* Title & Badges */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {activeQuestion.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                    activeQuestion.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : activeQuestion.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {activeQuestion.difficulty}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground border border-border shadow-sm">
                  {typeof activeQuestion.pattern === "string"
                    ? activeQuestion.pattern
                    : activeQuestion.pattern?.primary}
                </span>

                {activeQuestion.leetcodeLink && (
                  <a
                    href={activeQuestion.leetcodeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition-transform ml-1"
                  >
                    <SiLeetcode className="w-6 h-6 text-[#FFA116]" />
                  </a>
                )}
                {activeQuestion.geeksforgeeksLink && (
                  <a
                    href={activeQuestion.geeksforgeeksLink}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition-transform ml-1"
                  >
                    <SiGeeksforgeeks className="w-6 h-6 text-[#2F8D46]" />
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed mb-8">
              <div className="whitespace-pre-line text-[15px]">
                {activeQuestion.description}
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-foreground/90">
                  <div className="w-8 h-[2px] bg-primary/40 rounded-full"></div>
                  Examples
                </h3>
                <div className="space-y-6">
                  {Array.isArray(activeQuestion.examples) ? (
                    activeQuestion.examples.map((ex: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/60 shadow-sm relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-primary/20 group-hover:w-2 transition-all"></div>
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                          <span className="text-xs font-mono font-semibold text-muted-foreground ml-2 tracking-wider uppercase">
                            Example {idx + 1}
                          </span>
                        </div>
                        <div className="mb-4 font-mono text-[14.5px]">
                          <span className="text-primary/70 font-semibold select-none mr-3">
                            ❯ Input:
                          </span>
                          <span className="text-foreground/90 leading-relaxed">
                            {ex.input}
                          </span>
                        </div>
                        <div className="mb-2 font-mono text-[14.5px]">
                          <span className="text-primary/70 font-semibold select-none mr-3">
                            ❯ Output:
                          </span>
                          <span className="text-foreground font-bold bg-primary/10 px-2 py-0.5 rounded">
                            {ex.output}
                          </span>
                        </div>
                        {ex.explanation && (
                          <div className="text-muted-foreground mt-5 pt-4 border-t border-border/50 text-[14.5px] leading-relaxed flex items-start gap-3">
                            <span className="font-semibold text-primary/60 shrink-0 mt-0.5">
                              Explanation:
                            </span>
                            <span>{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-muted/40 p-4 rounded-xl border border-border/50 font-mono text-sm whitespace-pre-line">
                      {activeQuestion.examples}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-foreground/90">
                  <div className="w-8 h-[2px] bg-primary/40 rounded-full"></div>
                  Constraints
                </h3>
                <div className="flex flex-wrap gap-3">
                  {activeQuestion.constraints?.map((c: string, i: number) => (
                    <code
                      key={i}
                      className="bg-secondary/40 text-secondary-foreground px-3.5 py-2 rounded-xl border border-border/50 text-[13px] font-mono shadow-sm flex items-center gap-2.5 transition-colors hover:bg-secondary/60"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            {/* Complexity */}
            {activeQuestion.complexityBreakdown && (
              <div className="mb-12 mt-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3">
                  <span>Complexity Breakdown</span>
                  <div className="h-px flex-1 bg-border/50"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeQuestion.complexityBreakdown.optimal && (
                    <div className="relative p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl overflow-hidden group hover:border-emerald-500/40 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock
                          size={80}
                          className="text-emerald-500 -mr-4 -mt-4"
                        />
                      </div>
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          <BrainCircuit size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                          Optimal
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                        <div className="bg-background/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/10 shadow-sm">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 mb-1.5">
                            Time
                          </span>
                          <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-300">
                            {
                              activeQuestion.complexityBreakdown.optimal
                                .timeComplexity
                            }
                          </span>
                        </div>
                        <div className="bg-background/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/10 shadow-sm">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 mb-1.5">
                            Space
                          </span>
                          <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-300">
                            {
                              activeQuestion.complexityBreakdown.optimal
                                .spaceComplexity
                            }
                          </span>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-emerald-900/70 dark:text-emerald-100/60 leading-relaxed relative z-10 font-medium">
                        {activeQuestion.complexityBreakdown.optimal.reason}
                      </p>
                    </div>
                  )}
                  {activeQuestion.complexityBreakdown.bruteForce && (
                    <div className="relative p-6 bg-secondary/20 border border-border/60 rounded-3xl overflow-hidden group hover:border-border transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Database
                          size={80}
                          className="text-foreground -mr-4 -mt-4"
                        />
                      </div>
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border/50 text-muted-foreground shadow-sm">
                          <Clock size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          Brute Force
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                        <div className="bg-background/60 backdrop-blur-md p-4 rounded-2xl border border-border/40 shadow-sm">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Time
                          </span>
                          <span className="font-mono font-bold text-lg text-foreground/80">
                            {
                              activeQuestion.complexityBreakdown.bruteForce
                                .timeComplexity
                            }
                          </span>
                        </div>
                        <div className="bg-background/60 backdrop-blur-md p-4 rounded-2xl border border-border/40 shadow-sm">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Space
                          </span>
                          <span className="font-mono font-bold text-lg text-foreground/80">
                            {
                              activeQuestion.complexityBreakdown.bruteForce
                                .spaceComplexity
                            }
                          </span>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed relative z-10 font-medium">
                        {activeQuestion.complexityBreakdown.bruteForce.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intuition Section */}
            {activeQuestion.intuition && (
              <div className="mb-8 p-6 bg-gradient-to-r from-card to-transparent border-l-4 border-l-primary border-y border-r border-border/50 rounded-r-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] pointer-events-none transition-opacity">
                  <BrainCircuit size={120} />
                </div>
                <h3 className="text-sm font-bold flex items-center gap-3 text-foreground mb-4 uppercase tracking-widest relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <BrainCircuit size={16} />
                  </div>
                  Intuition
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed relative z-10">
                  {activeQuestion.intuition}
                </p>
              </div>
            )}

            {/* Edge Cases & Pitfalls */}
            {(activeQuestion.edgeCases || activeQuestion.pitfalls) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {activeQuestion.edgeCases && (
                  <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h3 className="text-sm font-bold flex items-center gap-2.5 text-orange-600 dark:text-orange-400 mb-4 uppercase tracking-widest">
                      <AlertTriangle size={16} /> Edge Cases
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      {activeQuestion.edgeCases.map((edge: any, i: number) => (
                        <li key={i} className="text-[14px]">
                          <div className="inline-block font-mono text-xs font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md mb-1.5 border border-orange-500/20">
                            {edge.case}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {edge.reason}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeQuestion.pitfalls && (
                  <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h3 className="text-sm font-bold flex items-center gap-2.5 text-red-600 dark:text-red-400 mb-4 uppercase tracking-widest">
                      <ShieldAlert size={16} /> Common Pitfalls
                    </h3>
                    <ul className="space-y-2.5 text-[14px] text-muted-foreground relative z-10">
                      {activeQuestion.pitfalls.map(
                        (pitfall: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 shrink-0"></div>
                            <span className="leading-relaxed">{pitfall}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Follow Up Questions */}
            {activeQuestion.followUpQuestions && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60 group-hover:bg-primary transition-colors"></div>
                <h3 className="text-sm font-bold flex items-center gap-2.5 text-primary mb-4 uppercase tracking-widest">
                  <HelpCircle size={16} /> Follow-up Questions
                </h3>
                <ul className="space-y-3 text-[14px] text-foreground/80">
                  {activeQuestion.followUpQuestions.map(
                    (q: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 bg-background/50 p-3 rounded-xl border border-border/50"
                      >
                        <span className="text-primary font-bold mt-0.5 opacity-60">
                          Q.
                        </span>
                        <span className="leading-relaxed">{q}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* Pattern Explanation */}
            {activeQuestion.patternExplanation && (
              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 mb-10 relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="font-bold text-primary tracking-wide text-lg">
                    {activeQuestion.patternExplanation.name}
                  </h3>
                </div>
                <p className="text-[14.5px] text-foreground/90 mb-4 font-medium leading-relaxed bg-background/40 p-4 rounded-xl border border-primary/10">
                  {activeQuestion.patternExplanation.coreIdea}
                </p>
                {activeQuestion.patternExplanation.whenToUse && (
                  <div className="mt-5 pt-4 border-t border-primary/15 relative z-10">
                    <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-3">
                      When to use:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeQuestion.patternExplanation.whenToUse.map(
                        (w: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] text-muted-foreground bg-background/40 p-2.5 rounded-lg border border-primary/10"
                          >
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <span className="leading-relaxed">{w}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Companies */}
            {activeQuestion.companies &&
              activeQuestion.companies.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xs font-black flex items-center gap-2 text-muted-foreground mb-4 uppercase tracking-widest">
                    <Building2 size={16} className="text-muted-foreground/70" />
                    Asked by Top Companies
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {activeQuestion.companies.map(
                      (company: string, i: number) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-secondary/30 backdrop-blur-sm border border-border/60 text-[13px] font-semibold rounded-xl shadow-sm hover:border-primary/40 hover:bg-secondary/50 transition-colors cursor-default"
                        >
                          {company}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Hints Section */}
            {activeQuestion.hints && activeQuestion.hints.length > 0 && (
              <div className="space-y-3 mb-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                  Need Help?
                </h3>
                {activeQuestion.hints.map((hint: string, i: number) => (
                  <div
                    key={i}
                    className={`border rounded-2xl overflow-hidden transition-colors ${expandedHints[i] ? "bg-card border-yellow-500/30 shadow-sm" : "bg-card/40 border-border/60 hover:border-border"}`}
                  >
                    <button
                      onClick={() => toggleHint(i)}
                      className="w-full flex items-center justify-between p-4 text-[14.5px] font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${expandedHints[i] ? "bg-yellow-500/15" : "bg-muted"}`}
                        >
                          <Lightbulb
                            size={16}
                            className={
                              expandedHints[i]
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }
                          />
                        </div>
                        <span
                          className={
                            expandedHints[i]
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          Hint {i + 1}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${expandedHints[i] ? "bg-yellow-500/10" : "bg-muted"}`}
                      >
                        {expandedHints[i] ? (
                          <ChevronUp
                            size={14}
                            className="text-yellow-600 dark:text-yellow-500"
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </button>
                    {expandedHints[i] && (
                      <div className="p-5 pt-1 text-[14px] text-muted-foreground leading-relaxed">
                        <div className="pl-11">{hint}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* My Notes */}
            {activeQuestion.notes && activeQuestion.notes.length > 0 && (
              <div className="space-y-3 mb-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <span className="text-primary text-base leading-none">
                    📝
                  </span>{" "}
                  My Notes
                </h3>
                {activeQuestion.notes.map(
                  (note: { title: string; description: string }, i: number) => (
                    <div
                      key={i}
                      className={`border rounded-2xl overflow-hidden transition-colors ${expandedNotes[i] ? "bg-card border-primary/30 shadow-sm" : "bg-card/40 border-border/60 hover:border-border"}`}
                    >
                      <button
                        onClick={() => toggleNote(i)}
                        className="w-full flex items-center justify-between p-4 text-[14.5px] font-semibold transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${expandedNotes[i] ? "bg-primary/15" : "bg-muted"}`}
                          >
                            <span className="text-primary font-serif italic text-lg leading-none">
                              N
                            </span>
                          </div>
                          <span
                            className={
                              expandedNotes[i]
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {note.title}
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${expandedNotes[i] ? "bg-primary/10" : "bg-muted"}`}
                        >
                          {expandedNotes[i] ? (
                            <ChevronUp size={14} className="text-primary" />
                          ) : (
                            <ChevronDown
                              size={14}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                      </button>
                      {expandedNotes[i] && (
                        <div className="p-5 pt-1 text-[14px] text-muted-foreground leading-relaxed">
                          <div className="pl-11">{note.description}</div>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="pb-10"></div>
          </div>
        </motion.div>

        {/* Right Panel: Interactive Editor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="p-4 lg:p-6 bg-zinc-950 flex flex-col h-[50vh] lg:h-auto lg:flex-1 relative min-w-0 min-h-0"
        >
          {/* subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="flex-1 w-full max-w-4xl mx-auto relative z-10 flex flex-col min-h-0 min-w-0">
            {/* Approach Selector */}
            {activeQuestion.approaches &&
              activeQuestion.approaches.length > 1 && (
                <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
                  {activeQuestion.approaches.map(
                    (approach: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveApproachIdx(idx)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
                          idx === activeApproachIdx
                            ? "bg-zinc-800 border-zinc-700 text-white"
                            : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                      >
                        {approach.name}
                      </button>
                    ),
                  )}
                </div>
              )}

            <AnimatedCodeEditor
              key={activeApproachIdx}
              code={(activeApproach.code || "// No code available").replace(
                /\\n/g,
                "\n",
              )}
              language="java"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
