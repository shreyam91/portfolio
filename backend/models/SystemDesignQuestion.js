const mongoose = require('mongoose');

const systemDesignQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Medium-Hard', 'Hard'], required: true },
  category: { type: String },
  timeLimit: { type: String },
  problemStatement: { type: String },
  functionalReq: [{ type: String }],
  nonFunctionalReq: [{ type: String }],
  companies: [{ type: String }],
  status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('SystemDesignQuestion', systemDesignQuestionSchema);
