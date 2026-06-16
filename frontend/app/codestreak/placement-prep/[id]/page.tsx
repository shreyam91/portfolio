'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronUp, FileText, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { contentApi } from "@/lib/api";
import { toast } from "sonner";

export default function PlacementPrepDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id ? parseInt(params.id as string) : 1;
  const [activeTopic, setActiveTopic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setIsLoading(true);
        const { contentApi, submissionsApi } = await import('@/lib/api');
        
        const [res, submissionsRes] = await Promise.all([
          contentApi.getPlacementPrepTopics(),
          submissionsApi.getUserSubmissions().catch(() => ({ data: { data: [] } }))
        ]);
        
        const topics = res.data?.data || [];
        const submissions = submissionsRes.data?.data || [];
        
        const found = topics.find((t: any) => {
          if (t._id === params.id) return true;
          const slug = t.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return slug === params.id;
        });
        
        const activeT = found || topics[0];
        setActiveTopic(activeT);
        
        if (activeT) {
          const problemId = activeT._id || activeT.id;
          const completed = submissions.some((sub: any) => sub.problemId === problemId?.toString());
          setIsCompleted(completed);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadTopic();
  }, [idParam]);

  const handleFinishReview = async () => {
    try {
      setSubmitting(true);
      toast.loading('Marking as completed...', { id: 'mark-completed' });
      const { default: api } = await import('@/lib/api');
      await api.post('/submissions', {
        problemId: activeTopic._id || activeTopic.id,
        category: 'PlacementPrep',
        difficulty: activeTopic.difficulty || 'Medium'
      });
      toast.success('Marked as completed successfully!', { id: 'mark-completed' });
      setIsCompleted(true);
    } catch (error) {
      toast.error('Failed to mark as completed. Please try again.', { id: 'mark-completed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !activeTopic) {
    return (
      <div className="flex-1 bg-background flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (

      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border"></div>
            <button 
              onClick={() => router.push('/dashboard/placement-prep')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <ArrowLeft size={16} />
              Prep Topics List
            </button>
            <div className="h-4 w-px bg-border"></div>
            <h2 className="font-bold hidden sm:block">{activeTopic.title}</h2>
          </div>
          <div className="flex gap-3">
             {/* <button 
              onClick={handleFinishReview}
              disabled={submitting || isCompleted}
              className={`px-4 py-1.5 text-white rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 ${
                isCompleted 
                  ? 'bg-zinc-700 hover:bg-zinc-700 cursor-not-allowed opacity-80' 
                  : 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
              }`}
             >
              {isCompleted ? <Check size={16} /> : <CheckCircle2 size={16} />}
              {isCompleted ? 'Completed' : submitting ? 'Finishing...' : 'Finish Review'}
            </button> */}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-muted/5">
          <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/70">{activeTopic.category}</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mt-1">{activeTopic.title}</h1>
                  </div>
               </div>
               <p className="text-xl text-muted-foreground leading-relaxed">
                 {activeTopic.description}
               </p>
            </div>

            <Separator className="mb-12" />

            <div className="space-y-6">
              {activeTopic.questions && activeTopic.questions.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                    <FileText className="text-muted-foreground" size={24} />
                    Interview Questions & Detailed Answers
                  </h2>
                  
                  {activeTopic.questions.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                        expandedIndex === index ? 'bg-card shadow-lg border-primary/20' : 'bg-background hover:border-primary/30'
                      }`}
                    >
                      <button 
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="w-full text-left p-6 flex items-start justify-between gap-4"
                      >
                        <div className="flex gap-4">
                          <span className="text-xl font-black text-primary/40 mt-0.5">Q{index + 1}</span>
                          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                            {item.q}
                          </h3>
                        </div>
                        <div className={`mt-1 p-1 rounded-full transition-colors ${expandedIndex === index ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>
                      
                      {expandedIndex === index && (
                        <div className="px-6 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="pl-11 pr-4">
                             <div className="bg-muted/40 p-6 rounded-2xl border border-border/50 relative">
                                <div className="absolute -left-2 top-6 w-4 h-4 bg-muted/40 rotate-45 border-l border-b border-border/50"></div>
                                {typeof item.a === 'string' ? (
                                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                                    {item.a as string}
                                  </p>
                                ) : (
                                  <div className="text-muted-foreground leading-relaxed text-lg space-y-6">
                                    {(item.a as any).props && (
                                      <div>
                                        <strong className="text-foreground text-xl block mb-3 border-b pb-2">Props</strong>
                                        <ul className="list-disc pl-5 mt-2 space-y-2">
                                          {(item.a as any).props.map((p: string, i: number) => (
                                            <li key={i}>{p}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {(item.a as any).state && (
                                      <div>
                                        <strong className="text-foreground text-xl block mb-3 border-b pb-2">State</strong>
                                        <ul className="list-disc pl-5 mt-2 space-y-2">
                                          {(item.a as any).state.map((s: string, i: number) => (
                                            <li key={i}>{s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="py-20 text-center bg-card border border-border rounded-2xl flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Interview Questions & Detailed Answers</h3>
                  <p className="text-muted-foreground text-lg">We are working hard to add question stay tuned.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
