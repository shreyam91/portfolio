'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";

import Editor from "@monaco-editor/react";
import { ArrowLeft, Lightbulb, Clock, Database, Building2, ChevronDown, ChevronUp, Check, Copy, ExternalLink, CalendarDays, BrainCircuit, AlertTriangle, ShieldAlert, HelpCircle } from "lucide-react";
import { LockOverlay } from "@/components/lock-overlay";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
// import { ExternalLink } from "lucide-react";

import { contentApi } from "@/lib/api";
import { toast } from "sonner";

export function DSADetail({ isDashboard = false }: { isDashboard?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id ? parseInt(params.id as string) : 1;
  const [activeId, setActiveId] = useState(idParam);
  
  // States
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [activeApproachIdx, setActiveApproachIdx] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
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
        const { contentApi, submissionsApi } = await import('@/lib/api');
        
        const [res, submissionsRes] = await Promise.all([
          contentApi.getDsaQuestions(),
          submissionsApi.getUserSubmissions().catch(() => ({ data: [] }))
        ]);

        const data = res.data?.data || [];
        const submissions = submissionsRes.data?.data || [];
        
        const found = data.find((q: any) => {
          if (q._id === params.id) return true;
          const slug = q.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return slug === params.id;
        });
        
        const activeQ = found || data[0];
        setActiveQuestion(activeQ);
        
        // Check if this question is completed
        if (activeQ) {
          const problemId = activeQ._id || activeQ.id;
          const completed = submissions.some((sub: any) => sub.problemId === problemId?.toString());
          setIsCompleted(completed);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestion();
  }, [params.id]);

  // Ensure we don't crash if approaches are missing or changed when switching questions
  useEffect(() => {
    setActiveApproachIdx(0);
  }, [activeId]);

  const activeApproach = activeQuestion?.approaches?.[activeApproachIdx] || { name: "", code: "" };

  const toggleHint = (index: number) => {
    setExpandedHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleNote = (index: number) => {
    setExpandedNotes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCopy = () => {
    if (activeApproach.code) {
      navigator.clipboard.writeText(activeApproach.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      setSubmitting(true);
      toast.loading('Marking as completed...', { id: 'mark-completed' });
      const { default: api } = await import('@/lib/api');
      await api.post('/submissions', {
        problemId: activeQuestion._id || activeQuestion.id,
        category: 'DSA',
        difficulty: activeQuestion.difficulty || 'Medium'
      });
      toast.success('Marked as completed successfully!', { id: 'mark-completed' });
      setIsCompleted(true);
    } catch (error) {
      toast.error('Failed to mark as completed. Please try again.', { id: 'mark-completed' });
    } finally {
      setSubmitting(false);
    }
  };

  
  const layoutWrapper = (children: React.ReactNode) => {
    if (!isDashboard) {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <PublicNavbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <PublicFooter />
        </div>
      );
    }
    
    // Dashboard layout - Header and wrapper
    return (
      <div className="h-full w-full">
        {children}
      </div>
    );
  };

  if (isLoading || !activeQuestion) {
    return layoutWrapper(
      <div className="py-20 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return layoutWrapper(
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        {isDashboard && (
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border"></div>
            <button 
              onClick={() => router.push('/dashboard/dsa')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <ArrowLeft size={16} />
              Problem List
            </button>
            <div className="h-4 w-px bg-border"></div>
            <h2 className="font-bold hidden sm:block">{activeQuestion.title}</h2>
          </div>
          <div className="flex gap-3">
            {/* <button 
              onClick={handleMarkCompleted}
              disabled={submitting || isCompleted}
              className={`px-4 py-1.5 text-white rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 ${
                isCompleted 
                  ? 'bg-zinc-700 hover:bg-zinc-700 cursor-not-allowed opacity-80' 
                  : 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
              }`}
            >
              {isCompleted && <Check size={16} />}
              {isCompleted ? 'Completed' : submitting ? 'Marking...' : 'Mark Completed'}
            </button> */}
          </div>
        </header>
      )}

        <div className="flex-1 overflow-y-auto bg-background">
          <div className="w-full max-w-4xl mx-auto flex flex-col">
            <div className=" lg:p-2">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-4">{activeQuestion.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={"text-xs font-semibold px-2.5 py-1 rounded-md " + (
                      activeQuestion.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      activeQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                      'bg-red-500/10 text-red-600 dark:text-red-400'
                    )}>
                      {activeQuestion.difficulty}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                      {typeof activeQuestion.pattern === 'string' ? activeQuestion.pattern : activeQuestion.pattern?.primary}
                    </span>
                    {activeQuestion.leetcodeLink && (
                      <a
                        href={activeQuestion.leetcodeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-2"
                      >
                        <SiLeetcode className="w-8 h-8 mr-1 text-[#FFA116]" />
                        {/* <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" /> */}
                      </a>
                    )}

                    {activeQuestion.geeksforgeeksLink && (
                      <a
                        href={activeQuestion.geeksforgeeksLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-2"
                      >
                        <SiGeeksforgeeks className="w-8 h-8 mr-1 text-[#2F8D46]" />
                        {/* <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" /> */}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Interview Estimates */}
              {activeQuestion.interviewEstimate && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-muted/30 border border-border p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected</p>
                    <p className="text-lg font-bold">{activeQuestion.interviewEstimate.expectedTimeMinutes}m</p>
                  </div>
                  <div className="bg-muted/30 border border-border p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Thinking</p>
                    <p className="text-lg font-bold">{activeQuestion.interviewEstimate.thinkingTimeMinutes}m</p>
                  </div>
                  <div className="bg-muted/30 border border-border p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Coding</p>
                    <p className="text-lg font-bold">{activeQuestion.interviewEstimate.codingTimeMinutes}m</p>
                  </div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed mb-8 mt-6">
                <div className="whitespace-pre-line text-foreground/90 text-base">{activeQuestion.description}</div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">Example:</h3>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border font-mono text-sm whitespace-pre-line text-foreground/80 shadow-inner">
                    {Array.isArray(activeQuestion.examples) ? (
                      activeQuestion.examples.map((ex: any, idx: number) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <div><span className="font-bold">Input:</span> {ex.input}</div>
                          <div><span className="font-bold">Output:</span> {ex.output}</div>
                          {ex.explanation && <div><span className="font-bold">Explanation:</span> {ex.explanation}</div>}
                        </div>
                      ))
                    ) : (
                      activeQuestion.examples
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">Constraints:</h3>
                  <ul className="list-none space-y-2">
                    {activeQuestion.constraints?.map((c: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                        <code className="bg-muted px-2 py-0.5 rounded-md text-foreground/80">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Intuition Section */}
              {activeQuestion.intuition && (
                <div className="mb-8 p-5 bg-card border border-border rounded-xl shadow-sm">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-foreground mb-3">
                    <BrainCircuit size={16} className="text-primary" />
                    Intuition
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeQuestion.intuition}
                  </p>
                </div>
              )}

              {/* Complexity Section */}
              {activeQuestion.complexityBreakdown && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Complexity Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeQuestion.complexityBreakdown.optimal && (
                      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl shadow-sm">
                        <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">Optimal Approach</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Clock size={14} className="text-green-500"/> Time</span>
                            <span className="font-mono font-medium">{activeQuestion.complexityBreakdown.optimal.timeComplexity}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Database size={14} className="text-green-500"/> Space</span>
                            <span className="font-mono font-medium">{activeQuestion.complexityBreakdown.optimal.spaceComplexity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pt-2 border-t border-green-500/10">
                            {activeQuestion.complexityBreakdown.optimal.reason}
                          </p>
                        </div>
                      </div>
                    )}
                    {activeQuestion.complexityBreakdown.bruteForce && (
                      <div className="p-4 bg-muted/20 border border-border rounded-xl shadow-sm">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Brute Force</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Clock size={14}/> Time</span>
                            <span className="font-mono font-medium">{activeQuestion.complexityBreakdown.bruteForce.timeComplexity}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Database size={14}/> Space</span>
                            <span className="font-mono font-medium">{activeQuestion.complexityBreakdown.bruteForce.spaceComplexity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                            {activeQuestion.complexityBreakdown.bruteForce.reason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Tags Section */}
              <div className="mb-8">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground mb-3">
                  <Building2 size={16} className="text-muted-foreground" />
                  Companies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeQuestion.companies?.map((company: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-muted text-xs font-medium rounded-full text-foreground/70 border border-border/50">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hints Section */}
              {activeQuestion.hints && activeQuestion.hints.length > 0 && (
                <div className="space-y-3 mb-10">
                  <h3 className="text-sm font-bold text-foreground mb-3">Need Help?</h3>
                  {activeQuestion.hints.map((hint: string, i: number) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
                      <button 
                        onClick={() => toggleHint(i)}
                        className="w-full flex items-center justify-between p-3.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Lightbulb size={16} className={expandedHints[i] ? "text-yellow-500" : "text-muted-foreground"} />
                          <span>Hint {i + 1}</span>
                        </div>
                        {expandedHints[i] ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                      </button>
                      {expandedHints[i] && (
                        <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border/50 bg-muted/20">
                          {hint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section: Notes, Approaches, Code */}
            <div className=" space-y-2">
              
              {/* Edge Cases & Pitfalls */}
              {(activeQuestion.edgeCases || activeQuestion.pitfalls) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {activeQuestion.edgeCases && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                      <h3 className="text-sm font-bold flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-3">
                        <AlertTriangle size={16} /> Edge Cases
                      </h3>
                      <ul className="space-y-3">
                        {activeQuestion.edgeCases.map((edge: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="font-mono text-xs bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded">{edge.case}</span>
                            <p className="text-muted-foreground mt-1">{edge.reason}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeQuestion.pitfalls && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                      <h3 className="text-sm font-bold flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                        <ShieldAlert size={16} /> Common Pitfalls
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.pitfalls.map((pitfall: string, i: number) => (
                          <li key={i}>{pitfall}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Follow Up Questions */}
              {activeQuestion.followUpQuestions && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-primary mb-3">
                    <HelpCircle size={16} /> Follow-up Questions
                  </h3>
                  <ul className="space-y-2 text-sm text-foreground/80 list-disc list-inside">
                    {activeQuestion.followUpQuestions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}


              {/* Pattern Explanation */}
              {activeQuestion.patternExplanation && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-primary">{activeQuestion.patternExplanation.name}</h3>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3 font-medium">
                    {activeQuestion.patternExplanation.coreIdea}
                  </p>
                  {activeQuestion.patternExplanation.whenToUse && (
                    <div className="mt-3 pt-3 border-t border-primary/10">
                      <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">When to use:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeQuestion.patternExplanation.whenToUse.map((w: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* My Notes (Accordion style - Full Width) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1">
                  <span className="text-primary">📝</span> My Notes
                </h3>
                {activeQuestion.notes?.map((note: { title: string, description: string }, i: number) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                    <button 
                      onClick={() => toggleNote(i)}
                      className="w-full flex items-center justify-between p-3.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <span>{note.title}</span>
                      </div>
                      {expandedNotes[i] ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                    </button>
                    {expandedNotes[i] && (
                      <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border/50 bg-muted/20 leading-relaxed">
                        {note.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Code Block with Monaco Editor (Approaches integrated into header) */}
              <div className="flex flex-col border border-border rounded-xl shadow-sm overflow-hidden h-[400px]">
                <div className="py-2.5 px-4 flex flex-row items-center justify-between bg-[#252526] border-b border-[#1e1e1e]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 hidden sm:flex">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-zinc-900/50 text-zinc-400 border-zinc-800 ml-1 sm:ml-2">
                      Java
                    </Badge>
                    
                    {/* Approaches Tabs */}
                    <div className="flex bg-zinc-900 rounded-md p-0.5 ml-2 overflow-x-auto hide-scrollbar">
                      {activeQuestion.approaches?.map((approach: { name: string, code: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setActiveApproachIdx(idx)}
                          className={`text-xs px-2.5 py-1 rounded-sm font-medium transition-colors whitespace-nowrap ${
                            idx === activeApproachIdx 
                              ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          {approach.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy} 
                    className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5 mr-2 text-green-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5 mr-2" /> Copy</>
                    )}
                  </Button>
                </div>
                <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
                  <Editor
                    height="100%"
                    language="java"
                    theme="vs-dark"
                    value={activeApproach.code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      wordWrap: "on",
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      padding: { top: 0, bottom: 0 },
                      renderLineHighlight: "none",
                      hideCursorInOverviewRuler: true,
                      overviewRulerBorder: false,
                      scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'hidden'
                      }
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
}
