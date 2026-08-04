const mongoose = require('mongoose');
const Flashcard = require('../models/Flashcard');
const { memoryStore } = require('../data/seedData');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all flashcards with filtering & search
// @route   GET /api/flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const { type, category, difficulty, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (type && type !== 'ALL') query.type = type.toUpperCase();
      if (category && category !== 'ALL') query.category = category;
      if (difficulty && difficulty !== 'ALL') query.difficulty = difficulty;
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { title: searchRegex },
          { category: searchRegex },
          { keyInsight: searchRegex },
          { conceptNotes: searchRegex },
          { topicName: searchRegex },
          { tags: searchRegex },
        ];
      }
      const flashcards = await Flashcard.find(query).sort({ dateRevised: -1 });
      return res.json({ success: true, count: flashcards.length, data: flashcards });
    }

    // In-memory fallback
    let filtered = [...memoryStore];
    if (type && type !== 'ALL') {
      filtered = filtered.filter((c) => c.type === type.toUpperCase());
    }
    if (category && category !== 'ALL') {
      filtered = filtered.filter((c) => c.category === category);
    }
    if (difficulty && difficulty !== 'ALL') {
      filtered = filtered.filter((c) => c.difficulty === difficulty);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.keyInsight && c.keyInsight.toLowerCase().includes(q)) ||
          (c.conceptNotes && c.conceptNotes.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single flashcard
// @route   GET /api/flashcards/:id
exports.getFlashcardById = async (req, res) => {
  try {
    if (isDbConnected()) {
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
      return res.json({ success: true, data: flashcard });
    }

    const card = memoryStore.find((c) => c._id === req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new DSA or SQL flashcard
// @route   POST /api/flashcards
exports.createFlashcard = async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      difficulty,
      conceptNotes,
      keyInsight,
      problemLink,
      codeSnippet,
      topicName,
      querySyntax,
      tags,
    } = req.body;

    if (!type || !title || !category) {
      return res.status(400).json({ success: false, message: 'Type, title, and category are required' });
    }

    const cardData = {
      type,
      title,
      category,
      difficulty: difficulty || 'Medium',
      conceptNotes: conceptNotes || '',
      keyInsight: keyInsight || '',
      problemLink: problemLink || '',
      codeSnippet: codeSnippet || { language: 'cpp', code: '' },
      topicName: topicName || '',
      querySyntax: querySyntax || '',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      dateRevised: new Date(),
      masteryLevel: 1,
      revisionHistory: [{ revisedAt: new Date(), rating: 'Good' }],
    };

    if (isDbConnected()) {
      const flashcard = await Flashcard.create(cardData);
      return res.status(201).json({ success: true, data: flashcard });
    }

    const newCard = { ...cardData, _id: 'card_' + Date.now() };
    memoryStore.unshift(newCard);
    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
exports.updateFlashcard = async (req, res) => {
  try {
    if (isDbConnected()) {
      let flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
      flashcard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.json({ success: true, data: flashcard });
    }

    const idx = memoryStore.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    memoryStore[idx] = { ...memoryStore[idx], ...req.body };
    res.json({ success: true, data: memoryStore[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
exports.deleteFlashcard = async (req, res) => {
  try {
    if (isDbConnected()) {
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
      await flashcard.deleteOne();
      return res.json({ success: true, message: 'Flashcard removed' });
    }

    const idx = memoryStore.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    memoryStore.splice(idx, 1);
    res.json({ success: true, message: 'Flashcard removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log revision & feedback rating
// @route   PATCH /api/flashcards/:id/revise
exports.reviseFlashcard = async (req, res) => {
  try {
    const { rating } = req.body;
    const now = new Date();

    if (isDbConnected()) {
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
      flashcard.dateRevised = now;
      flashcard.revisionHistory.push({ revisedAt: now, rating: rating || 'Good' });
      if (rating === 'Easy' || rating === 'Good') flashcard.masteryLevel = Math.min(5, flashcard.masteryLevel + 1);
      if (rating === 'Again') flashcard.masteryLevel = Math.max(1, flashcard.masteryLevel - 1);
      await flashcard.save();
      return res.json({ success: true, data: flashcard });
    }

    const card = memoryStore.find((c) => c._id === req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    card.dateRevised = now;
    if (!card.revisionHistory) card.revisionHistory = [];
    card.revisionHistory.push({ revisedAt: now, rating: rating || 'Good' });
    if (rating === 'Easy' || rating === 'Good') card.masteryLevel = Math.min(5, card.masteryLevel + 1);
    if (rating === 'Again') card.masteryLevel = Math.max(1, card.masteryLevel - 1);

    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories & tags
// @route   GET /api/flashcards/meta/categories
exports.getCategories = async (req, res) => {
  try {
    if (isDbConnected()) {
      const dsaCategories = await Flashcard.distinct('category', { type: 'DSA' });
      const sqlCategories = await Flashcard.distinct('category', { type: 'SQL' });
      const allTags = await Flashcard.distinct('tags');
      return res.json({ success: true, data: { dsa: dsaCategories.sort(), sql: sqlCategories.sort(), tags: allTags.sort() } });
    }

    const dsaCategories = [...new Set(memoryStore.filter((c) => c.type === 'DSA').map((c) => c.category))];
    const sqlCategories = [...new Set(memoryStore.filter((c) => c.type === 'SQL').map((c) => c.category))];
    const allTags = [...new Set(memoryStore.flatMap((c) => c.tags || []))];

    res.json({ success: true, data: { dsa: dsaCategories.sort(), sql: sqlCategories.sort(), tags: allTags.sort() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
