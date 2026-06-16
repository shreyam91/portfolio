"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";


import Link from 'next/link';
import { Search, Filter, CheckCircle2, Circle, ArrowUpDown } from 'lucide-react';

import { contentApi } from "@/lib/api";

export default function PlacementPrepDashboardPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All");
  const [placementTopicsData, setPlacementTopicsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadTopics = async () => {
      try {
        const { contentApi } = await import('@/lib/api');
        
        const res = await contentApi.getPlacementPrepTopics();
        const data = res.data?.data || [];

        const updatedData = data.map((t: any) => ({
          ...t,
          status: 'unsolved'
        }));

        setPlacementTopicsData(updatedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadTopics();
  }, []);

  const categories = ["All", "CS Core", "Backend", "Frontend"];
  
  const filteredTopics = useMemo(() => {
    return placementTopicsData.filter(t => {
      const matchesSearch = t.title?.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesFilter = activeFilter === "All" || t.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [placementTopicsData, deferredSearch, activeFilter]);

  return (
<>

          <header className="dark:bg-[#0a0a0a]/80 bg-white/80 backdrop-blur-xl sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b dark:border-white/10 border-black/10 px-4 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">Placement Preparation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto dark:bg-[#0a0a0a] bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Placement Prep</h1>
                  <p className="text-muted-foreground">Master core CS fundamentals and behavioral questions.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search topics..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border dark:border-white/10 border-black/10 rounded-xl text-sm outline-none focus:border-primary transition-colors shadow-sm dark:bg-white/5 bg-white text-foreground placeholder:text-muted-foreground"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter size={16} className="text-muted-foreground mr-1 shrink-0" />
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent border dark:border-white/10 border-black/10 text-muted-foreground hover:bg-muted'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border dark:border-white/10 border-black/10 dark:bg-white/5 bg-white backdrop-blur-md rounded-2xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b dark:border-white/10 border-black/10 bg-muted/10 font-semibold text-sm text-muted-foreground items-center">
                  {/* <div className="col-span-1 text-center">Status</div> */}
                  <div className="col-span-8">Topic Title</div>
                  <div className="col-span-3">Category</div>
                </div>

                <div className="divide-y divide-border">
                  {isLoading ? (
                    <div className="py-20 flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredTopics.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground dark:bg-white/5 bg-white border dark:border-white/10 border-black/10 rounded-2xl">
                      No topics found matching your criteria.
                    </div>
                  ) : (
                    filteredTopics.map((topic) => {
                      const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      return (
                      <Link 
                        key={topic._id} 
                        href={`/dashboard/placement-prep/${slug}`}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        {/* <div className="col-span-1 flex justify-center">
                          {topic.status === 'solved' ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                          )}
                        </div> */}
                        <div className="col-span-8 flex flex-col items-start justify-center gap-1.5 group-hover:text-primary transition-colors">
                          <span className="font-medium text-foreground">{topic.title}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-xs px-2.5 py-1 bg-transparent rounded-md border dark:border-white/10 border-black/10 font-medium text-muted-foreground">
                            {topic.category}
                          </span>
                        </div>
                      </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
</>
  );
}
