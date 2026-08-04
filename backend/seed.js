const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flashcard = require('./models/Flashcard');
const User = require('./models/User');

dotenv.config();

const clearDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sql_tracker';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB');

    const cardRes = await Flashcard.deleteMany({});
    const userRes = await User.deleteMany({});

    console.log(`[Seed Clean Success] Cleared ${cardRes.deletedCount} flashcards and ${userRes.deletedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

clearDatabase();
