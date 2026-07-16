"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import { 
  ArrowLeft, 
  Download, 
  Maximize2, 
  FileText, 
  Book, 
  LayoutTemplate, 
  File, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { contentService } from "@/services/content.service";

// Helper to derive icon based on type
const getIconForType = (type: string) => {
  switch (type?.toLowerCase()) {
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


export function ResourceDetail({ slug, isDashboard = false }: { slug: string, isDashboard?: boolean }) {
  const router = useRouter();
  const [resource, setResource] = React.useState<any>(null);
  const [related, setRelated] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Simulated PDF Viewer State
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  React.useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await contentService.getResources();
        const allResources = response.data?.data || response.data || [];
        const found = allResources.find((r: any) => r.slug === slug);
        setResource(found);
        setRelated(allResources.filter((r: any) => r.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [slug]);

  if (loading) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col items-center justify-center">
        <DashboardNavbar />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mt-20"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col">
        <DashboardNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Resource Not Found</h2>
          <p className="text-muted-foreground mb-6">The resource you are looking for does not exist.</p>
          <button onClick={() => router.push(isDashboard ? "/resources" : "/codestreak/resources")} className="px-6 py-3 bg-foreground text-background font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const Icon = getIconForType(resource.type);
  const { color, bg } = getColorForIndex(0); // You can randomize or hash slug if needed


  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col text-foreground font-sans">
      <DashboardNavbar />
      

      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 lg:px-12 py-12">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.push(isDashboard ? "/resources" : "/codestreak/resources")}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Library
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{resource.title}</h1>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mt-1">
                  <span className="uppercase tracking-wider text-[10px] bg-muted px-2 py-0.5 rounded text-foreground">{resource.type}</span>
                  <span>{resource.pages} Pages</span>
                  <span>•</span>
                  <span>{resource.size}</span>
                  <span>•</span>
                  <span>Updated {resource.lastUpdated}</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">{resource.description}</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <a href={resource.downloadUrl} download className="px-6 py-3 bg-foreground text-background font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download PDF
            </a>
          </div>
        </div>

        {/* Simulated PDF Viewer */}
        <div className="bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm flex flex-col mb-24 h-[800px]">
          {/* Toolbar */}
          <div className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 bg-muted/30">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium tabular-nums">Page {currentPage} of {resource.pages}</span>
              <button 
                onClick={() => setCurrentPage(Math.min(resource.pages, currentPage + 1))}
                disabled={currentPage === resource.pages}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><ZoomOut className="w-5 h-5" /></button>
              <span className="text-sm font-medium tabular-nums w-12 text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><ZoomIn className="w-5 h-5" /></button>
              <div className="w-px h-4 bg-border mx-2"></div>
              <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><Maximize2 className="w-5 h-5" /></button>
            </div>
          </div>
          
          {/* Document Area (Simulated) */}
          <div className="flex-1 bg-black/5 dark:bg-black/40 overflow-auto flex items-center justify-center p-8">
            <div 
              className="bg-white rounded-lg shadow-2xl transition-transform origin-top flex flex-col relative overflow-hidden"
              style={{ width: '800px', height: '1131px', transform: `scale(${zoom / 100})` }}
            >
              {/* Fake PDF Content */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
              
              <div className="p-16 flex flex-col h-full opacity-80">
                <h1 className="text-5xl font-extrabold text-black mb-8 border-b-2 border-black/10 pb-8">{resource.title}</h1>
                
                <div className="space-y-6 flex-1">
                  <div className="h-4 bg-black/10 rounded w-full"></div>
                  <div className="h-4 bg-black/10 rounded w-11/12"></div>
                  <div className="h-4 bg-black/10 rounded w-full"></div>
                  <div className="h-4 bg-black/10 rounded w-4/5"></div>
                  <div className="h-4 bg-black/10 rounded w-full"></div>
                  <div className="h-4 bg-black/10 rounded w-5/6"></div>
                  <div className="h-4 bg-black/10 rounded w-3/4"></div>
                  
                  <div className="h-48 bg-indigo-50 border border-indigo-100 rounded-xl my-12 w-full flex items-center justify-center">
                    <Icon className="w-16 h-16 text-indigo-300" />
                  </div>

                  <div className="h-4 bg-black/10 rounded w-full"></div>
                  <div className="h-4 bg-black/10 rounded w-11/12"></div>
                  <div className="h-4 bg-black/10 rounded w-full"></div>
                  <div className="h-4 bg-black/10 rounded w-4/5"></div>
                </div>
                
                <div className="mt-auto pt-8 border-t border-black/10 flex justify-between items-center">
                  <span className="text-black/40 font-bold text-sm">Codestreak Resource Library</span>
                  <span className="text-black/40 font-bold text-sm">{currentPage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="space-y-8 border-t border-black/10 dark:border-white/10 pt-16">
          <h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((res, idx) => {
              const RelIcon = getIconForType(res.type);
              const { color: rColor, bg: rBg } = getColorForIndex(idx + 1);
              return (
                <Link key={res._id || res.slug} href={`/codestreak/resources/${res.slug}`} className="group p-5 bg-card dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] hover:shadow-md transition-all hover:-translate-y-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${rBg} flex items-center justify-center`}>
                      <RelIcon className={`w-5 h-5 ${rColor}`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{res.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{res.description}</p>
                  <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Preview Resource <ArrowLeft className="w-4 h-4 rotate-180" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
