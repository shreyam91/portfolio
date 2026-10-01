const Parser = require('rss-parser');
const Blog = require('../models/Blog');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'category'],
  }
});

const calculateReadingTime = (text) => {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return `${time} min read`;
};

const extractImage = (html) => {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, '');
};

const getExcerpt = (html) => {
  const text = stripHtml(html);
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
};

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const syncMediumBlogs = async () => {
  try {
    console.log('Starting Medium RSS sync...');
    const feed = await parser.parseURL('https://medium.com/feed/@shreyam91183');

    for (const item of feed.items) {
      const mediumId = item.guid;
      const title = item.title;
      const mediumUrl = item.link;
      const content = item['content:encoded'] || item.content;
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
      const author = item.creator || 'Shreyam';
      
      let tags = [];
      if (item.categories) {
        tags = Array.isArray(item.categories) ? item.categories : [item.categories];
      }

      const excerpt = getExcerpt(content || '');
      const markdownContent = turndownService.turndown(content || '');
      const readingTime = calculateReadingTime(stripHtml(content || ''));
      const image = extractImage(content || '');
      const category = tags.length > 0 ? tags[0] : 'Engineering';
      const slug = generateSlug(title);

      await Blog.updateOne(
        { mediumId },
        {
          $set: {
            title,
            slug,
            mediumUrl,
            content: markdownContent,
            publishedAt,
            author,
            tags,
            category,
            excerpt,
            readTime: readingTime,
            image,
            source: 'medium',
            published: true
          }
        },
        { upsert: true }
      );
    }
    console.log('Medium RSS sync completed successfully.');
  } catch (error) {
    console.error('Failed to sync Medium blogs:', error);
  }
};

module.exports = syncMediumBlogs;
