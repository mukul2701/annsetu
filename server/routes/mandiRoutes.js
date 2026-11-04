const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// GET /api/mandi - Get live mandi rates
router.get('/', async (req, res, next) => {
  try {
    const { state, category, search } = req.query;
    const rates = await db.getMandiRates({ state, category, search });
    res.json({
      success: true,
      count: rates.length,
      rates
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
