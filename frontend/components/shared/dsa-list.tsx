"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";


import Link from 'next/link';
import { Search, Filter, CheckCircle2, Circle, ArrowUpDown } from 'lucide-react';
import { contentApi } from "@/lib/api";

export function DSAList({ isDashboard = false }: { isDashboard?: boolean }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All");
  const [difficultySort, setDifficultySort] = useState<"none" | "asc" | "desc">("none");
  const [dsaQuestions, setDsaQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { contentApi, submissionsApi } = await import('@/lib/api');
        
        let submissions: any[] = [];
        let data: any[] = [];
        
        try {
          if (isDashboard) {
            const res = await contentApi.getDsaQuestions();
            data = res.data?.data || [];
            const submissionsRes = await submissionsApi.getUserSubmissions().catch(() => ({ data: { data: [] } }));
            submissions = submissionsRes.data?.data || [];
          } else {
            // Dummy data for public preview
            data = [
              { _id: '1', id: '1', title: 'Two Sum', difficulty: 'Easy', pattern: 'Hashing', companies: ['Amazon', 'Google'] },
              { _id: '2', id: '2', title: 'Merge K Sorted Lists', difficulty: 'Hard', pattern: 'Heap', companies: ['Microsoft', 'Uber'] },
              { _id: '3', id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', pattern: 'Sliding Window', companies: ['Facebook', 'Netflix'] },
              { _id: '4', id: '4', title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'Stack/Queue', companies: ['LinkedIn', 'Apple'] },
            ];
          }
        } catch (err) {
        }

        const completedIds = new Set(submissions.map((sub: any) => sub.problemId));

        const updatedData = data.map((q: any) => {
          const problemId = q._id || q.id;
          return {
            ...q,
            status: completedIds.has(problemId?.toString()) ? 'solved' : 'unsolved'
          };
        });

        setDsaQuestions(updatedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [isDashboard]);

  const filteredQuestions = useMemo(() => {
    return dsaQuestions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(deferredSearch.toLowerCase());
      const patternStr = typeof q.pattern === 'string' ? q.pattern : q.pattern?.primary;
      const matchesFilter = activeFilter === "All" || patternStr === activeFilter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (difficultySort === "none") return 0;
      
      const diffMap: Record<string, number> = { "Easy": 1, "Medium": 2, "Hard": 3 };
      const aVal = diffMap[a.difficulty] || 0;
      const bVal = diffMap[b.difficulty] || 0;
      
      if (difficultySort === "asc") return aVal - bVal;
      return bVal - aVal; // desc
    });
  }, [dsaQuestions, deferredSearch, activeFilter, difficultySort]);

  const toggleSort = () => {
    if (difficultySort === "none") setDifficultySort("asc");
    else if (difficultySort === "asc") setDifficultySort("desc");
    else setDifficultySort("none");
  };

  const categories = [
    "All", 
    "Arrays", 
    "Hashing", 
    "Two Pointers", 
    "Sliding Window", 
    "Binary Search", 
    "Stack/Queue", 
    "Linked List", 
    "Trees", 
    "Heap", 
    "Graphs", 
    "Backtracking", 
    "Dynamic Programming", 
    "Greedy", 
    "Trie / Advanced Topics"
  ];

  return (
<>
          {isDashboard && (
            <header className="dark:bg-[#0a0a0a]/80 bg-white/80 backdrop-blur-xl sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b dark:border-white/10 border-black/10 px-4 z-10">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold">DSA Practice</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
          )}
          
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto dark:bg-[#0a0a0a] bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Problem Set</h1>
                  <p className="text-muted-foreground">Master core patterns to crack tech interviews.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search problems..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border dark:border-white/10 border-black/10 rounded-xl text-sm outline-none focus:border-primary transition-colors shadow-sm dark:bg-white/5 bg-white"
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

              <div className="border dark:border-white/10 border-black/10 dark:bg-white/5 bg-white backdrop-blur-md rounded-2xl shadow-sm overflow-hidden relative">
                {isLoading ? (
                  <div className="py-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredQuestions.length > 0 ? (
                  <div className="divide-y divide-border">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b dark:border-white/10 border-black/10 bg-muted/10 font-semibold text-sm text-muted-foreground items-center">
                      <div className="col-span-1 text-center">Status</div>
                      <div className="col-span-5 md:col-span-6">Title</div>
                      <div className="col-span-3 md:col-span-2">
                        <button 
                          onClick={toggleSort}
                          className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
                        >
                          Difficulty
                          <ArrowUpDown size={14} className={`transition-colors ${difficultySort !== 'none' ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-muted-foreground'}`} />
                        </button>
                      </div>
                      <div className="col-span-3 md:col-span-3">Pattern</div>
                    </div>
                    {filteredQuestions.map((problem) => {
                      const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      return (
                      <Link 
                        key={problem._id} 
                        href={isDashboard ? `/codestreak/dsa/${slug}` : `/dsa/${slug}`}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        <div className="col-span-1 flex justify-center">
                          {problem.status === 'solved' ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                          )}
                        </div>
                        <div className="col-span-5 md:col-span-6 flex flex-col items-start justify-center gap-1.5 group-hover:text-primary transition-colors">
                          <span className="font-medium text-foreground">{problem.title}</span>
                          {/* Company Tags */}
                          {problem.companies && problem.companies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {problem.companies.slice(0, 3).map((company: string) => (
                                <span key={company} className="text-[10px] px-2 py-0.5 bg-transparent rounded-md border dark:border-white/10 border-black/10 text-muted-foreground font-medium whitespace-nowrap">
                                  {company}
                                </span>
                              ))}
                              {problem.companies.length > 3 && (
                                <span className="text-[10px] px-2 py-0.5 bg-transparent rounded-md border dark:border-white/10 border-black/10 text-muted-foreground font-medium whitespace-nowrap">
                                  +{problem.companies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                            problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' : 
                            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="col-span-3 md:col-span-3 text-sm text-muted-foreground">{typeof problem.pattern === 'string' ? problem.pattern : problem.pattern?.primary}</div>
                      </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-bold">No problems found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
</>
  );
}
