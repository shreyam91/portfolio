import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

  useEffect(() => {
    console.log('BlogCard author:', author);
  }, [author]);

  return (
    <div className="w-full bg-card text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Image */}
      <div className="relative h-48 w-60 overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              Written by: <span className="font-medium text-foreground">{author || 'Shreyam'}</span>
            </span>
            <span> Published on: {new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
