const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  excerpt: { type: String },
  category: { type: String },
  readTime: { type: String },
  image: { type: String },
  author: { type: String },
  content: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  mediumId: { type: String, unique: true, sparse: true },
  mediumUrl: { type: String },
  source: { type: String, default: "medium" },
  publishedAt: { type: Date }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Blog', blogSchema);
