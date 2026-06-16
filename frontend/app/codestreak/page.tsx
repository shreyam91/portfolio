'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import PomodoroTimer from '@/components/PomodoroTimer';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Code2, MonitorPlay, Layers, Flame, Sparkles, Check, Activity } from 'lucide-react';
import { contentService } from '@/services/content.service';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<{ dsa: any[], sys: any[], mc: any[] }>({ dsa: [], sys: [], mc: [] });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Only load available content now that auth is disabled
        const [dsaData, sysData, mcData] = await Promise.all([
          contentService.getDsaQuestions().then((res: any) => res.data?.data || []),
          contentService.getSystemDesignQuestions().then((res: any) => res.data?.data || []),
          contentService.getMachineCodingQuestions().then((res: any) => res.data?.data || []),
        ]);
        setAllQuestions({ dsa: dsaData, sys: sysData, mc: mcData });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Find next unsolved questions (just pick the first ones since no auth tracking)
  const nextDsa = (allQuestions.dsa || [])[0];
  const nextSys = (allQuestions.sys || [])[0];
  const nextMc = (allQuestions.mc || [])[0];

  const whatsNewItems: any[] = [];

  // Data processing for Recent Activity and Streak
  const allContent = [
    ...(allQuestions.dsa || []).map(q => ({...q, category: 'DSA'})), 
    ...(allQuestions.sys || []).map(q => ({...q, category: 'System Design'})), 
    ...(allQuestions.mc || []).map(q => ({...q, category: 'Machine Coding'}))
  ];
  
  const recentActivity = [...allContent]
    .filter(q => q.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const getLocalDateStr = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const activityMap: Record<string, number> = {};
  allContent.forEach((q) => {
    if (!q.createdAt) return;
    try {
      const date = new Date(q.createdAt);
      const dateStr = getLocalDateStr(date);
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
    } catch (e) {}
  });

  let currentStreak = 0;
  const today = new Date();
  let checkDate = new Date(today);
  const todayStr = getLocalDateStr(checkDate);
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterdayStr = getLocalDateStr(checkDate);

  let streakStart = new Date(today);
  if (activityMap[todayStr]) {
     // Start from today
  } else if (activityMap[yesterdayStr]) {
     streakStart.setDate(streakStart.getDate() - 1);
  }

  while (true) {
    const dateStr = getLocalDateStr(streakStart);
    if (activityMap[dateStr]) {
      currentStreak++;
      streakStart.setDate(streakStart.getDate() - 1);
    } else {
      break;
    }
  }

  const generateGrid = () => {
    const today = new Date();
    const grid = [];
    
    // Start exactly 52 weeks ago from today
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7));
    
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    let currentDate = new Date(startDate);
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = getLocalDateStr(currentDate);
        week.push({
          date: dateStr,
          count: activityMap[dateStr] || 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      grid.push(week);
    }
    return grid;
  };
  const activityGrid = generateGrid();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels: { index: number; label: string }[] = [];
  let currentMonth = -1;
  activityGrid.forEach((week, index) => {
    if (week.length > 0) {
      const weekStartMonth = new Date(week[0].date).getMonth();
      if (weekStartMonth !== currentMonth) {
        if (index > 0 || new Date(week[0].date).getDate() < 15) {
          monthLabels.push({ index, label: months[weekStartMonth] });
        }
        currentMonth = weekStartMonth;
      }
    }
  });

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground transition-colors" />
          <Separator orientation="vertical" className="h-6 bg-border" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground">Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-transform hover:scale-105 cursor-default hidden sm:flex">
            <div className="relative flex items-center justify-center">
              <Flame className="text-orange-500 relative z-10 animate-pulse" size={18} fill="currentColor" />
              <div className="absolute inset-0 bg-orange-500 blur-md opacity-60 animate-pulse"></div>
            </div>
            <span className="font-bold text-sm text-orange-600 dark:text-orange-400">{currentStreak} Day Streak</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-background/50">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-10 space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pb-6 border-b border-border">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Welcome to CodeStreak!</h1>
              <p className="text-muted-foreground text-lg max-w-2xl">This platform is developed by me to track my study or practice as well as others who can track their progress & study etc...</p>
            </div>
          </div>

          {/* Year Streak Chart (Top) */}
          <div className="">
            <div className="flex items-center gap-2">
              <Activity className="text-primary" size={24} />
              <h2 className="text-2xl font-bold">Activity Graph</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-x-auto custom-scrollbar">
              <div className="min-w-[700px]">
                <div className="flex w-full mb-2">
                  <div className="w-8 shrink-0"></div>
                  <div className="relative flex-1 text-[10px] text-muted-foreground font-semibold h-4 uppercase tracking-wider">
                    {monthLabels.map((m, i) => (
                      <span key={i} className="absolute top-0" style={{ left: `${(m.index / 53) * 100}%` }}>
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex w-full">
                  <div className="flex flex-col justify-between text-[9px] text-muted-foreground font-semibold pr-3 w-8 shrink-0 pb-1 h-[116px]">
                    <div className="text-right h-[14px]"></div>
                    <div className="text-right h-[14px] leading-[14px]">Mon</div>
                    <div className="text-right h-[14px]"></div>
                    <div className="text-right h-[14px] leading-[14px]">Wed</div>
                    <div className="text-right h-[14px]"></div>
                    <div className="text-right h-[14px] leading-[14px]">Fri</div>
                    <div className="text-right h-[14px]"></div>
                  </div>

                  <div className="flex flex-1 justify-between items-center w-full">
                    {activityGrid.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col justify-between h-[116px]">
                        {week.map((day, dIdx) => {
                          let bgClass = "bg-green-200 dark:bg-orange-600/60";
                          if (day.count === 1) bgClass = "bg-red-200";
                          else if (day.count === 2) bgClass = "bg-red-400";
                          else if (day.count >= 3) bgClass = "bg-red-600 shadow-[0_0_8px_rgba(var(--primary),0.4)]";
                          
                          return (
                            <div 
                              key={dIdx} 
                              title={`${day.count} uploads on ${day.date}`}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] rounded-[3px] ${bgClass} hover:ring-2 hover:ring-primary/80 hover:scale-125 transition-all cursor-crosshair z-10`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity List (Middle) */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Check className="text-primary" size={24} />
              <h2 className="text-2xl font-bold">Recent Activity</h2>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar pl-1 py-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="relative border-l-2 border-border ml-2 space-y-8 pb-4">
                  {recentActivity.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-background ${
                        item.difficulty === 'Easy' ? 'bg-green-500' : 
                        item.difficulty === 'Medium' ? 'bg-yellow-500' : 
                        item.difficulty === 'Hard' ? 'bg-red-500' : 'bg-primary'
                      }`}></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <Link href={`/dashboard/${item.category === 'DSA' ? 'dsa' : item.category === 'System Design' ? 'system-design' : 'machine-coding'}/${item._id}`}>
                            <h4 className="text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{item.title}</h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-muted rounded-md text-foreground">{item.category}</span>
                          {item.difficulty && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                              item.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                              item.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                              'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>{item.difficulty}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p>No recent activity found. Time to add some problems!</p>
              </div>
            )}
          </div>


          {/* What's New Section (Conditional) */}
          {whatsNewItems.length > 0 && (
            <div className="mt-12 pb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-yellow-500" size={24} />
                <h2 className="text-2xl font-bold">What's New</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whatsNewItems.map((item, i) => (
                  <div key={i} className="bg-card border border-border shadow-sm rounded-xl p-6 flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
