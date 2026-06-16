const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  longDescription: { type: String },
  tags: [{ type: String }],
  github: { type: String },
  live: { type: String },
  featured: { type: Boolean, default: false },
  year: { type: String },
  status: { type: String },
  role: { type: String },
  team: { type: String }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Project', projectSchema);
