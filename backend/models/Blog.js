const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  readTime: { type: String },
  image: { type: String },
  author: { type: String },
  content: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  sourceUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  source: {
    type: String,
    default: "manual"
  },
  publishedAt: {
    type: Date
  }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Blog', blogSchema);
