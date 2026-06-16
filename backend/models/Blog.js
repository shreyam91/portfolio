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
  published: { type: Boolean, default: false }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Blog', blogSchema);
