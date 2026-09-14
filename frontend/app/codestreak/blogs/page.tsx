"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { EASE, PageHeader, TagPill } from "@/components/shared/codestreak-ui";
import { contentApi } from "@/lib/api";
import { toSlug, useCodeStreakBasePath } from "@/lib/codestreak";

type Blog = {
  _id?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  author?: string;
  image?: string;
  date?: string;
};

export default function BlogsPage() {
  const basePath = useCodeStreakBasePath();
  const [items, setItems] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    async function load() {
      try {
        const res = await contentApi.getBlogs();
        const data = res.data?.data ?? res.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const b of items) {
      if (b.category) set.add(b.category);
    }
    return ["All", ...[...set].sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return items.filter((blog) => {
      if (category !== "All" && blog.category !== category) return false;
      if (!q) return true;
      return `${blog.title} ${blog.excerpt} ${blog.category}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, category, deferredSearch]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <PageHeader
          eyebrow="Blogs"
          title="Notes &"
          titleAccent="technical writing"
          subtitle="Long-form pieces on system design, engineering practice and interviews. Written as I work through the material."
        />

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-colors ${
                    active
                      ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#3b82f6]/40 hover:text-[#3b82f6]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-72 md:ml-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-sm text-[#1a1a1a] dark:text-[#fcfcfc] outline-none focus:border-[#3b82f6]/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              No articles found. Try a different filter.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((blog, i) => (
              <motion.div
                key={blog._id ?? toSlug(blog.title)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
              >
                <Link
                  href={`${basePath}/blogs/${toSlug(blog.title)}`}
                  className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] overflow-hidden hover:border-[#3b82f6]/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-white/5">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title ?? ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 font-serif italic text-2xl">
                        {blog.title?.charAt(0) ?? "B"}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {blog.category && (
                        <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                          {blog.category}
                        </TagPill>
                      )}
                    </div>
                    <h3 className="text-base font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="mt-3 text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        {blog.author && (
                          <span className="font-mono">{blog.author}</span>
                        )}
                        {blog.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-[#3b82f6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Read <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
