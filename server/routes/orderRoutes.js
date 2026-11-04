const express = require('express');
const { db } = require('../config/db');
const { authMiddleware, farmerOnly, buyerOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Create an order
router.post('/', authMiddleware, buyerOnly, async (req, res, next) => {
  try {
    const { items, deliveryAddress, deliveryType, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order' });
    }

    const user = await db.findUserById(req.user.id);

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const prod = await db.findProductById(item.productId);
      if (!prod) {
        return res.status(400).json({ success: false, message: `Produce item ${item.productId} no longer exists` });
      }
      if (prod.availableQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for "${prod.title}". Available: ${prod.availableQuantity} ${prod.unit}` 
        });
      }

      const itemTotal = prod.pricePerUnit * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        productId: prod._id,
        title: prod.title,
        quantity: item.quantity,
        unit: prod.unit || 'kg',
        unitPrice: prod.pricePerUnit,
        total: itemTotal,
        farmerId: prod.farmerId,
        farmerName: prod.farmerName
      });
    }

    // Flat delivery fee simulation based on delivery type
    let deliveryFee = 350;
    if (deliveryType === 'Mandi Hub Pickup') deliveryFee = 150;
    if (deliveryType === 'Cold-Chain Express') deliveryFee = 750;

    const grandTotal = totalAmount + deliveryFee;

    const newOrder = await db.createOrder({
      buyerId: req.user.id,
      buyerName: user.name,
      buyerPhone: user.phone || req.body.deliveryAddress?.phone || '',
      items: processedItems,
      totalAmount,
      deliveryFee,
      grandTotal,
      deliveryAddress: deliveryAddress || {
        fullName: user.name,
        phone: user.phone,
        addressLine: user.deliveryAddress || 'Direct Pickup',
        city: user.district || '',
        state: user.state || 'Punjab',
        pincode: '110001'
      },
      deliveryType: deliveryType || 'Direct Farm Dispatch (Trucking)',
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/buyer/mine - Logged-in buyer orders
router.get('/buyer/mine', authMiddleware, async (req, res, next) => {
  try {
    const orders = await db.getOrders({ buyerId: req.user.id });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/farmer/mine - Orders received by farmer
router.get('/farmer/mine', authMiddleware, farmerOnly, async (req, res, next) => {
  try {
    const orders = await db.getOrders({ farmerId: req.user.id });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Order details
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const order = await db.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: must be the buyer, one of the farmers, or admin
    const isBuyer = order.buyerId === req.user.id;
    const isFarmer = order.items && order.items.some(i => i.farmerId === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status - Update order status (Farmer or Admin)
router.put('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await db.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updated = await db.updateOrderStatus(req.params.id, status, note);
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
