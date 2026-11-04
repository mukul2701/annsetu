const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// GET /api/analytics - Platform statistics
router.get('/', async (req, res, next) => {
  try {
    const stats = await db.getAnalytics();
    res.json({
      success: true,
      stats
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
