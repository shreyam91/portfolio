"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { 
  ArrowLeft, Check, Server, Database, HardDrive, Network, 
  ListChecks, GitBranch, Link as LinkIcon, Image as ImageIcon, 
  Clock, Shield, Activity, FileText, Target, HelpCircle, Layers, ZoomIn
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contentApi } from "@/lib/api";
import { toast } from "sonner";

export function SystemDesignDetail({ isDashboard = false }: { isDashboard?: boolean }) {
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
          contentApi.getSystemDesignQuestions(),
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
        category: 'SystemDesign',
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
              onClick={() => router.push('/dashboard/system-design')}
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
                  <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/5">
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
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed mb-8 text-foreground/90">
                  {activeQuestion.description}
                </div>
              )}
            </div>

            {/* Requirements */}
            {(activeQuestion.functionalRequirements || activeQuestion.nonFunctionalRequirements) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListChecks className="text-primary w-5 h-5" /> Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeQuestion.functionalRequirements && (
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Functional Requirements</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.functionalRequirements.map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeQuestion.nonFunctionalRequirements && (
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Non-Functional Requirements</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.nonFunctionalRequirements.map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Capacity Estimation */}
            {activeQuestion.capacityEstimation && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="text-primary w-5 h-5" /> Capacity Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(activeQuestion.capacityEstimation).map(([key, value], i) => (
                      <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="font-medium text-foreground">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Design */}
            {activeQuestion.apiDesign && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="text-primary w-5 h-5" /> API Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-3">
                    {activeQuestion.apiDesign.map((api: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 gap-2">
                        <code className="text-sm font-mono text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{api.endpoint}</code>
                        <span className="text-sm text-muted-foreground">{api.purpose}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Model */}
            {activeQuestion.dataModel && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="text-primary w-5 h-5" /> Data Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(activeQuestion.dataModel).map(([entity, fields]: [string, any], i) => (
                      <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-3 py-2 border-b border-border/50 font-semibold text-sm">
                          {entity}
                        </div>
                        <ul className="p-3 space-y-1.5">
                          {Array.isArray(fields) && fields.map((field, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* High Level Design & Deep Dive */}
            {(activeQuestion.highLevelDesign || activeQuestion.deepDiveComponents) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="text-primary w-5 h-5" /> Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-8">
                  {activeQuestion.highLevelDesign && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <Layers className="w-4 h-4 text-primary" /> High Level Workflow
                      </h3>
                      <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground">
                        {activeQuestion.highLevelDesign.map((step: string, i: number) => (
                          <li key={i} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {activeQuestion.deepDiveComponents && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <ZoomIn className="w-4 h-4 text-primary" /> Deep Dive Components
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeQuestion.deepDiveComponents.map((comp: any, i: number) => (
                          <div key={i} className="p-3 bg-muted/20 border border-border/50 rounded-lg">
                            <div className="font-medium text-sm mb-1">{comp.component}</div>
                            <div className="text-xs text-muted-foreground leading-relaxed">{comp.responsibility}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Infrastructure Details */}
            {(activeQuestion.databaseDesign || activeQuestion.cachingStrategy || activeQuestion.scalingStrategy || activeQuestion.bottlenecks) && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="text-primary w-5 h-5" /> Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  {activeQuestion.databaseDesign && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Database Design</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(activeQuestion.databaseDesign).map(([key, value], i) => (
                          <Badge key={i} variant="secondary" className="font-mono text-xs">
                            {key}: <span className="text-primary ml-1">{String(value)}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeQuestion.cachingStrategy && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-foreground">Caching Strategy</h3>
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.cachingStrategy.map((strat: string, i: number) => (
                            <li key={i}>{strat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activeQuestion.scalingStrategy && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-foreground">Scaling Strategy</h3>
                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                          {activeQuestion.scalingStrategy.map((strat: string, i: number) => (
                            <li key={i}>{strat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {activeQuestion.bottlenecks && (
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2 text-orange-600 dark:text-orange-400">Potential Bottlenecks</h3>
                      <ul className="space-y-1 text-sm text-orange-600/80 dark:text-orange-400/80 list-disc list-inside">
                        {activeQuestion.bottlenecks.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tradeoffs */}
            {activeQuestion.tradeoffs && activeQuestion.tradeoffs.length > 0 && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="text-primary w-5 h-5" /> Tradeoffs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    {activeQuestion.tradeoffs.map((t: any, i: number) => (
                      <div key={i} className="p-4 bg-muted/20 border border-border/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{t.decision || "Tradeoff"}</h4>
                          <Badge className="bg-primary/10 text-primary border-primary/20">{t.choice}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{t.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security & Monitoring */}
            {(activeQuestion.securityConsiderations || activeQuestion.monitoringAndObservability) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeQuestion.securityConsiderations && (
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="text-primary w-5 h-5" /> Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.securityConsiderations.map((sec: string, i: number) => (
                          <li key={i}>{sec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {activeQuestion.monitoringAndObservability && (
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="text-primary w-5 h-5" /> Monitoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {activeQuestion.monitoringAndObservability.map((mon: string, i: number) => (
                          <li key={i}>{mon}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Evaluation & Follow-ups */}
            {(activeQuestion.followUpQuestions || activeQuestion.evaluationCriteria) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeQuestion.followUpQuestions && (
                  <Card className="border-border shadow-sm lg:col-span-2">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="text-primary w-5 h-5" /> Follow-Up Questions
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
                
                {activeQuestion.evaluationCriteria && (
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="text-primary w-5 h-5" /> Evaluation (%)
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
                )}
              </div>
            )}

            {/* Diagram Placeholder */}
            {activeQuestion.diagram && (
              <Card className="border-border shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="text-primary w-5 h-5" /> Architecture Diagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-[400px] bg-zinc-900 flex flex-col items-center justify-center text-muted-foreground border-t border-border/50 relative">
                    {activeQuestion.diagram.startsWith('http') ? (
                       <Image src={activeQuestion.diagram} alt="Architecture" fill className="object-cover opacity-30" />
                    ) : (
                       <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 mb-4 opacity-50 text-white" />
                        <p className="font-medium text-white">Diagram Placeholder</p>
                        <p className="text-sm opacity-60 text-white">({activeQuestion.diagram})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reference Resources */}
            {activeQuestion.referenceResources && activeQuestion.referenceResources.length > 0 && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LinkIcon className="text-primary w-5 h-5" /> Reference Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <ul className="space-y-3">
                    {activeQuestion.referenceResources.map((ref: { title: string, url: string }, i: number) => (
                      <li key={i}>
                        <a href={ref.url} target="_blank" rel="noreferrer" className="flex items-center text-primary hover:underline group">
                          <span className="font-medium">{ref.title}</span>
                          <ArrowLeft className="w-3 h-3 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rotate-135" style={{ transform: 'rotate(135deg)' }} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    );
}
