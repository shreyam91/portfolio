import Link from 'next/link';
import React, { useState } from 'react';

interface BlogCardProps {
  slug: string;
  image: string;
  title: string;
  description: string;
  author: string;
  date: string;
  link?: string;
}

const DUMMY_IMAGE = 'https://dummyimage.com/600x400/70c6eb/dadced&text=image+not+available';

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
  link,
}) => {
  const [imgSrc, setImgSrc] = useState(image && image.trim() !== '' ? image : DUMMY_IMAGE);

  return (
    <div className="w-full bg-card text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Image */}
      <div className="md:w-1/3 w-full aspect-[3/2] relative overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={() => setImgSrc(DUMMY_IMAGE)}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between md:w-2/3">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-foreground hover:text-primary transition-colors duration-300">{title}</h2>
          <p className="text-muted-foreground mb-2">
            {truncateWords(description, 30)}
          </p>
          <Link 
            href={link || `/blog/${slug}`} 
            className="text-primary hover:text-primary/80 hover:underline font-medium inline-block mb-4 transition-colors duration-300"
          >
            Read More →
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
            <span>
              Published by: <span className="font-medium text-foreground">{author}</span>
            </span>
            <span>on {new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
