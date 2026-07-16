"use client";

import React, { useState, useEffect } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Search,
  Code2,
  Database,
  TerminalSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  LayoutTemplate,
  Layers,
  FileCode2,
  Clock,
  Zap,
} from "lucide-react";
import { contentService } from "@/services/content.service";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [dsaData, sysData, mcData, resData] = await Promise.all([
          contentService.getDsaQuestions().then((res: any) => res.data?.data || res.data || []),
          contentService.getSystemDesignQuestions().then((res: any) => res.data?.data || res.data || []),
          contentService.getMachineCodingQuestions().then((res: any) => res.data?.data || res.data || []),
          contentService.getResources().then((res: any) => res.data?.data || res.data || []),
        ]);
        
        setResources(resData);
        
        // Mock a mixed feed of recent content
        const mixed = [
          ...(dsaData.slice(0, 3).map((q: any) => ({ ...q, type: "DSA", icon: Code2 }))),
          ...(sysData.slice(0, 3).map((q: any) => ({ ...q, type: "System Design", icon: LayoutTemplate }))),
          ...(mcData.slice(0, 3).map((q: any) => ({ ...q, type: "Machine Coding", icon: TerminalSquare }))),
        ].sort(() => Math.random() - 0.5).slice(0, 6); // Randomize for demo

        setRecentData(mixed);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const companies = [
    "Google", "Amazon", "Microsoft", "Uber", "Atlassian", 
    "Adobe", "Flipkart", "Swiggy", "Zomato", "Walmart"
  ];

  const topics = [
    { cat: "DSA", tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Greedy", "Sliding Window"] },
    { cat: "System Design", tags: ["Cache", "Database", "Load Balancer", "Queue", "CDN", "Kafka"] },
    { cat: "Machine Coding", tags: ["OOP", "SOLID", "Design Patterns", "Concurrency", "APIs"] },
    { cat: "Blogs", tags: ["Career", "Java", "Backend", "Cloud", "Databases"] }
  ];

  const collections = [
    { title: "Blind 75", count: "75 Questions", desc: "The most famous curated list of LeetCode questions." },
    { title: "Top 100 Interview Questions", count: "100 Questions", desc: "Frequently asked problems in top tech companies." },
    { title: "System Design Fundamentals", count: "12 Guides", desc: "Master the building blocks of large scale architecture." },
    { title: "Low-Level Design Essentials", count: "8 Projects", desc: "Object-oriented design patterns and practices." }
  ];

  const getSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col text-foreground font-sans">
      <DashboardNavbar />

      <div className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b dark:from-indigo-900/20 from-indigo-100/50 to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Master Software Engineering Interviews
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
              Practice coding problems, explore system design case studies, build real-world machine coding projects, and learn through curated engineering articles.
            </p>

            <div className="relative w-full max-w-3xl mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-20 transition-all duration-500"></div>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-indigo-600" size={24} />
              <input
                type="text"
                placeholder="Search questions, projects, blogs, or technologies..."
                className="relative w-full pl-16 pr-6 py-5 dark:bg-[#111] bg-white border dark:border-white/10 border-black/10 rounded-2xl text-lg outline-none transition-all shadow-sm focus:border-indigo-500/50"
              />
            </div>
            
            {/* <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground font-medium">
              <span className="mr-2">Popular:</span>
              {["LRU Cache", "Design Twitter", "Splitwise", "SOLID Principles", "Redis"].map(term => (
                <span key={term} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors">
                  {term}
                </span>
              ))}
            </div> */}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 space-y-24">
          
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8 relative z-20">
            {[
              { title: "DSA", subtitle: "Master algorithms and data structures.", href: "/dsa", icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "System Design", subtitle: "Learn how large-scale systems are built.", href: "/system-design", icon: LayoutTemplate, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { title: "Machine Coding", subtitle: "Build real-world software applications.", href: "/machine-coding", icon: TerminalSquare, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { title: "Blogs", subtitle: "Read engineering articles and guides.", href: "/blogs", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" }
            ].map(card => (
              <Link key={card.title} href={card.href} className="group p-6 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6`}>
                  <card.icon className={`w-7 h-7 ${card.color}`} />
                </div>
                <h3 className="font-bold text-xl mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm font-medium mb-8 flex-1">{card.subtitle}</p>
                <div className="flex items-center text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Explore {card.title} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Featured This Week (Bento Grid) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              
              {/* Featured DSA - Large Span */}
              <Link href="/dsa" className="group md:col-span-2 md:row-span-2 relative bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 p-8 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 w-2/3">
                  <span className="inline-block px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-black/10 dark:border-white/10">Featured DSA</span>
                  <h3 className="text-3xl font-extrabold mb-3">Merge k Sorted Lists</h3>
                  <p className="text-muted-foreground text-lg mb-6 line-clamp-2">Master the Divide and Conquer technique to efficiently merge multiple linked lists in O(N log k) time.</p>
                  <button className="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-bold shadow-sm">Solve Challenge</button>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-[120%] opacity-20 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                  <Layers className="w-full h-full text-indigo-500" />
                </div>
              </Link>

              {/* Featured System Design */}
              <Link href="/system-design" className="group relative bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 p-6 flex flex-col">
                <span className="inline-flex self-start px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">System Design</span>
                <h3 className="text-xl font-bold mb-2">Design Twitter</h3>
                <p className="text-muted-foreground text-sm flex-1">Understand fanout architecture and timeline generation for millions of users.</p>
                <div className="mt-auto flex items-center text-sm font-bold text-foreground">
                  Read Case Study <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Featured Blog */}
              <Link href="/blogs" className="group relative bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 p-6 flex flex-col">
                <span className="inline-flex self-start px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Editorial</span>
                <h3 className="text-xl font-bold mb-2">Cracking the FAANG Interview in 2026</h3>
                <p className="text-muted-foreground text-sm flex-1">Our comprehensive guide to preparing for top-tier software engineering interviews.</p>
                <div className="mt-auto flex items-center text-sm font-bold text-foreground">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

            </div>
          </div>

          {/* Browse by Company */}
          {/* <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Browse by Company</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {companies.map((company) => (
                <button key={company} className="flex-shrink-0 px-8 py-6 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] font-bold text-lg hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all hover:-translate-y-1 min-w-[200px] text-center">
                  {company}
                </button>
              ))}
            </div>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Learning Collections */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Curated Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {collections.map(collection => (
                  <div key={collection.title} className="group p-6 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-3 py-1 rounded-full">
                      {collection.count}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{collection.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 font-medium">{collection.desc}</p>
                    <span className="text-sm font-bold flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                      Start Collection <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore by Topic */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Explore by Topic</h2>
              <div className="bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] p-6 space-y-8">
                {topics.map(section => (
                  <div key={section.cat}>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">{section.cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {section.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Added Feed */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Recently Added</h2>
            </div>
            
            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentData.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link key={idx} href={`/codestreak/${item.type.toLowerCase().replace(" ", "-")}/${item._id ? getSlug(item.title) : ""}`} className="group p-5 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] flex items-start gap-4 hover:shadow-md transition-all hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.type}</span>
                          {item.difficulty && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              item.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                              item.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                              'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>{item.difficulty}</span>
                          )}
                        </div>
                        <h4 className="font-bold text-foreground group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h4>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Developer Resources */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Developer Resources</h2>
              <Link href="/resources" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resources.slice(0, 4).map((res) => (
                  <Link key={res.title} href="/resources" className="p-5 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[16px] hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors group block">
                    <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">{res.type}</div>
                    <h4 className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{res.title}</h4>
                  </Link>
                ))}
              </div>
            )}
          </div>
          

        </div>
      </div>
    </div>
  );
}
