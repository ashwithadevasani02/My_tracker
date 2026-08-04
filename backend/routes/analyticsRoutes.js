const express = require('express');
const router = express.Router();
const { getHeatmapData, getMetricsStats } = require('../controllers/analyticsController');

router.get('/heatmap', getHeatmapData);
router.get('/stats', getMetricsStats);

module.exports = router;
