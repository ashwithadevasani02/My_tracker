const express = require('express');
const router = express.Router();
const {
  getFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  reviseFlashcard,
  getCategories,
} = require('../controllers/flashcardController');

router.route('/').get(getFlashcards).post(createFlashcard);
router.get('/meta/categories', getCategories);
router.route('/:id').get(getFlashcardById).put(updateFlashcard).delete(deleteFlashcard);
router.patch('/:id/revise', reviseFlashcard);

module.exports = router;
