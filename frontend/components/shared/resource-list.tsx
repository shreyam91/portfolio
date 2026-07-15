"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import { Search, FileText, Download, Eye, File, Book, LayoutTemplate } from "lucide-react";
import { contentService } from "@/services/content.service";

// Helper to derive icon based on type
const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case "guide": return LayoutTemplate;
    case "notes": return Book;
    case "cheat sheet": return FileText;
    default: return File;
  }
};

const getColorForIndex = (index: number) => {
  const colors = [
    { color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { color: "text-blue-500", bg: "bg-blue-500/10" },
    { color: "text-purple-500", bg: "bg-purple-500/10" },
    { color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { color: "text-pink-500", bg: "bg-pink-500/10" },
    { color: "text-red-500", bg: "bg-red-500/10" },
    { color: "text-sky-500", bg: "bg-sky-500/10" },
    { color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  return colors[index % colors.length];
};

export function ResourceList() {
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await contentService.getResources();
        setResources(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(
    (res) =>
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.type.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filteredResources.filter((r) => r.featured);
  const others = filteredResources.filter((r) => !r.featured);

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col text-foreground font-sans">
      <DashboardNavbar />

      <div className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Resource Library
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
              Browse interview notes, cheat sheets, PDFs, roadmaps, and technical documentation—all in one place.
            </p>

            <div className="relative w-full max-w-2xl mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-20 transition-all duration-500"></div>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-indigo-600" size={24} />
              <input
                type="text"
                placeholder="Search resources, notes, PDFs, or guides..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative w-full pl-16 pr-6 py-5 dark:bg-[#111] bg-white border dark:border-white/10 border-black/10 rounded-2xl text-lg outline-none transition-all shadow-sm focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 space-y-20">
          
          {filteredResources.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-8">Try adjusting your search terms to find what you're looking for.</p>
              <button 
                onClick={() => setSearch("")}
                className="px-6 py-3 bg-foreground text-background font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {featured.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold tracking-tight">Featured Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featured.map((res, index) => {
                      const Icon = getIconForType(res.type);
                      const { color, bg } = getColorForIndex(index);
                      return (
                        <div key={res._id || res.id} className="group flex flex-col bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className={`h-40 ${bg} flex items-center justify-center relative overflow-hidden`}>
                            <Icon className={`w-16 h-16 ${color} opacity-80`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <span className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                              {res.type}
                            </span>
                          </div>
                          
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{res.title}</h3>
                            <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{res.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                              <span className="flex items-center gap-1.5"><File className="w-3.5 h-3.5"/> {res.pages} Pages</span>
                              <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5"/> {res.size}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-auto">
                              <Link href={`/codestreak/resources/${res.slug}`} className="flex-1 px-4 py-2.5 bg-foreground text-background text-center rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4" /> Preview
                              </Link>
                              <a
  href={res.downloadUrl}
  download
  className="px-4 py-2.5 border border-black/10 dark:border-white/10 hover:bg-muted rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
>
  <Download className="w-4 h-4" />
  <span>Download</span>
</a>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* All Resources Grid */}
              {others.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold tracking-tight">All Resources</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {others.map((res, index) => {
                      const Icon = getIconForType(res.type);
                      const { color, bg } = getColorForIndex(index + featured.length);
                      return (
                        <div key={res._id || res.id} className="group p-5 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] hover:shadow-md transition-all hover:-translate-y-1 flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            <span className="px-2.5 py-1 bg-muted rounded font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                              {res.type}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{res.title}</h3>
                          <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{res.description}</p>
                          
                          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-6">
                            <span>{res.pages} pgs</span>
                            <span>•</span>
                            <span>{res.size}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-auto">
                            <Link href={`/codestreak/resources/${res.slug}`} className="flex-1 px-3 py-2 bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-center rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </Link>
                            <a
  href={res.downloadUrl}
  download
  className="px-3 py-2 bg-muted hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
>
  <Download className="w-4 h-4" />
  <span>Download</span>
</a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
