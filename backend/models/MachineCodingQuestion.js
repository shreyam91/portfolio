const mongoose = require('mongoose');

const machineCodingQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String },
  timeLimit: { type: String },
  problemStatement: { type: String },
  requirements: [{ type: String }],
  apiContracts: [{
    endpoint: { type: String },
    method: { type: String },
    description: { type: String }
  }],
  evaluationCriteria: { type: mongoose.Schema.Types.Mixed },
  companies: [{ type: String }],
  status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('MachineCodingQuestion', machineCodingQuestionSchema);
