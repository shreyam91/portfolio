const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  code: { type: String },
  language: { type: String },
  submissionId: { type: String },
  status: { type: mongoose.Schema.Types.Mixed }, // LC: number (10), GFG: number (1)
  viewMode: { type: String }, // GFG: "correct"
  runtime: { type: String },
  testCases: { type: mongoose.Schema.Types.Mixed },
  submittedAt: { type: String },
  githubPath: { type: String } // Built from GITHUB_BASE + slug + solution.ext
}, { _id: false });

const dsaQuestionSchema = new mongoose.Schema({
  // Source identification
  platform: { type: String, enum: ['leetcode', 'gfg'], required: true },
  pid: { type: String, required: true }, // LC: frontendId, GFG: problem.pid
  slug: { type: String, required: true },
  title: { type: String, required: true },
  problemUrl: { type: String },

  // Problem details
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  description: { type: String }, // LC: HTML from description, GFG: statement
  examples: { type: mongoose.Schema.Types.Mixed }, // GFG: array of {input, output, explanation}
  inputFormat: { type: mongoose.Schema.Types.Mixed }, // GFG only: { arguments, datatype }
  constraints: { type: mongoose.Schema.Types.Mixed }, // LC embedded in HTML, GFG: array of entries
  expectedTimeComplexity: { type: String }, // GFG complexity.time
  expectedAuxiliarySpace: { type: String }, // GFG complexity.auxiliarySpace

  // Tags
  topics: [{ type: String }], // LC: problem.topics, GFG: tagList.topicTags
  companies: [{ type: String }], // GFG: tagList.companyTags

  // Submission from DSAForge
  submission: submissionSchema,

  // Status field for compatibility
  status: { type: String, enum: ['solved', 'unsolved'], default: 'solved' }
}, { timestamps: true, strict: false });

// Compound unique index for deduplication
dsaQuestionSchema.index({ platform: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('DSAQuestion', dsaQuestionSchema);