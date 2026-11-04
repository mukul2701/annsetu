const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// POST /api/seed/reset - Reset and seed database
router.post('/reset', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.SEED_RESET_ENABLED !== 'true') {
      return res.status(404).json({ success: false, message: 'Seed reset is disabled' });
    }
    await db.resetSeed();
    res.json({
      success: true,
      message: 'AnnSetu database seeded successfully with rich agricultural dataset!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
