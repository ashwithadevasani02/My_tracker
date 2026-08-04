const mongoose = require('mongoose');
const Flashcard = require('../models/Flashcard');
const User = require('../models/User');
const { memoryStore, activityMap: fallbackActivityMap } = require('../data/seedData');

const isDbConnected = () => mongoose.connection.readyState === 1;

const formatDateKey = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Get 365-day heat map activity grid
// @route   GET /api/analytics/heatmap
exports.getHeatmapData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    startDate.setHours(0, 0, 0, 0);

    const activityMap = {};

    if (isDbConnected()) {
      const cards = await Flashcard.find({
        $or: [
          { dateRevised: { $gte: startDate, $lte: today } },
          { 'revisionHistory.revisedAt': { $gte: startDate, $lte: today } },
        ],
      });

      cards.forEach((card) => {
        if (card.dateRevised) {
          const key = formatDateKey(card.dateRevised);
          if (!activityMap[key]) activityMap[key] = { total: 0, dsa: 0, sql: 0 };
          activityMap[key].total += 1;
          if (card.type === 'DSA') activityMap[key].dsa += 1;
          if (card.type === 'SQL') activityMap[key].sql += 1;
        }
      });
    } else {
      // In-memory activity computation
      Object.assign(activityMap, fallbackActivityMap);
      memoryStore.forEach((card) => {
        if (card.dateRevised) {
          const key = formatDateKey(card.dateRevised);
          if (!activityMap[key]) activityMap[key] = { total: 0, dsa: 0, sql: 0 };
          activityMap[key].total += 1;
          if (card.type === 'DSA') activityMap[key].dsa += 1;
          if (card.type === 'SQL') activityMap[key].sql += 1;
        }
      });
    }

    const gridDays = [];
    const curr = new Date(startDate);

    while (curr <= today) {
      const key = formatDateKey(curr);
      const activity = activityMap[key] || { total: 0, dsa: 0, sql: 0 };

      let level = 0;
      if (activity.total >= 15) level = 4;
      else if (activity.total >= 10) level = 3;
      else if (activity.total >= 5) level = 2;
      else if (activity.total >= 1) level = 1;

      gridDays.push({
        date: key,
        displayDate: curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayOfWeek: curr.getDay(),
        count: activity.total,
        dsaCount: activity.dsa,
        sqlCount: activity.sql,
        level,
      });

      curr.setDate(curr.getDate() + 1);
    }

    res.json({
      success: true,
      startDate: formatDateKey(startDate),
      endDate: formatDateKey(today),
      totalDays: gridDays.length,
      data: gridDays,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get metrics: Current Streak, Max Streak, Total Cards, Today's Goal Progress
// @route   GET /api/analytics/stats
exports.getMetricsStats = async (req, res) => {
  try {
    let totalCards = 0, dsaCardsCount = 0, sqlCardsCount = 0;
    let cards = [];

    if (isDbConnected()) {
      totalCards = await Flashcard.countDocuments();
      dsaCardsCount = await Flashcard.countDocuments({ type: 'DSA' });
      sqlCardsCount = await Flashcard.countDocuments({ type: 'SQL' });
      cards = await Flashcard.find({}, { dateRevised: 1, type: 1, revisionHistory: 1 });
    } else {
      cards = memoryStore;
      totalCards = cards.length;
      dsaCardsCount = cards.filter((c) => c.type === 'DSA').length;
      sqlCardsCount = cards.filter((c) => c.type === 'SQL').length;
    }

    const dsaTarget = 15;
    const sqlTarget = 1;

    const todayStr = formatDateKey(new Date());
    let todayDsaCount = 0, todaySqlCount = 0;

    const activeDateSet = new Set();

    cards.forEach((card) => {
      if (card.dateRevised) {
        const key = formatDateKey(card.dateRevised);
        activeDateSet.add(key);
        if (key === todayStr) {
          if (card.type === 'DSA') todayDsaCount++;
          if (card.type === 'SQL') todaySqlCount++;
        }
      }
    });

    // Also populate fallback active dates
    Object.keys(fallbackActivityMap).forEach((k) => activeDateSet.add(k));

    let currentStreak = 0;
    if (activeDateSet.size > 0) {
      const checkDate = new Date();
      // If no activity today, check if yesterday had activity (streak still active)
      if (!activeDateSet.has(formatDateKey(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      while (activeDateSet.has(formatDateKey(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    const sortedDates = Array.from(activeDateSet).sort();
    let maxStreak = 0;
    if (sortedDates.length > 0) {
      let tempStreak = 0, prevDateObj = null;
      sortedDates.forEach((dateStr) => {
        const currDateObj = new Date(dateStr);
        if (!prevDateObj) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round(Math.abs(currDateObj - prevDateObj) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) tempStreak++;
          else if (diffDays > 1) tempStreak = 1;
        }
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        prevDateObj = currDateObj;
      });
    }

    res.json({
      success: true,
      data: {
        totalCards,
        dsaCardsCount,
        sqlCardsCount,
        currentStreak,
        maxStreak,
        todayProgress: {
          dsaCount: todayDsaCount,
          dsaTarget,
          dsaPercentage: Math.min(100, Math.round((todayDsaCount / dsaTarget) * 100)),
          sqlCount: todaySqlCount,
          sqlTarget,
          sqlPercentage: Math.min(100, Math.round((todaySqlCount / sqlTarget) * 100)),
          totalToday: todayDsaCount + todaySqlCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
