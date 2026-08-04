const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'LeetCode Champion' },
    email: { type: String, default: 'user@dsatracker.com' },
    dailyGoals: {
      dsaTarget: { type: Number, default: 15 },
      sqlTarget: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
