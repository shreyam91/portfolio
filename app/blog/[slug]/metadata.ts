import { Metadata } from 'next';
import { Blogs } from '@/data/Blogs';

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const blog = Blogs.find((b) => b.slug === params.slug);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.description.slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.description.slice(0, 160),
      images: [
        {
          url: blog.image,
          width: 800,
          height: 600,
          alt: blog.title,
        },
      ],
    },
  };
}
