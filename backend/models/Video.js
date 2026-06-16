const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String },
  youtubeLink: { type: String },
  title: { type: String, required: true },
  category: { type: String },
  duration: { type: String },
  views: { type: String },
  thumbnail: { type: String },
  topicTag: { type: String },
  relatedQuestion: { type: String }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Video', videoSchema);
