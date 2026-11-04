const express = require('express');
const { db } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries - Send an inquiry/direct negotiation message
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productId, message } = req.body;
    if (!productId || !message) {
      return res.status(400).json({ success: false, message: 'Product ID and message are required' });
    }

    const prod = await db.findProductById(productId);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    const user = await db.findUserById(req.user.id);

    const newInq = await db.createInquiry({
      productId: prod._id,
      productTitle: prod.title,
      buyerId: req.user.id,
      buyerName: user.name,
      buyerPhone: user.phone || '',
      farmerId: prod.farmerId,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry sent directly to farmer!',
      inquiry: newInq
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/mine - List inquiries for user
router.get('/mine', authMiddleware, async (req, res, next) => {
  try {
    const filter = req.user.role === 'farmer' 
      ? { farmerId: req.user.id } 
      : { buyerId: req.user.id };

    const inquiries = await db.getInquiries(filter);
    res.json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/inquiries/:id/reply - Farmer reply
router.put('/:id/reply', authMiddleware, async (req, res, next) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const updated = await db.replyInquiry(req.params.id, replyText);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      inquiry: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
