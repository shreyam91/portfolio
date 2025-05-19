// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  slug: string;
  contentHtml: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
}

export async function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Post file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.date || !data.author) {
      console.error(`Post ${slug} is missing required frontmatter fields:`, {
        title: !!data.title,
        date: !!data.date,
        author: !!data.author,
        authorData: data.author
      });
      return null;
    }

    // Process markdown content
    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    const post = {
      slug,
      contentHtml,
      title: data.title,
      description: data.description || '',
      excerpt: data.excerpt || '',
      date: data.date,
      author: data.author,
      image: data.image || 'https://dummyimage.com/600x400/70c6eb/dadced&text=Blog+Image',
    };

    console.log(`Processed post ${slug}:`, {
      title: post.title,
      author: post.author
    });

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const slugs = await getAllPostSlugs();
    console.log('Found slugs:', slugs);
    
    const posts = await Promise.all(
      slugs.map(async ({ slug }) => {
        const post = await getPostBySlug(slug);
        return post;
      })
    );
    
    const validPosts = posts
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log('Processed posts:', validPosts.map(p => ({
      title: p.title,
      author: p.author
    })));

    return validPosts;
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}
