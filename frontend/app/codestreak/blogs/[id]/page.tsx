"use client";

import React, { useState, useEffect, useMemo, useRef, use } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check, Copy, Book, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { contentApi } from "@/lib/api";
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import { Avatar } from "radix-ui";

function extractHeadings(markdown: string) {
  const regex = /^(#{2,3})\s+(.*)/gm;
  let match;
  const headings = [];
  while ((match = regex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    });
  }
  return headings;
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const [blog, setBlog] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);
  const [progress, setProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!resolvedParams.id) return;
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        const res = await contentApi.getBlogs();
        const data = res.data?.data || [];
        
        // Find matching item (by matching id or converting title to slug to match resolvedParams.id)
        const found = data.find((item: any) => 
          item.id?.toString() === resolvedParams.id || 
          item._id === resolvedParams.id ||
          item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === resolvedParams.id
        );
        
        if (found) {
          setBlog(found);
          // Set some related blogs (excluding the current one)
          setRelatedBlogs(data.filter((b: any) => b.id !== found.id && b._id !== found._id).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlog();
  }, [resolvedParams.id]);

  // Scroll Progress and Intersection Observer for TOC
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setProgress((currentScroll / totalHeight) * 100);

      // Find active heading
      const headings = Array.from(document.querySelectorAll("h2[id], h3[id]"));
      let active = "";
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          active = heading.id;
        }
      }
      if (active) setActiveHeadingId(active);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  const headings = useMemo(() => {
    if (!blog?.content) return [];
    return extractHeadings(blog.content);
  }, [blog]);

  if (isLoading) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <DashboardNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <DashboardNavbar />
        <div className="flex-1 flex justify-center items-center text-muted-foreground">
          Blog post not found
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans text-foreground">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-black/5 dark:bg-white/5">
        <div className="h-full bg-indigo-500 transition-all duration-150 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <DashboardNavbar />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Spacer (Desktop) */}
        <div className="hidden lg:block w-48 shrink-0">
          <Link href="/codestreak/blogs" className="fixed top-32 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
            <div className="p-2 rounded-full bg-muted group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Blogs
          </Link>
        </div>

        {/* Main Content Column */}
        <div className="flex-1 max-w-[700px] mx-auto w-full" ref={contentRef}>
          {/* Mobile Back Button */}
          <Link href="/codestreak/blogs" className="lg:hidden flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                {blog.category || "Engineering"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
              {blog.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {blog.summary || "An insightful look into modern software engineering practices."}
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-black/10 dark:border-white/10 overflow-hidden">
                {blog.authorAvatar ? (
                  <img src={blog.authorAvatar} alt={blog.author} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-700 font-bold text-sm">{blog.author?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold">{blog.author || "Guest Author"}</span>
                <div className="flex items-center gap-2">
                  <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{blog.readTime || "5 min read"}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="w-full h-[300px] md:h-[450px] rounded-[24px] overflow-hidden mb-16 shadow-lg border border-black/10 dark:border-white/10">
            <img src={blog.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"} alt={blog.title} className="w-full h-full object-cover" />
          </div>

          {/* Markdown Content */}
          <article className="prose prose-lg dark:prose-invert prose-indigo max-w-none 
            prose-headings:font-extrabold prose-headings:tracking-tight
            prose-p:leading-[1.8] prose-p:text-foreground/90
            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-foreground
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:my-2
            mb-24
          ">
            <ReactMarkdown
              components={{
                h2: ({ node, children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                  return <h2 id={id} className="text-3xl mt-16 mb-6 scroll-m-24" {...props}>{children}</h2>;
                },
                h3: ({ node, children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                  return <h3 id={id} className="text-2xl mt-10 mb-4 scroll-m-24" {...props}>{children}</h3>;
                },
                p: ({ node, children, ...props }) => {
                  const text = String(children);
                  // Render custom callouts
                  if (text.startsWith("💡 **Tip:**") || text.startsWith("💡 Tip:")) {
                    return (
                      <div className="my-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4 items-start">
                        <div className="text-blue-500 text-xl shrink-0 mt-1">💡</div>
                        <div className="text-blue-700 dark:text-blue-300 text-base leading-relaxed m-0">{children}</div>
                      </div>
                    );
                  }
                  if (text.startsWith("⚠️ **Important:**") || text.startsWith("⚠️ Important:")) {
                    return (
                      <div className="my-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
                        <div className="text-amber-500 text-xl shrink-0 mt-1">⚠️</div>
                        <div className="text-amber-700 dark:text-amber-300 text-base leading-relaxed m-0">{children}</div>
                      </div>
                    );
                  }
                  if (text.startsWith("❌ **Common Mistake:**") || text.startsWith("❌ Common Mistake:")) {
                    return (
                      <div className="my-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-start">
                        <div className="text-red-500 text-xl shrink-0 mt-1">❌</div>
                        <div className="text-red-700 dark:text-red-300 text-base leading-relaxed m-0">{children}</div>
                      </div>
                    );
                  }
                  if (text.startsWith("🚀 **Best Practice:**") || text.startsWith("🚀 Best Practice:")) {
                    return (
                      <div className="my-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-4 items-start">
                        <div className="text-emerald-500 text-xl shrink-0 mt-1">🚀</div>
                        <div className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed m-0">{children}</div>
                      </div>
                    );
                  }
                  return <p className="mb-6" {...props}>{children}</p>;
                },
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !String(children).includes('\n');
                  if (isInline) {
                    return <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[0.9em] text-indigo-600 dark:text-indigo-400 before:content-none after:content-none" {...props}>{children}</code>;
                  }
                  const codeString = String(children).replace(/\n$/, "");
                  return (
                    <div className="my-8 rounded-2xl overflow-hidden bg-[#111] border border-black/10 dark:border-white/10 shadow-lg group relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-wider">{match ? match[1] : "code"}</span>
                        <button 
                          onClick={() => handleCopyCode(codeString)}
                          className="text-white/40 hover:text-white transition-colors p-1"
                        >
                          {copiedCode === codeString ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="p-6 overflow-x-auto text-sm font-mono leading-loose text-white/90 bg-transparent m-0">
                        <code className={className} {...props}>{codeString}</code>
                      </pre>
                    </div>
                  );
                },
                pre: ({ children }) => <>{children}</> // Handled by custom code block above
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </article>

          {/* Author Card & Share */}
          <div className="border-t border-b border-black/10 dark:border-white/10 py-12 my-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border-2 border-indigo-500/20 overflow-hidden">
                {blog.authorAvatar ? (
                  <img src={blog.authorAvatar} alt={blog.author} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-700 font-extrabold text-2xl">{blog.author?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="flex flex-col text-center md:text-left">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Written By</span>
                <h3 className="text-2xl font-bold text-foreground mb-3">{blog.author || "Guest Author"}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mb-4">
                  {blog.authorBio || "A passionate software engineer sharing technical insights and modern web development practices."}
                </p>
                <button className="px-5 py-2.5 bg-muted hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-sm font-bold transition-colors w-fit mx-auto md:mx-0">
                  More from {blog.author?.split(' ')[0] || "Author"}
                </button>
              </div>
            </div>

            {/* <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Follow Writer On</span>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-muted hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><Github className="w-5 h-5" />https://github.com/shreyam91</button>
                <button className="p-3 bg-muted hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><Linkedin className="w-5 h-5" /></button>
                <button className="p-3 bg-muted hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><SiLeetcode className="w-5 h-5" /></button>
                <button className="p-3 bg-muted hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><SiGeeksforgeeks className="w-5 h-5" /></button>
                
                <button onClick={handleCopyLink} className="p-3 bg-muted hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-500" /> : <LinkIcon className="w-5 h-5" />}
                </button>
              </div>
            </div> */}
          </div>
          
        </div>

        {/* Right Sidebar (TOC) */}
        <div className="hidden lg:block w-[250px] shrink-0 relative">
          <div className="sticky top-32">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">On this page</h4>
            <nav className="flex flex-col gap-3">
              {headings.length === 0 && <span className="text-sm text-muted-foreground">No headings found.</span>}
              {headings.map((heading: any, idx) => (
                <a 
                  key={idx} 
                  href={`#${heading.id}`}
                  className={`text-sm transition-colors block ${heading.level === 3 ? "pl-4" : ""} ${
                    activeHeadingId === heading.id 
                      ? "text-indigo-600 dark:text-indigo-400 font-bold" 
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Continue Reading */}
      <div className="bg-card dark:bg-[#0a0a0a] border-t border-black/10 dark:border-white/10 py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((b) => (
              <Link key={b.id || b._id} href={`/codestreak/blogs/${b.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}`} className="group block">
                <div className="w-full h-48 bg-muted rounded-[20px] mb-6 overflow-hidden border border-black/10 dark:border-white/10 relative">
                  {b.coverImage ? (
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                      <Book className="w-8 h-8 text-indigo-500/50" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 block">{b.category || "General"}</span>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{b.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{b.summary}</p>
              </Link>
            ))}
            {relatedBlogs.length === 0 && (
              <div className="col-span-3 text-center text-muted-foreground">
                No related blogs found.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
