// 'use client';

import { useParams } from 'next/navigation';
import { Blogs } from '@/data/Blogs';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Blogs.map((blog) => ({ slug: blog.slug }));
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = Blogs.find((b) => b.slug === params.slug);
  const otherBlogs = Blogs.filter((b) => b.slug !== params.slug);

if (!blog) notFound();

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen px-4 py-10 max-w-7xl mx-auto">
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Blog Content */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className="mr-4">By <span className="font-medium">{blog.author}</span></span>
            <span className="mr-4">Published on {new Date(blog.date).toLocaleDateString()}</span>
            <span>Views: {Math.floor(1000 + Math.random() * 9000)}</span>
          </div>

          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-[500px] object-cover rounded mb-6"
          />

          {/* Blog content parser (images, video, links, hashtags) */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {blog.description.split('\n\n').map((para, index) => {
              if (para.includes('http') && para.includes('video')) {
                return (
                  <video key={index} controls className="w-full rounded">
                    <source src={para.trim()} type="video/mp4" />
                  </video>
                );
              } else if (para.startsWith('http')) {
                return <img key={index} src={para.trim()} alt="" className="rounded" />;
              } else if (para.includes('#')) {
                return (
                  <p key={index}>
                    {para.split(' ').map((word, i) =>
                      word.startsWith('#') ? (
                        <span key={i} className="text-blue-600 hover:underline cursor-pointer mr-1">
                          {word}
                        </span>
                      ) : (
                        <span key={i} className="mr-1">{word}</span>
                      )
                    )}
                  </p>
                );
              } else if (para.includes('http')) {
                return (
                  <p key={index}>
                    {para.split(' ').map((word, i) =>
                      word.startsWith('http') ? (
                        <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {word}
                        </a>
                      ) : (
                        <span key={i} className="mr-1">{word}</span>
                      )
                    )}
                  </p>
                );
              } else {
                return <p key={index}>{para}</p>;
              }
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-1">
  <h2 className="text-xl font-semibold mb-4">Other Blogs</h2>
  <ul className="space-y-6">
    {otherBlogs.map((b) => (
      <li key={b.id} className="flex space-x-4">
        {/* Blog Image */}
        <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
          <img
            src={b.image}
            alt={b.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Blog Info */}
        <div className="flex flex-col justify-between">
          <Link href={`/blog/${b.slug}`} className="hover:text-blue-600">
            <div className="font-semibold text-md">{b.title}</div>
          </Link>
          <p className="text-sm text-gray-700 line-clamp-4">{b.description}</p>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(b.date).toLocaleDateString()}
          </div>
        </div>
      </li>
    ))}
  </ul>
</aside>

      </div>
    </div>
  );
}
