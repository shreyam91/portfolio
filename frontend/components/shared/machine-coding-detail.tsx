"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import { 
  ArrowLeft, Clock, Code2, CheckCircle2, ChevronRight, Monitor, 
  Smartphone, Maximize2, RotateCcw, AlertTriangle, Layers,
  Terminal, FileCode2, Target, Palette, FolderTree,
  ArrowRight, ShieldCheck
} from "lucide-react";

// Interactive Preview Accordion Component (Specific for Accordion Challenge)
function PreviewAccordion() {
  const [openItem, setOpenItem] = useState<number | null>(0);
  
  const items = [
    { q: "What is React?", a: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components." },
    { q: "What is the Virtual DOM?", a: "The virtual DOM is a programming concept where an ideal, or virtual, representation of a UI is kept in memory and synced with the real DOM." },
    { q: "How does State work?", a: "State is a React object that is used to contain data or information about the component. A component's state can change over time; whenever it changes, the component re-renders." }
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <h3 className="font-bold text-lg mb-6 text-foreground">FAQ Section</h3>
      {items.map((item, idx) => (
        <div key={idx} className="border border-border rounded-xl overflow-hidden bg-card">
          <button
            onClick={() => setOpenItem(openItem === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors font-semibold text-left"
          >
            {item.q}
            <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openItem === idx ? "rotate-90" : ""}`} />
          </button>
          <div 
            className={`grid transition-all duration-300 ease-in-out ${
              openItem === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-4 text-muted-foreground leading-relaxed text-sm border-t border-border/50">
                {item.a}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Fallback preview
function GenericPreview({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
      <Code2 className="w-12 h-12 mb-4 opacity-50" />
      <p>Interactive preview for <strong>{title}</strong> is not available.</p>
    </div>
  );
}

export function MachineCodingDetail({ isDashboard = false, challenge }: { isDashboard?: boolean, challenge: any }) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  const isAccordion = challenge.title?.toLowerCase().includes("accordion");

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans text-foreground">
      <DashboardNavbar />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Left Column: Challenge Content */}
        <div className="flex-1 lg:max-w-[700px] w-full pb-32">
          
          <Link href={isDashboard ? "/machine-coding" : "/codestreak/machine-coding"} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-10 group w-fit">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Challenges
          </Link>

          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">{challenge.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{challenge.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider rounded-md border shadow-sm ${
                challenge.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 
                challenge.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}>
                {challenge.difficulty}
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                <Clock className="w-4 h-4" /> {challenge.estimatedTime}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                <Code2 className="w-4 h-4" /> {challenge.category}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {challenge.tags?.map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-[#111] dark:bg-[#222] text-white text-xs font-mono rounded border border-white/10 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>

            {/* <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-foreground text-background font-bold rounded-xl shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                <Terminal className="w-5 h-5" /> Start Coding
              </button>
              {challenge.githubSolution && (
                <a href={challenge.githubSolution} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl shadow-sm transition-all border border-border flex items-center justify-center gap-2">
                  <FileCode2 className="w-5 h-5" /> View Solution
                </a>
              )}
            </div> */}
          </header>

          <hr className="border-border mb-6" />

          {/* Requirements */}
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">Requirements</h2>
            <div className="bg-card dark:bg-[#111] border border-border rounded-2xl p-6 shadow-sm">
              <ul className="space-y-4">
                {challenge.requirements?.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/90 leading-relaxed font-medium">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Expected Behavior (only show for Accordion specifically, or a generic version) */}
          {isAccordion && (
            <section className="mb-16">
              <h2 className="text-2xl font-extrabold tracking-tight mb-6">User Actions Flow</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-muted/30 p-8 rounded-2xl border border-border">
                <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                  <div className="w-12 h-12 bg-card border border-border rounded-xl shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                  </div>
                  <span className="text-sm font-bold text-foreground">Click Header</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground hidden sm:block" />
                <ArrowDownMobile />
                <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                  <div className="w-12 h-12 bg-card border border-border rounded-xl shadow-sm flex items-center justify-center">
                    <Layers className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-foreground">State Updates</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground hidden sm:block" />
                <ArrowDownMobile />
                <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                  <div className="w-12 h-12 bg-card border border-border rounded-xl shadow-sm flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-bold text-foreground">CSS Animates</span>
                </div>
              </div>
            </section>
          )}

          {/* Component Breakdown */}
          {challenge.componentStructure && (
            <section className="mb-16">
              <h2 className="text-2xl font-extrabold tracking-tight mb-6">Component Breakdown</h2>
              <div className="bg-[#111] rounded-2xl border border-white/10 p-6 overflow-hidden shadow-xl">
                <div className="font-mono text-sm leading-loose text-white/90">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                    <FolderTree className="w-4 h-4" /> Recommended Structure
                  </div>
                  <div className="pl-4 border-l border-white/10 ml-2">
                    {challenge.componentStructure.map((comp: string, idx: number) => (
                      <div key={idx} className="text-white font-bold my-1">
                        &lt;{comp} /&gt;
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Concepts Tested */}
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">Engineering Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challenge.expectedConcepts?.map((concept: string, i: number) => (
                <div key={i} className="bg-card dark:bg-[#111] border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-3 group hover:border-indigo-500/50 transition-colors">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" />
                    {concept}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" /> Common Mistakes
            </h2>
            <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 shadow-sm">
              <ul className="space-y-4">
                {challenge.commonMistakes?.map((mistake: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-0.5 text-lg leading-none">×</span>
                    <span className="text-red-900 dark:text-red-200/80 text-sm font-medium leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Evaluation Criteria */}
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">What Interviewers Look For</h2>
            <div className="grid grid-cols-1 gap-3">
              {challenge.evaluationCriteria?.map((evalItem: string, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-card dark:bg-[#111] border border-border p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{evalItem}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Preview & Editor Panel (Desktop) */}
        <div className="hidden lg:block w-[500px] shrink-0 relative">
          <div className="sticky top-24 flex flex-col gap-6">
            
            {/* The Live Preview Window */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col h-[600px]">
              
              {/* Window Controls & Toolbar */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                
                <div className="flex items-center gap-1 bg-background dark:bg-[#111] border border-border rounded-lg p-1">
                  <button 
                    onClick={() => setPreviewMode("desktop")}
                    className={`p-1.5 rounded-md transition-colors ${previewMode === "desktop" ? "bg-muted shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setPreviewMode("mobile")}
                    className={`p-1.5 rounded-md transition-colors ${previewMode === "mobile" ? "bg-muted shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewKey(k => k + 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* URL Bar Simulation */}
              <div className="h-10 border-b border-border bg-background dark:bg-[#111] flex items-center px-4 shrink-0">
                <div className="w-full bg-muted/50 rounded-md h-6 flex items-center justify-center text-xs font-mono text-muted-foreground">
                  localhost:3000
                </div>
              </div>

              {/* Preview Content Area */}
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 overflow-y-auto">
                <div 
                  className={`bg-background w-full h-full rounded-xl shadow-sm border border-border p-6 overflow-y-auto transition-all duration-300 ${
                    previewMode === "mobile" ? "max-w-[320px] max-h-[568px] mx-auto rounded-3xl border-4" : "max-w-none"
                  }`}
                >
                  {/* The actual interactive preview */}
                  {isAccordion ? <PreviewAccordion key={previewKey} /> : <GenericPreview title={challenge.title} />}
                </div>
              </div>
            </div>

            {/* Hint Box below preview */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Challenge Goal
              </h4>
              <p className="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
                {isAccordion 
                  ? "Interact with the preview above. Notice how the heights animate smoothly and the chevron rotates. Your implementation should perfectly mimic this behavior."
                  : "Build this challenge locally. Pay attention to edge cases and state management as required."
                }
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowDownMobile() {
  return <ArrowLeft className="w-6 h-6 text-muted-foreground sm:hidden -rotate-90 my-2" />;
}
