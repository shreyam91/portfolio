"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import { 
  ArrowLeft, Clock, Database, Cloud, Zap, 
  ShieldCheck, CheckCircle2, 
  XCircle, ChevronDown, ChevronUp,
  Server, Monitor, Box, Layers, Play
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "Core Components" },
  { id: "flow", label: "System Flow" },
  { id: "algorithms", label: "Algorithms & Trade-offs" },
  { id: "interview", label: "Follow-up Questions" }
];

export function SystemDesignDetail({ isDashboard = false, question }: { isDashboard?: boolean, question: any }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const offsets = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        return { id: s.id, offset: el ? el.offsetTop - 200 : 0 };
      });
      
      const scrollPos = window.scrollY;
      let current = SECTIONS[0].id;
      
      for (const section of offsets) {
        if (scrollPos >= section.offset) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans text-foreground">
      <DashboardNavbar />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Sticky Navigation (Desktop) */}
        <div className="hidden lg:block w-[200px] shrink-0">
          <div className="sticky top-32">
            <Link 
              href="/codestreak/system-design" 
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Library
            </Link>
            
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Workspace</h4>
            <nav className="flex flex-col gap-1 border-l-2 border-border/50">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className={`text-sm text-left py-2 px-4 transition-all -ml-[2px] border-l-2 ${
                    activeSection === section.id 
                      ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-500/10" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-[900px] w-full pb-32">
          {/* Mobile Back Button */}
          <Link href="/codestreak/system-design" className="lg:hidden flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Library
          </Link>

          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{question.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-indigo-500/30 pl-4">{question.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider rounded-md border shadow-sm ${
                question.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 
                question.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}>
                {question.difficulty}
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-black/5 dark:border-white/5">
                <Clock className="w-4 h-4" /> {question.estimatedTime}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-black/5 dark:border-white/5">
                <Database className="w-4 h-4" /> {question.category}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {question.tags?.map((concept: string) => (
                <span key={concept} className="px-3 py-1 bg-[#111] dark:bg-[#222] text-white text-xs font-mono rounded border border-white/10 shadow-sm">
                  {concept}
                </span>
              ))}
            </div>

            {/* <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                <Monitor className="w-5 h-5" /> Start Interview Mode
              </button>
            </div> */}
          </header>

          <hr className="border-border mb-6" />

          {/* Problem Overview Section */}
          <section id="overview" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">Problem Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card dark:bg-[#111] p-6 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" /> Functional Requirements
                </h3>
                <ul className="space-y-3">
                  {question.functionalRequirements?.map((req: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card dark:bg-[#111] p-6 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                  <Zap className="w-5 h-5" /> Non-Functional Requirements
                </h3>
                <ul className="space-y-3">
                  {question.nonFunctionalRequirements?.map((req: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">✓</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Core Components Section */}
          <section id="components" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">Deep Dive Components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {question.deepDiveComponents?.map((comp: any, i: number) => (
                <div key={i} className="bg-card dark:bg-[#111] p-6 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{comp.component}</h3>
                  <p className="text-sm text-muted-foreground">{comp.responsibility}</p>
                </div>
              ))}
            </div>
          </section>

          {/* System Flow Section */}
          <section id="flow" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">High Level Design Flow</h2>
            <div className="space-y-4">
              {question.highLevelDesign?.map((step: string, i: number) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-card dark:bg-[#111] border-2 border-border shadow-sm flex items-center justify-center font-mono font-bold text-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors z-10">
                      {i + 1}
                    </div>
                    {i < question.highLevelDesign.length - 1 && (
                      <div className="w-0.5 h-full min-h-[40px] bg-border group-hover:bg-indigo-500/50 transition-colors my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-card dark:bg-[#111] border border-border p-5 rounded-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-500/30 transition-all mt-1 mb-2">
                    <p className="text-foreground/90 font-medium leading-relaxed flex items-start gap-3">
                      <Play className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Algorithms & Trade-offs Section */}
          <section id="algorithms" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">Algorithms & Trade-offs</h2>
            <div className="grid grid-cols-1 gap-6">
              {question.coreAlgorithms?.map((algo: any, i: number) => (
                <div key={i} className="bg-card dark:bg-[#111] rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-muted/30 border-b border-black/10 dark:border-white/10 font-bold text-lg flex items-center gap-2">
                    <div className="w-2 h-6 bg-indigo-500 rounded-full"></div> {algo.name}
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Pros</h4>
                      <ul className="space-y-2">
                        {algo.pros.map((pro: string, j: number) => (
                          <li key={j} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1"><XCircle className="w-4 h-4" /> Cons</h4>
                      <ul className="space-y-2">
                        {algo.cons.map((con: string, j: number) => (
                          <li key={j} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interview Questions Section */}
          <section id="interview" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">Follow-up Questions</h2>
            <div className="space-y-4">
              {question.followUpQuestions?.map((q: string, i: number) => (
                <div 
                  key={i} 
                  className="bg-card dark:bg-[#111] border border-border rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-full px-6 py-5 flex items-start gap-4 font-bold text-left text-foreground/90">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" />
                    <span>{q}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
