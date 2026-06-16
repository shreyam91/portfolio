"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { 
  ArrowLeft, ListChecks, Link as LinkIcon, Clock, CheckCircle2, Check, 
  Github, ExternalLink, ShieldCheck, Code2, AlertTriangle, 
  Zap, Target, HelpCircle, Lightbulb, Keyboard, Package,
  Settings2, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contentApi } from "@/lib/api";
import { toast } from "sonner";

export function MachineCodingDetail({ isDashboard = false }: { isDashboard?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id ? parseInt(params.id as string) : 1;
  const [activeId, setActiveId] = useState(idParam);
  const [activeTab, setActiveTab] = useState("requirements");
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
          contentApi.getMachineCodingQuestions(),
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

  const handleMarkCompleted = async () => {
    try {
      setSubmitting(true);
      toast.loading('Marking as completed...', { id: 'mark-completed' });
      const { default: api } = await import('@/lib/api');
      await api.post('/submissions', {
        problemId: activeQuestion._id || activeQuestion.id,
        category: 'MachineCoding',
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

    return (
      <div className="h-full w-full">
        {children}
      </div>
    );
  };

  if (isLoading || !activeQuestion) {
    return layoutWrapper(
      <div className="flex-1 bg-background flex justify-center items-center h-full">
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
              onClick={() => router.push('/dashboard/machine-coding')}
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

        {/* Single Column Layout */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-muted/10">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* Title Section */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{activeQuestion.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`text-xs px-3 py-1 rounded-md font-semibold ${
                  activeQuestion.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' : 
                  activeQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {activeQuestion.difficulty}
                </span>
                
                {activeQuestion.category && (
                  <Badge variant="outline" className="text-purple-500 border-purple-500/30 bg-purple-500/5">
                    {activeQuestion.category}
                  </Badge>
                )}

                {activeQuestion.estimatedTime && (
                  <span className="text-xs px-3 py-1 bg-muted text-muted-foreground font-medium rounded-md border border-border/50 flex items-center gap-1.5">
                    <Clock size={14} /> {activeQuestion.estimatedTime}
                  </span>
                )}
                
                {activeQuestion.companies && activeQuestion.companies.map((company: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-muted text-xs font-medium rounded-full text-foreground/70 border border-border/50">
                    {company}
                  </span>
                ))}
              </div>
              
              {activeQuestion.tags && activeQuestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeQuestion.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {activeQuestion.description && (
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed mb-6 text-foreground/90">
                  {activeQuestion.description}
                </div>
              )}

              {/* Problem Link */}
              {activeQuestion.problemLink && (
                <a 
                  href={activeQuestion.problemLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink size={16} /> Original Problem Link
                </a>
              )}
            </div>

            {/* Requirements & Approach */}
            {(activeQuestion.requirements || activeQuestion.bonusRequirements || activeQuestion.solutionApproach) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListChecks className="text-primary w-5 h-5" /> Requirements & Approach
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeQuestion.requirements && (
                      <div>
                        <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Standard Requirements
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.requirements.map((req: string, i: number) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activeQuestion.bonusRequirements && (
                      <div>
                        <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" /> Bonus Requirements
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.bonusRequirements.map((req: string, i: number) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {activeQuestion.solutionApproach && activeQuestion.solutionApproach.highLevel && (
                    <div className="p-4 bg-muted/20 rounded-lg border border-border/50 mt-4">
                      <h3 className="font-semibold mb-3 text-foreground text-sm">High-Level Solution Approach</h3>
                      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        {activeQuestion.solutionApproach.highLevel.map((step: string, i: number) => (
                          <li key={i} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* I/O details */}
            {(activeQuestion.input || activeQuestion.expectedOutput) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="text-primary w-5 h-5" /> Input & Expected Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeQuestion.input && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm text-foreground">Sample Input Data</h3>
                      <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto text-xs text-zinc-300 font-mono border border-zinc-800">
                        {JSON.stringify(activeQuestion.input, null, 2)}
                      </pre>
                    </div>
                  )}
                  {activeQuestion.expectedOutput && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm text-foreground">Expected Visuals/Output</h3>
                      {Array.isArray(activeQuestion.expectedOutput) ? (
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.expectedOutput.map((out: string, i: number) => (
                            <li key={i}>{out}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {typeof activeQuestion.expectedOutput === 'string' ? activeQuestion.expectedOutput : JSON.stringify(activeQuestion.expectedOutput, null, 2)}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Component Architecture & State Management */}
            {(activeQuestion.componentStructure || activeQuestion.stateManagement || activeQuestion.expectedConcepts) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="text-primary w-5 h-5" /> Architecture & Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  {activeQuestion.componentStructure && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">Component Structure</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeQuestion.componentStructure.map((comp: string, i: number) => (
                          <Badge key={i} variant="outline" className="font-mono bg-background border-border shadow-sm">
                            &lt;{comp} /&gt;
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeQuestion.stateManagement && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeQuestion.stateManagement.stateVariables && (
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">State Variables</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeQuestion.stateManagement.stateVariables.map((v: string, i: number) => (
                              <code key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">{v}</code>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeQuestion.stateManagement.concepts && (
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">Key Concepts</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeQuestion.stateManagement.concepts.map((c: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] uppercase tracking-wider">{c}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeQuestion.expectedConcepts && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Expected React Concepts to Use</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeQuestion.expectedConcepts.map((concept: string, i: number) => (
                          <span key={i} className="text-sm text-primary/80 bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Edge Cases, Accessibility, Performance */}
            {(activeQuestion.edgeCases || activeQuestion.accessibility || activeQuestion.performanceConsiderations || activeQuestion.commonMistakes) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Edge Cases & Mistakes */}
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="text-orange-500 w-4 h-4" /> Gotchas & Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    {activeQuestion.edgeCases && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-foreground">Edge Cases to Handle</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.edgeCases.map((e: string, i: number) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activeQuestion.commonMistakes && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="text-sm font-semibold mb-2 text-red-500/80">Common Interview Mistakes</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.commonMistakes.map((m: string, i: number) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* A11y & Perf */}
                <div className="space-y-6">
                  {activeQuestion.accessibility && (
                    <Card className="border-border shadow-sm">
                      <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Keyboard className="text-blue-500 w-4 h-4" /> Accessibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.accessibility.map((a: string, i: number) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {activeQuestion.performanceConsiderations && (
                    <Card className="border-border shadow-sm">
                      <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="text-yellow-500 w-4 h-4" /> Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.performanceConsiderations.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Evaluation & Follow-ups */}
            {(activeQuestion.followUpQuestions || activeQuestion.evaluationCriteria) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeQuestion.followUpQuestions && (
                  <Card className="border-border shadow-sm lg:col-span-2">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="text-primary w-5 h-5" /> Interviewer Follow-Ups
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.followUpQuestions.map((q: string, i: number) => (
                          <li key={i} className="leading-relaxed">{q}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {/* {activeQuestion.evaluationCriteria && (
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="text-primary w-5 h-5" /> Rubric (%)
                      </CardTitle>
                    </CardHeader>
                     <CardContent className="pt-5">
                      <div className="space-y-3">
                        {Object.entries(activeQuestion.evaluationCriteria).map(([key, value], i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-semibold">{String(value)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent> 
                  </Card>
                )} */}
              </div>
            )}

            {/* Reference GitHub Solution & Resources */}
            {(activeQuestion.githubSolution || (activeQuestion.referenceResources && activeQuestion.referenceResources.length > 0)) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LinkIcon className="text-primary w-5 h-5" /> Reference Solutions & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  
                  {/* GitHub Link */}
                  {activeQuestion.githubSolution && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Github size={16} /> Reference GitHub Solution
                      </h4>
                      <a 
                        href={activeQuestion.githubSolution} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors group"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-primary group-hover:underline">View Source Code</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[300px] sm:max-w-md">
                            {activeQuestion.githubSolution}
                          </span>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Other Resources */}
                  {activeQuestion.referenceResources && activeQuestion.referenceResources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Other Resources</h4>
                      <ul className="space-y-3">
                        {activeQuestion.referenceResources.map((ref: { title: string, url: string }, i: number) => (
                          <li key={i}>
                            <a href={ref.url} target="_blank" rel="noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors group">
                              <span>{ref.title}</span>
                              <ArrowLeft className="w-3 h-3 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rotate-135" style={{ transform: 'rotate(135deg)' }} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    );
}
