const Parser = require('rss-parser');
const cron = require('node-cron');
const Blog = require('../../models/Blog');
const logger = require('../utils/logger');
const env = require('../config/env');

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'dcCreator'],
    ],
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PortfolioBot/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8',
  },
  timeout: 10000,
});

/**
 * Clean & normalize URL by stripping tracking query parameters
 */
function normalizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.search = '';
    return parsed.toString();
  } catch {
    return url.split('?')[0].trim();
  }
}

/**
 * Extract hero image or thumbnail from RSS item, ignoring Medium tracking pixel
 */
function extractImage(item) {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  const content = item.contentEncoded || item.content || item.description || '';
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
  for (const m of matches) {
    const src = m[1];
    if (src && !src.includes('medium.com/_/stat')) {
      return src;
    }
  }
  return null;
}

/**
 * Estimate read time from content
 */
function calculateReadTime(text) {
  if (!text) return '3 min read';
  const clean = text.replace(/<[^>]*>/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Convert HTML content from Medium RSS into clean Markdown
 */
function htmlToMarkdown(html) {
  if (!html) return '';
  let md = html;
  // Remove Medium stat tracking pixel
  md = md.replace(/<img[^>]+medium\.com\/_\/stat[^>]*>/gi, '');
  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n');
  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n\n> $1\n\n');
  // Pre / Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n\n```\n$1\n```\n\n');
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n\n```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
  // Bold / Italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');
  // Links
  md = md.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  // Images
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '\n\n![$2]($1)\n\n');
  md = md.replace(/<img[^>]+alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi, '\n\n![$1]($2)\n\n');
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, '\n\n![]($1)\n\n');
  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');
  // Paragraphs & line breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  md = md.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  // Normalize extra empty lines
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

/**
 * Clean excerpt string without HTML or redundant spacing
 */
function cleanExcerpt(snippet, content) {
  if (snippet && typeof snippet === 'string') {
    const clean = snippet.replace(/<[^>]*>/g, '').trim();
    if (clean) return clean.length > 250 ? `${clean.slice(0, 247)}...` : clean;
  }
  if (content && typeof content === 'string') {
    const clean = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (clean) return clean.length > 250 ? `${clean.slice(0, 247)}...` : clean;
  }
  return '';
}

/**
 * Synchronize Medium articles into MongoDB Blog collection
 */
async function syncMedium(customRssUrl = null) {
  const rssUrl = customRssUrl || env.mediumRssUrl || process.env.MEDIUM_RSS_URL;
  if (!rssUrl) {
    logger.warn('Medium sync skipped: MEDIUM_RSS_URL is not configured');
    return {
      total: 0,
      created: 0,
      updated: 0,
      skipped: true,
      message: 'MEDIUM_RSS_URL is not configured'
    };
  }

  logger.info('Medium sync started');

  try {
    const feed = await parser.parseURL(rssUrl);
    const items = feed.items || [];
    let created = 0;
    let updated = 0;

    for (const item of items) {
      const rawUrl = item.link || item.guid || '';
      const sourceUrl = normalizeUrl(rawUrl);
      if (!sourceUrl) continue;

      const title = (item.title || 'Untitled Post').trim();
      const rawContent = item.contentEncoded || item.content || item.description || '';
      const content = htmlToMarkdown(rawContent) || rawContent || title;
      const excerpt = cleanExcerpt(item.contentSnippet, rawContent);
      const author = item.creator || item.dcCreator || feed.title || 'Medium Author';
      const publishedAt = item.pubDate
        ? new Date(item.pubDate)
        : (item.isoDate ? new Date(item.isoDate) : new Date());
      const image = extractImage(item);
      const tags = Array.isArray(item.categories) ? item.categories : [];
      const readTime = calculateReadTime(content);

      const updateData = {
        title,
        excerpt,
        content,
        author,
        category: 'Medium',
        source: 'medium',
        published: true,
        publishedAt,
        sourceUrl,
        tags,
        readTime,
      };

      if (image) {
        updateData.image = image;
      }

      try {
        // Match existing document by sourceUrl, rawUrl, mediumUrl, or title (prevents duplicates with legacy posts)
        const cleanBase = sourceUrl.split('?')[0];
        const existing = await Blog.findOne({
          $or: [
            { sourceUrl },
            { sourceUrl: rawUrl },
            { mediumUrl: rawUrl },
            { mediumUrl: { $regex: cleanBase } },
            { title }
          ]
        });

        if (existing) {
          await Blog.updateOne({ _id: existing._id }, { $set: updateData });
          updated++;
        } else {
          const res = await Blog.updateOne(
            { sourceUrl },
            {
              $set: updateData,
              $setOnInsert: {
                createdAt: publishedAt || new Date()
              }
            },
            { upsert: true }
          );

          if (res.upsertedCount > 0 || res.upsertedId) {
            created++;
          } else {
            updated++;
          }
        }
      } catch (upsertError) {
        if (upsertError.code === 11000) {
          // Handled duplicate key safely
          await Blog.updateOne({ sourceUrl }, { $set: updateData });
          updated++;
        } else {
          logger.warn(`Failed to sync item "${title}": ${upsertError.message}`);
        }
      }
    }

    logger.info(`Medium sync completed: created=${created} updated=${updated}`);
    return {
      total: items.length,
      created,
      updated
    };
  } catch (error) {
    logger.error(`Medium sync failed: ${error.message}`, error);
    return {
      total: 0,
      created: 0,
      updated: 0,
      error: error.message
    };
  }
}

let isJobScheduled = false;


function initMediumCron() {
  if (isJobScheduled) return;
  isJobScheduled = true;

  if (process.env.NODE_ENV === 'test') {
    return;
  }

  // Schedule sync every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      await syncMedium();
    } catch (err) {
      logger.error(`Medium sync failed: ${err.message}`, err);
    }
  });

  // Initial sync asynchronously on startup if MEDIUM_RSS_URL is set
  if (env.mediumRssUrl || process.env.MEDIUM_RSS_URL) {
    setImmediate(async () => {
      try {
        await syncMedium();
      } catch (err) {
        logger.error(`Initial Medium sync failed: ${err.message}`, err);
      }
    });
  }
}

module.exports = {
  syncMedium,
  initMediumCron
};
