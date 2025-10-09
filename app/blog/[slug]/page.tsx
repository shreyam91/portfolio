import { getPostBySlug, getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { notFound } from 'next/navigation';
import { FloatingNav } from '@/components/ui/FloatingNav';
import { navItems } from '@/data';
import { DotBackgroundDemo } from '@/components/ui/DotBackgroundDemo';
import { ShareButton } from '@/components/ShareButton';
import { CodeBlockWrapper } from '@/components/CodeBlockWrapper';
import { Metadata } from 'next';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const otherPosts = (await getAllPosts()).filter((p) => p.slug !== params.slug);

  if (!post) notFound();

  console.log('Blog post author:', post.author);

  // Process code blocks in the content
  const processedContent = post.contentHtml.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      return `<div class="code-block" data-language="${language}" data-code="${encodeURIComponent(code)}"></div>`;
    }
  );

  return (
    <div className="relative min-h-screen bg-background">
      <CodeBlockWrapper />
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
              <span className="mr-4">By : <span className="font-medium">{post.author?.name || 'Shreyam'}</span></span>
              <span className="mr-4 font-medium">Published on {new Date(post.date).toLocaleDateString()}</span>
              <ShareButton 
                url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`}
                title={post.title}
              />
            </div>

            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg mb-8 shadow-lg"
            />

            <article 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-foreground
                prose-p:text-muted-foreground
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-strong:text-foreground
                prose-code:text-primary
                prose-pre:bg-muted prose-pre:text-foreground
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-lg prose-img:shadow-lg
                prose-hr:border-border"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          <aside className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Other Blogs</h2>
            <ul className="space-y-6">
              {otherPosts.map((b) => (
                <li key={b.slug} className="flex space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                    <Image 
                      src={b.image} 
                      alt={b.title} 
                      width={96}
                      height={96}
                      className="object-cover w-full h-full" 
                    />
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
      <FloatingNav navItems={navItems} />
    </div>
  );
}
