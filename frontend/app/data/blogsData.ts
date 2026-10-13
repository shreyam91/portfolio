export interface BlogItem {
  _id?: string;
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  image?: string;
  publishedAt?: string;
  sourceUrl?: string;
  mediumUrl?: string;
  slug?: string;
  source?: string;
  tags?: string[];
  published?: boolean;
}

export const initialBlogs: BlogItem[] = [
  {
    _id: "6ac78f26398fdb8c3880505b",
    title: "From API Calls to Event-Driven AI: How AI Applications Grow Beyond Simple LLM Wrappers",
    excerpt: "Most AI projects begin the exact same way: a neat UI, an API key, and a direct call to a language model. At first, it looks magic. But the moment you scale to real users, synchronous calls break down...",
    category: "AI Engineering",
    readTime: "5 min read",
    author: "Shreyam Kanaujiya",
    image: "https://miro.medium.com/v2/resize:fit:1200/1*9N-4f_c3u-f4f.png",
    publishedAt: "2026-10-09T06:57:30.000Z",
    sourceUrl: "https://medium.com/@shreyam91183/from-api-calls-to-event-driven-ai-how-ai-applications-grow-beyond-simple-llm-wrappers-23bbb7a408b8",
    mediumUrl: "https://medium.com/@shreyam91183/from-api-calls-to-event-driven-ai-how-ai-applications-grow-beyond-simple-llm-wrappers-23bbb7a408b8",
    slug: "from-api-calls-to-event-driven-ai-how-ai-applications-grow-beyond-simple-llm-wrappers",
    source: "medium",
    tags: ["AI", "Architecture", "Engineering"],
    published: true,
  },
  {
    _id: "6ac78f26398fdb8c3880505a",
    title: "I Went to Bhangarh Looking for a Haunted Fort. I Found Something Else.",
    excerpt: "If you Google Bhangarh Fort, you will read the usual things: India's most haunted place, government warnings prohibiting entry before sunrise and after sunset, and cursed ruins. But standing before it tells a very different story...",
    category: "Life & Travel",
    readTime: "4 min read",
    author: "Shreyam Kanaujiya",
    image: "https://miro.medium.com/v2/resize:fit:1200/1*4G8_jA8d29s.png",
    publishedAt: "2026-10-02T05:41:39.000Z",
    sourceUrl: "https://medium.com/@shreyam91183/i-went-to-bhangarh-looking-for-a-haunted-fort-i-found-something-else-17a9dad1e088",
    mediumUrl: "https://medium.com/@shreyam91183/i-went-to-bhangarh-looking-for-a-haunted-fort-i-found-something-else-17a9dad1e088",
    slug: "i-went-to-bhangarh-looking-for-a-haunted-fort-i-found-something-else",
    source: "medium",
    tags: ["Travel", "Life Lessons", "Reflections"],
    published: true,
  },
  {
    _id: "6abe10000e4278276c1648bb",
    title: "A Simple LinkedIn Share Button Turned Into a Backend Reliability Problem",
    excerpt: "What seemed like a trivial front-end share button quickly unmasked race conditions, rate limits, and asynchronous worker queues required to reliably syndicate content to professional networks...",
    category: "Backend Reliability",
    readTime: "4 min read",
    author: "Shreyam Kanaujiya",
    publishedAt: "2026-10-01T05:27:27.000Z",
    sourceUrl: "https://medium.com/@shreyam91183/a-simple-linkedin-share-button-turned-into-a-backend-reliability-problem-b4b16b1060e2",
    mediumUrl: "https://medium.com/@shreyam91183/a-simple-linkedin-share-button-turned-into-a-backend-reliability-problem-b4b16b1060e2",
    slug: "a-simple-linkedin-share-button-turned-into-a-backend-reliability-problem",
    source: "medium",
    tags: ["System Design", "Backend", "Web Development"],
    published: true,
  },
];
