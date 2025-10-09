'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import { FloatingNav } from '@/components/FloatingNav';
import { DotBackgroundDemo } from '@/components/ui/DotBackgroundDemo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Post } from '@/lib/posts';

const ITEMS_PER_PAGE = 3;

interface BlogListProps {
  initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log('Initial Posts:', initialPosts);
    console.log('First post author:', initialPosts[0]?.author);
  }, [initialPosts]);

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
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // if (sortBy === 'author') {
      //   return a.author.name.localeCompare(b.author.name);
      // }
      return 0;
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
          {/* <h1 className="text-4xl font-bold mb-4 font-cursive">Build. Break. Blog</h1> */}
          <p className="text-2xl text-muted-foreground font-fantasy mt-10">
            Thoughts, tutorials, and insights from my journey in technology — sharing what I learn, build, and explore along the way.
          </p>
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
            {/* <option value="author">Sort by Author</option> */}
            <option value="date">Sort by Date</option>
          </select>
        </div>

        {/* Blog List */}
        <div className="flex flex-col gap-6">
          {paginatedBlogs.map((blog: Post) => (
            <BlogCard
              key={blog.slug}
              slug={blog.slug}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              author={blog.author.name}
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

        {/* <FloatingNav /> */}
      </div>
    </div>
  );
} 