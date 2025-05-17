import Link from 'next/link';
import React from 'react';

interface BlogCardProps {
  id: number;
  slug: string; // 👈 ADD this
  image: string;
  title: string;
  description: string;
  author: string;
  date: string;
}


// ✂️ Truncate to first 180 words (adjust as needed)
const truncateWords = (text: string, wordLimit: number): string => {
  const words = text.trim().split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '…'
    : text;
};

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  slug,
  title,
  description,
  author,
  date,
}) => (
  <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
    {/* Image */}
    <div className="md:w-1/3 w-full aspect-[3/2]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col justify-between md:w-2/3">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">
          {truncateWords(description, 180)} {/* 👈 shows only ~150–200 words */}
        </p>
        <div className="text-sm text-gray-500 flex items-center gap-4 flex-wrap">
          <span>Published by: <span className="font-medium">{author}</span></span>
          <span>on {new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/blog/${slug}`} className="text-blue-600 hover:underline font-medium">
  Read More →
</Link>


      </div>
    </div>
  </div>
);

export default BlogCard;
