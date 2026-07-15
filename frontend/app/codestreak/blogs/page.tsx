"use client";

import React, { useState, useDeferredValue, useMemo } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Clock,
  BookOpen,
  Code2,
  Database,
  Cloud,
  Zap,
  Target,
  Briefcase,
  TerminalSquare,
  Wrench,
  Mail,
  Newspaper,
  LayoutTemplate,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All");
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        const { contentApi } = await import("@/lib/api");
        const res = await contentApi.getBlogs();
        setBlogsData(res.data?.data || res.data || []);
      } catch (err) {
        // Dummy data for visual presentation if API fails
        setBlogsData([
          {
            _id: "1",
            title: "Designing Scalable APIs",
            excerpt: "Learn the core principles of building robust, scalable APIs that serve millions of users with minimal latency.",
            category: "System Design",
            date: "Jul 10, 2026",
            readTime: "8 min read",
            author: "Alex Developer",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
          },
          {
            _id: "2",
            title: "Dynamic Programming Made Simple",
            excerpt: "Break down complex DP problems into manageable steps with this comprehensive beginner guide.",
            category: "DSA",
            date: "Jul 12, 2026",
            readTime: "12 min read",
            author: "Sarah Code",
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
          },
          {
            _id: "3",
            title: "Understanding Redis Caching",
            excerpt: "A deep dive into how Redis works under the hood and best practices for caching in distributed systems.",
            category: "Backend",
            date: "Jul 14, 2026",
            readTime: "6 min read",
            author: "Chris System",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
          },
          {
            _id: "4",
            title: "SOLID Principles Explained",
            excerpt: "Write cleaner, more maintainable object-oriented code by mastering the SOLID design principles.",
            category: "Architecture",
            date: "Jul 15, 2026",
            readTime: "10 min read",
            author: "Jane Architect",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
          },
          {
            _id: "5",
            title: "Building Splitwise in Java",
            excerpt: "A machine coding walkthrough of implementing an expense sharing application from scratch.",
            category: "Machine Coding",
            date: "Jul 05, 2026",
            readTime: "15 min read",
            author: "Mike Backend",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          },
          {
            _id: "6",
            title: "Graph Algorithms Explained",
            excerpt: "From BFS to Dijkstra, understand the most important graph algorithms for your next technical interview.",
            category: "DSA",
            date: "Jun 28, 2026",
            readTime: "14 min read",
            author: "Sarah Code",
            image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const categories = [
    "All",
    "DSA",
    "System Design",
    "Machine Coding",
    "Interview Experience",
    "Java",
    "Python",
    "JavaScript",
    "Career",
    "Engineering",
    "Architecture",
    "Design Patterns",
  ];

  const topics = [
    { name: "DSA", icon: BookOpen },
    { name: "System Design", icon: LayoutTemplate },
    { name: "Machine Coding", icon: TerminalSquare },
    { name: "Design Patterns", icon: Code2 },
    { name: "Cloud", icon: Cloud },
    { name: "Databases", icon: Database },
    { name: "Performance", icon: Zap },
    { name: "Interview Tips", icon: Target },
    { name: "Career Growth", icon: Briefcase },
    { name: "Software Eng", icon: Wrench },
  ];

  const collections = [
    { title: "30 Days of DSA", count: "30 Articles", desc: "A structured path to master data structures." },
    { title: "System Design Masterclass", count: "12 Articles", desc: "Learn to design scalable architectures." },
    { title: "Low-Level Design", count: "8 Articles", desc: "Object-oriented design patterns and practices." },
    { title: "Backend Engineering", count: "15 Articles", desc: "Roadmap to becoming a senior backend dev." },
  ];

  const filteredBlogs = useMemo(() => {
    return blogsData.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        blog.category?.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesFilter =
        activeFilter === "All" || blog.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [blogsData, deferredSearch, activeFilter]);

  // For the editorial layout, we slice the filtered blogs (if enough exist)
  const isDefaultView = !deferredSearch && activeFilter === "All";
  
  const featuredArticle = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const trendingArticles = isDefaultView && filteredBlogs.length > 3 ? filteredBlogs.slice(1, 4) : [];
  const editorsPicks = isDefaultView && filteredBlogs.length > 5 ? filteredBlogs.slice(4, 6) : [];
  const latestArticles = isDefaultView ? filteredBlogs.slice(6) : filteredBlogs;

  const getSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <>
      <DashboardNavbar />

      <div className="flex flex-col flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen text-foreground font-sans">
        
        {/* Hero Section */}
        <div className="pt-20 pb-12 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground font-serif">
              Developer Journal
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
              Explore articles, engineering insights, interview guides, architecture deep dives, and coding best practices.
            </p>

            <div className="relative w-full max-w-3xl mb-10 group">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-indigo-600"
                size={22}
              />
              <input
                type="text"
                placeholder="Search articles, topics, technologies, or interview guides..."
                className="relative w-full pl-16 pr-6 py-5 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] text-lg outline-none transition-all shadow-sm focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === cat
                      ? "bg-foreground text-background shadow-md"
                      : "bg-transparent border border-black/10 dark:border-white/10 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full py-8 space-y-24">
          
          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* Empty State */
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Newspaper className="text-muted-foreground/50 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No articles found.</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any articles matching your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Browse All Articles
              </button>
            </div>
          ) : (
            <>
              {/* Editorial Layout for Default View */}
              {isDefaultView && (
                <>
                  {/* Featured Article */}
                  {featuredArticle && (
                    <Link
                      href={`/codestreak/blogs/${getSlug(featuredArticle.title)}`}
                      className="group block relative rounded-[24px] overflow-hidden bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto overflow-hidden">
                          <Image
                            src={featuredArticle.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Featured
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20"></span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {featuredArticle.category}
                            </span>
                          </div>
                          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-indigo-600 transition-colors font-serif">
                            {featuredArticle.title}
                          </h2>
                          <p className="text-lg text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                            {featuredArticle.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                                {featuredArticle.author?.charAt(0) || "A"}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{featuredArticle.author || "Author"}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                  <span>{featuredArticle.date}</span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {featuredArticle.readTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Trending & Editor's Picks */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Trending This Week */}
                    {trendingArticles.length > 0 && (
                      <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                          <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-2xl font-bold tracking-tight font-serif">Trending This Week</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {trendingArticles.map((blog) => (
                            <Link
                              key={blog._id}
                              href={`/codestreak/blogs/${getSlug(blog.title)}`}
                              className="group flex flex-col bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                              <div className="h-48 relative overflow-hidden">
                                <Image
                                  src={blog.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                                  alt={blog.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground">
                                  {blog.category}
                                </div>
                              </div>
                              <div className="p-6 flex flex-col flex-1">
                                <h4 className="font-bold text-xl mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                  {blog.title}
                                </h4>
                                <div className="flex items-center justify-between mt-auto pt-4 text-xs font-semibold text-muted-foreground">
                                  <span>{blog.date}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {blog.readTime}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Editor's Picks */}
                    {editorsPicks.length > 0 && (
                      <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-2xl font-bold tracking-tight font-serif">Editor's Picks</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                          {editorsPicks.map((blog, idx) => (
                            <Link
                              key={blog._id}
                              href={`/codestreak/blogs/${getSlug(blog.title)}`}
                              className="group flex gap-4 items-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-3 -mx-3 rounded-[16px] transition-colors"
                            >
                              <div className="text-4xl font-serif font-bold text-black/10 dark:text-white/10 group-hover:text-indigo-600/20 transition-colors">
                                0{idx + 1}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                  {blog.category}
                                </div>
                                <h4 className="font-bold text-base group-hover:text-indigo-600 transition-colors leading-tight">
                                  {blog.title}
                                </h4>
                                <div className="text-xs text-muted-foreground mt-2 font-medium">
                                  {blog.readTime}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Browse by Topic */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold tracking-tight font-serif text-center">Browse by Topic</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {topics.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <button
                            key={topic.name}
                            onClick={() => {
                              setSearch(topic.name);
                            }}
                            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] hover:border-indigo-500/40 hover:shadow-md transition-all group"
                          >
                            <Icon className="w-8 h-8 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                            <span className="font-semibold text-sm group-hover:text-indigo-600 transition-colors text-center">
                              {topic.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Collections */}
                  {/* <div className="space-y-8">
                    <h3 className="text-2xl font-bold tracking-tight font-serif">Learning Collections</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {collections.map((collection) => (
                        <div
                          key={collection.title}
                          className="group relative p-6 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-3 py-1 rounded-full">
                            {collection.count}
                          </div>
                          <h4 className="font-bold text-xl mb-2">{collection.title}</h4>
                          <p className="text-sm text-muted-foreground mb-6">
                            {collection.desc}
                          </p>
                          <span className="text-sm font-bold flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                            Explore <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </>
              )}

              {/* Latest / All Articles Grid */}
              <div className="space-y-8 pt-10">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                  <h3 className="text-2xl font-bold tracking-tight font-serif">
                    {isDefaultView ? "Latest Articles" : "Search Results"}
                  </h3>
                  {!isDefaultView && (
                    <span className="text-sm font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
                      {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestArticles.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/codestreak/blogs/${getSlug(blog.title)}`}
                      className="group flex flex-col bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <Image
                          src={blog.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground">
                          {blog.category}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="font-bold text-xl mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{blog.author || "Author"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {blog.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}


        </div>
      </div>
    </>
  );
}
