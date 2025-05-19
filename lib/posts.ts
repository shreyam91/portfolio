// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

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

export async function getPostBySlug(slug: string) {
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
      console.error(`Post ${slug} is missing required frontmatter fields`);
      return null;
    }

    // Process markdown content
    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      contentHtml,
      title: data.title,
      description: data.description || '',
      date: data.date,
      author: data.author,
      image: data.image || 'https://dummyimage.com/600x400/70c6eb/dadced&text=Blog+Image',
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const slugs = await getAllPostSlugs();
    const posts = await Promise.all(
      slugs.map(async ({ slug }) => {
        const post = await getPostBySlug(slug);
        return post;
      })
    );
    return posts.filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}
