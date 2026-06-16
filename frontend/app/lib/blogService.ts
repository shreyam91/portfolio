import { blogs } from '@/app/data/blogsData';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  topics?: string[];
  content: string;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogs.find(blog => blog.slug === slug);
}

export function getAllBlogs(): BlogPost[] {
  return blogs;
}

export function getAllSlugs(): { slug: string }[] {
  return blogs.map(blog => ({
    slug: blog.slug
  }));
}
