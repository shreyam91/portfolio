const mongoose = require('mongoose');

const placementPrepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' },
  description: { type: String },
  questions: [{
    q: { type: String },
    a: { type: mongoose.Schema.Types.Mixed } // Can be string or object containing props/state arrays
  }]
}, { timestamps: true, strict: false });

module.exports = mongoose.model('PlacementPrep', placementPrepSchema);
