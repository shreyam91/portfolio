import { getAllPosts } from '@/lib/posts';
import BlogList from '@/components/BlogList';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getAllPosts();

  return <BlogList initialPosts={posts} />;
}
