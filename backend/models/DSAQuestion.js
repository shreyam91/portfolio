const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String },
  problemStatement: { type: String },
  description: { type: String },
  pattern: { type: mongoose.Schema.Types.Mixed },
  constraints: [{ type: mongoose.Schema.Types.Mixed }],
  examples: { type: mongoose.Schema.Types.Mixed },
  companies: [{ type: String }],
  status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' },
  hints: { type: mongoose.Schema.Types.Mixed },
  approaches: { type: mongoose.Schema.Types.Mixed },
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
  patternExplanation: { type: mongoose.Schema.Types.Mixed },
  complexityBreakdown: { type: mongoose.Schema.Types.Mixed },
  edgeCases: { type: mongoose.Schema.Types.Mixed },
  followUpQuestions: { type: mongoose.Schema.Types.Mixed },
  notes: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('DSAQuestion', dsaQuestionSchema);
