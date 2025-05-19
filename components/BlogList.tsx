'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import { FloatingNav } from '@/components/FloatingNav';
import { DotBackgroundDemo } from '@/components/ui/DotBackgroundDemo';
import { ThemeToggle } from '@/components/ThemeToggle';

const ITEMS_PER_PAGE = 3;

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
}

interface BlogListProps {
  initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = initialPosts
    .filter(blog => {
      if (!blog || !blog.title) return false;
      return blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return (a[sortBy] || '').localeCompare(b[sortBy] || '');
    });

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Dot Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <DotBackgroundDemo />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2 font-cursive text-foreground">Discover Stories, Insights, and Ideas That Matter</h1>
          <p className="text-muted-foreground mb-4 font-fantasy">Welcome to my blog — a space where I share what I'm learning, building, and thinking about. From quick dev tips and personal reflections to creative experiments, this is where I document my journey beyond the portfolio. Have a scroll — you might find something useful or inspiring!</p>
          <div className="flex justify-center gap-2">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-4 py-2 w-64 bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Sort & Info */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">Showing {filteredBlogs.length} blogs</span>
          <select
            className="border rounded px-3 py-1 bg-background text-foreground"
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
          {paginatedBlogs.map((blog) => (
            <BlogCard
              key={blog.slug}
              slug={blog.slug}
              image={blog.image}
              title={blog.title}
              description={blog.description}
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
            className="px-3 py-1 border rounded disabled:opacity-50 bg-background text-foreground hover:bg-muted"
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-background text-foreground hover:bg-muted"
          >
            Next
          </button>
        </div>

        <FloatingNav />
      </div>
    </div>
  );
} 