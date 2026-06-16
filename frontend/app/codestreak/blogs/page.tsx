'use client';

import React, { useState, useDeferredValue, useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter } from 'lucide-react';

import { contentApi } from "@/lib/api";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All");
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await contentApi.getBlogs();
        setBlogsData(res.data?.data || []);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const categories = ["All", "React", "System Design", "DSA", "Backend"];

  const filteredBlogs = useMemo(() => {
    return blogsData.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesFilter = activeFilter === "All" || blog.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [blogsData, deferredSearch, activeFilter]);

  return (
<>

          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">Blogs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto bg-muted/10">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Technical Blogs</h1>
                  <p className="text-muted-foreground">Read the latest articles on web development, system design, and DSA.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search blogs..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <Filter size={16} className="text-muted-foreground mr-1" />
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background border border-border text-muted-foreground hover:bg-muted'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map(blog => {
                    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    return (
                    <Link key={blog._id || blog.id} href={`/dashboard/blogs/${slug}`} className="group h-full">
                      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/50 h-full flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                          <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-md text-foreground text-xs font-bold rounded-lg shadow-sm">
                            {blog.category}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{blog.title}</h2>
                          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4 leading-relaxed">{blog.excerpt}</p>
                          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-4 border-t border-border">
                            <span>{blog.date}</span>
                            <span className="bg-muted px-2 py-1 rounded-md">{blog.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )})}
                  
                  {filteredBlogs.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="text-muted-foreground" size={24} />
                      </div>
                      <h3 className="text-lg font-bold">No blogs found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
</>
  );
}
