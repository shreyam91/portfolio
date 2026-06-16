const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date
    }
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Newbie'
  },
  rankTier: {
    type: String,
    default: 'Beginner'
  },
  streakFreezeAvailable: {
    type: Boolean,
    default: true
  },
  lastActiveDate: {
    type: Date
  },
  totalProblemsSolved: {
    type: Number,
    default: 0
  },
  difficultyStats: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  categoryStats: {
    dsa: { type: Number, default: 0 },
    systemDesign: { type: Number, default: 0 },
    machineCoding: { type: Number, default: 0 }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    select: false // Exclude from query results by default for security
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add explicit indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'streak.current': -1 });
userSchema.index({ totalProblemsSolved: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 