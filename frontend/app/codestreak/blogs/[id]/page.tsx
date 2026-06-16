'use client';

import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";


import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { contentApi } from "@/lib/api";

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const [blog, setBlog] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [resolvedId, setResolvedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then(p => setResolvedId(p.id));
  }, [params]);

  React.useEffect(() => {
    if (!resolvedId) return;
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        const res = await contentApi.getBlogs();
        const data = res.data?.data || [];
        const found = data.find((b: any) => b.id === resolvedId || b._id === resolvedId);
        setBlog(found || data[0]);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadBlog();
  }, [resolvedId]);

  if (isLoading || !blog) {
    return (
      <div className="flex-1 overflow-y-auto bg-background flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
<>

          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/blogs">Blogs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold truncate max-w-[200px]">{blog.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-3xl mx-auto py-10 px-6">
              <Link href="/dashboard/blogs" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Blogs
              </Link>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">{blog.category}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-foreground">{blog.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-2"><Calendar size={16} /> {blog.date}</div>
                <div className="flex items-center gap-2"><Clock size={16} /> {blog.readTime}</div>
                <div className="flex items-center gap-2"><Tag size={16} /> By {blog.author}</div>
              </div>

              <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-sm border border-border">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
              </div>

              <div className="max-w-none text-lg text-foreground/90">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-foreground" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-loose" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/30 py-2 pr-4 rounded-r-lg my-6" {...props} />,
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
</>
  );
}
