import { getAllPosts } from '@/lib/posts';
import BlogList from '@/components/BlogList';
import { FloatingNav } from '@/components/ui/FloatingNav';
import { navItems } from '@/data';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="relative min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <BlogList initialPosts={posts} />
      </div>
      <FloatingNav navItems={navItems} />
    </div>
  );
}
