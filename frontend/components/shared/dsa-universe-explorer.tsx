"use client";

import React, { useState, useEffect, useMemo, useDeferredValue } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Compass,
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  BarChart3,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { contentApi } from "@/lib/api";
import { DSA_KNOWLEDGE_MAP, Topic, Pattern } from "@/lib/dsa-map";
import { DSAQuestion } from "@/types";

export function DSAUniverseExplorer({
  isDashboard = false,
}: {
  isDashboard?: boolean;
}) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection state
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(
    null,
  );

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

  // Compute derived state
  const totalQuestions = questions.length;
  const totalPatterns = DSA_KNOWLEDGE_MAP.reduce(
    (acc, topic) => acc + topic.patterns.length,
    0,
  );

  // Normalize pattern strings for matching
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Determine questions for selected pattern
  const selectedTopic = DSA_KNOWLEDGE_MAP.find((t) => t.id === selectedTopicId);
  const selectedPattern = selectedTopic?.patterns.find(
    (p) => p.id === selectedPatternId,
  );

  // Filtered and Search logic
  const displayedQuestions = useMemo(() => {
    let filtered = questions;

    // Apply pattern filter if a pattern is selected
    if (selectedPattern) {
      const patternNameNormalized = normalize(selectedPattern.name);
      filtered = filtered.filter((q) => {
        const qPattern =
          typeof q.pattern === "string" ? q.pattern : q.pattern?.primary || "";
        const lowerQ = qPattern.toLowerCase();
        const lowerP = selectedPattern.name.toLowerCase();
        
        // Special mapping for Array Basics since DB has "Arrays"
        const isArrayBasics = 
          selectedPattern.id === "basics" && 
          selectedTopic?.id === "arrays" && 
          (lowerQ === "arrays" || lowerQ === "array basics");

        return (
          normalize(qPattern) === patternNameNormalized ||
          lowerQ.includes(lowerP) ||
          lowerP.includes(lowerQ) ||
          isArrayBasics
        );
      });
    }

    // Apply global search if present
    if (deferredSearch.trim() !== "") {
      const query = deferredSearch.toLowerCase();
      filtered = filtered.filter((q) => {
        const titleMatch = q.title.toLowerCase().includes(query);
        const companyMatch = q.companies?.some((c: string) =>
          c.toLowerCase().includes(query),
        );
        const qPattern =
          typeof q.pattern === "string" ? q.pattern : q.pattern?.primary || "";
        const patternMatch = qPattern.toLowerCase().includes(query);
        return titleMatch || companyMatch || patternMatch;
      });
    }

    return filtered;
  }, [questions, selectedPattern, deferredSearch]);

  const patternStats = useMemo(() => {
    if (!selectedPattern) return null;
    let easy = 0,
      medium = 0,
      hard = 0;
    displayedQuestions.forEach((q) => {
      if (q.difficulty === "Easy") easy++;
      else if (q.difficulty === "Medium") medium++;
      else if (q.difficulty === "Hard") hard++;
    });
    return { easy, medium, hard, total: displayedQuestions.length };
  }, [displayedQuestions, selectedPattern]);

  const handleTopicClick = (topicId: string) => {
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null);
      setSelectedPatternId(null);
    } else {
      setSelectedTopicId(topicId);
      // Auto-select first pattern
      const topic = DSA_KNOWLEDGE_MAP.find((t) => t.id === topicId);
      if (topic && topic.patterns.length > 0) {
        setSelectedPatternId(topic.patterns[0].id);
      }
    }
    // Clear search when interacting with the map
    if (search) setSearch("");
  };

  const handlePatternClick = (topicId: string, patternId: string) => {
    setSelectedTopicId(topicId);
    setSelectedPatternId(patternId);
    if (search) setSearch("");
  };

  return (
    <>
      {isDashboard && (
        <DashboardNavbar />
      )}

      <div className="flex flex-col flex-1 overflow-hidden dark:bg-[#0a0a0a] bg-gray-50 min-h-screen text-foreground">
        {/* Hero Header */}
        <div className="pt-12 pb-8 px-6 lg:px-10 border-b dark:border-white/5 border-black/5 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
          {/* Subtle background grids/glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight flex items-center gap-3">
              <Compass className="text-primary w-10 h-10" />
              DSA Universe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl font-medium mb-8">
              Explore algorithms, patterns, and interview problems through a
              connected learning map.
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">
                  {totalQuestions}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Problems
                </span>
              </div>
              <div className="w-px h-12 bg-border/50"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">
                  {totalPatterns}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Patterns
                </span>
              </div>
              <div className="w-px h-12 bg-border/50"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">
                  {DSA_KNOWLEDGE_MAP.length}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Topics
                </span>
              </div>
            </div>

            <div className="relative max-w-2xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Search problems, patterns, companies..."
                className="w-full pl-12 pr-4 py-4 bg-background/60 backdrop-blur-md border dark:border-white/10 border-black/10 rounded-2xl text-base outline-none focus:border-primary transition-all shadow-sm focus:shadow-md"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value.trim() !== "") {
                    // Unselect map nodes when searching globally
                    setSelectedTopicId(null);
                    setSelectedPatternId(null);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Learning Path Sidebar (Left) */}
          <div className="w-72 flex-shrink-0 border-r dark:border-white/5 border-black/5 overflow-y-auto bg-background/50 hidden md:block">
            <div className="p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">
                Knowledge Map
              </h3>

              <div className="space-y-1 relative">
                {/* Connecting line background */}
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border/50 z-0"></div>

                {DSA_KNOWLEDGE_MAP.map((topic) => {
                  const isExpanded = selectedTopicId === topic.id;

                  return (
                    <div key={topic.id} className="relative z-10">
                      <button
                        onClick={() => handleTopicClick(topic.id)}
                        className={`w-full flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors text-left ${isExpanded ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
                      >
                        <div
                          className={`w-[6px] h-[6px] rounded-full shrink-0 transition-colors ${isExpanded ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/40"}`}
                        />
                        <span className="font-semibold text-[15px]">
                          {topic.name}
                        </span>
                      </button>

                      {/* Expanded Patterns */}
                      {isExpanded && (
                        <div className="ml-5 pl-4 border-l border-primary/20 my-2 space-y-1 py-1">
                          {topic.patterns.map((pattern) => {
                            const isSelected = selectedPatternId === pattern.id;
                            return (
                              <button
                                key={pattern.id}
                                onClick={() =>
                                  handlePatternClick(topic.id, pattern.id)
                                }
                                className={`w-full text-left py-1.5 px-3 rounded-md text-[13px] font-medium transition-all ${isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                              >
                                {pattern.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Explorer Area (Right) */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : deferredSearch.trim() !== "" ? (
                /* Global Search Results View */
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Search Results for{" "}
                    <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
                      "{deferredSearch}"
                    </span>
                  </h2>
                  <QuestionList
                    questions={displayedQuestions}
                    isDashboard={isDashboard}
                  />
                </div>
              ) : selectedPattern && selectedTopic ? (
                /* Pattern Explorer View */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Pattern Header Card */}
                  <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 mb-3">
                      <span>{selectedTopic.name}</span>
                      <ChevronRight size={14} />
                      <span className="text-primary">
                        {selectedPattern.name}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {selectedPattern.name}
                    </h2>
                    <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-8">
                      {selectedPattern.description}
                    </p>

                    {/* Stats & Meta */}
                    <div className="flex flex-wrap gap-8 pt-6 border-t border-border/50">
                      {/* Difficulty Stats */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                          <BarChart3
                            size={18}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              Easy
                            </span>
                            <span className="text-sm font-mono text-green-500 font-semibold">
                              {patternStats?.easy}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              Medium
                            </span>
                            <span className="text-sm font-mono text-yellow-500 font-semibold">
                              {patternStats?.medium}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              Hard
                            </span>
                            <span className="text-sm font-mono text-red-500 font-semibold">
                              {patternStats?.hard}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Prerequisites */}
                      {selectedPattern.prerequisites &&
                        selectedPattern.prerequisites.length > 0 && (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                              <AlertCircle
                                size={18}
                                className="text-muted-foreground"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                Prerequisites
                              </span>
                              <div className="flex gap-2">
                                {selectedPattern.prerequisites.map((p, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] font-mono bg-background border border-border/80 px-2 py-0.5 rounded-md text-muted-foreground"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Companies */}
                      {selectedPattern.companies &&
                        selectedPattern.companies.length > 0 && (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                              <Users
                                size={18}
                                className="text-muted-foreground"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                Top Companies
                              </span>
                              <div className="flex gap-2">
                                {selectedPattern.companies.map((c, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] font-mono bg-background border border-border/80 px-2 py-0.5 rounded-md text-muted-foreground"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Question List */}
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    Problems{" "}
                    <span className="text-muted-foreground text-sm font-normal">
                      ({displayedQuestions.length})
                    </span>
                  </h3>
                  <QuestionList
                    questions={displayedQuestions}
                    isDashboard={isDashboard}
                  />
                </div>
              ) : (
                /* Empty / Initial State */
                <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <Compass className="text-primary/50 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Explore the Universe
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Select a topic and pattern from the sidebar to begin your
                    structured learning journey. Alternatively, search globally
                    for specific questions or companies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Separate component for rendering the list of question cards
function QuestionList({
  questions,
  isDashboard,
}: {
  questions: DSAQuestion[];
  isDashboard: boolean;
}) {
  if (questions.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center bg-card/20 rounded-2xl border border-border/30 border-dashed">
        <p className="text-muted-foreground">
          No problems found for this criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {questions.map((problem) => {
        const slug = problem.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        return (
          <Link
            key={problem._id}
            href={isDashboard ? `/codestreak/dsa/${slug}` : `/dsa/${slug}`}
            className="block group"
          >
            <div className="bg-card/40 hover:bg-card/80 backdrop-blur-sm border dark:border-white/10 border-black/10 rounded-2xl p-5 transition-all duration-300 hover:shadow-md relative overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="text-primary" size={20} />
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  {problem.status === "solved" ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <Circle
                      size={20}
                      className="text-muted-foreground/30 group-hover:text-primary/40 transition-colors"
                    />
                  )}
                </div>

                <div className="flex-1 pr-12">
                  <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {problem.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Difficulty Badge */}
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        problem.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-500"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    {/* Pattern Badge */}
                    <span className="text-[12px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                      {typeof problem.pattern === "string"
                        ? problem.pattern
                        : problem.pattern?.primary}
                    </span>

                    {/* Company Tags */}
                    {problem.companies && problem.companies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-2">
                        {problem.companies
                          .slice(0, 3)
                          .map((company: string) => (
                            <span
                              key={company}
                              className="text-[10px] px-2 py-0.5 bg-background border border-border/80 text-muted-foreground font-medium whitespace-nowrap rounded"
                            >
                              {company}
                            </span>
                          ))}
                        {problem.companies.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-background border border-border/80 text-muted-foreground font-medium whitespace-nowrap rounded">
                            +{problem.companies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
