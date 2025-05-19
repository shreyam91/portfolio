'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Blogs } from '@/data/Blogs';
import { FloatingNav } from '@/components/FloatingNav';
import { DotBackgroundDemo } from '@/components/ui/DotBackgroundDemo';

const ITEMS_PER_PAGE = 3;

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, sortBy]);

  const filteredBlogs = Blogs
    .filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
  <div className="relative min-h-screen">
    {/* Dot Background */}
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <DotBackgroundDemo />
    </div>

    {/* Main Content */}
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-4">Read our latest updates, ideas, and insights.</p>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-4 py-2 w-64 bg-background"
          />
        </div>
      </div>

      {/* Sort & Info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-muted-foreground">Showing {filteredBlogs.length} blogs</span>
        <select
          className="border rounded px-3 py-1 bg-background"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Blog List */}
      <div className="flex flex-col gap-6">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                slug={blog.slug}
                image={blog.image}
                title={blog.title}
                description={blog.description}
                link={blog.link}
                author={blog.author}
                date={blog.date}
              />
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-background"
        >
          Previous
        </button>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-background"
        >
          Next
        </button>
      </div>

      <FloatingNav />
    </div>
  </div>
);

}
