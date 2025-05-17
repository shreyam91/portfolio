'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Blogs } from '@/data/Blogs';
import ThemeToggle from '@/components/ThemeToggle';

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
    <div className="max-w-5xl mx-auto px-4 py-8">
              <ThemeToggle />
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 mb-4">Read our latest updates, ideas, and insights.</p>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-4 py-2 w-64"
          />
        </div>
      </div>

      {/* Sort & Info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700">Showing {filteredBlogs.length} blogs</span>
        <select
          className="border rounded px-3 py-1"
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
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
