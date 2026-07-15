const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  pages: { type: Number },
  size: { type: String },
  lastUpdated: { type: String },
  featured: { type: Boolean, default: false },
  downloadUrl: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
