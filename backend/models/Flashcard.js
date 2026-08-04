const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['DSA', 'SQL'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    conceptNotes: {
      type: String,
      default: '',
    },
    dateRevised: {
      type: Date,
      default: Date.now,
      index: true,
    },
    revisionHistory: [
      {
        revisedAt: { type: Date, default: Date.now },
        rating: { type: String, enum: ['Again', 'Hard', 'Good', 'Easy'], default: 'Good' },
      },
    ],
    masteryLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 1,
    },

    // DSA Specific Fields
    keyInsight: {
      type: String,
      default: '',
    },
    problemLink: {
      type: String,
      default: '',
    },
    codeSnippet: {
      language: { type: String, default: 'cpp' },
      code: { type: String, default: '' },
    },

    // SQL Specific Fields
    topicName: {
      type: String,
      default: '',
    },
    querySyntax: {
      type: String,
      default: '',
    },

    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

flashcardSchema.index({ dateRevised: -1, type: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
