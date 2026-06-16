const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 25
  },
  completed: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});

const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

module.exports = Pomodoro; 