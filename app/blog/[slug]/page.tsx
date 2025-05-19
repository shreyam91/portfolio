import { getPostBySlug, getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { notFound } from 'next/navigation';
import { FloatingNav } from '@/components/FloatingNav';
import { DotBackgroundDemo } from '@/components/ui/DotBackgroundDemo';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const otherPosts = (await getAllPosts()).filter((p) => p.slug !== params.slug);

  if (!post) notFound();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Dot Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <DotBackgroundDemo />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6">
              <span className="mr-4">By <span className="font-medium">{post.author}</span></span>
              <span className="mr-4">Published on {new Date(post.date).toLocaleDateString()}</span>
            </div>

            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-[500px] object-cover rounded mb-6"
            />

            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>

          <aside className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Other Blogs</h2>
            <ul className="space-y-6">
              {otherPosts.map((b) => (
                <li key={b.slug} className="flex space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                    <img src={b.image} alt={b.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <Link href={`/blog/${b.slug}`} className="hover:text-primary">
                      <div className="font-semibold text-md text-foreground">{b.title}</div>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-4">{b.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
      <FloatingNav />
    </div>
  );
}
