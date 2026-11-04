const express = require('express');
const { db } = require('../config/db');
const { authMiddleware, farmerOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - List products with filter & search
router.get('/', async (req, res, next) => {
  try {
    const { category, state, search, organic, sort } = req.query;
    const products = await db.getProducts({ category, state, search, organic, sort });
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/farmer/mine - Get logged-in farmer's products
router.get('/farmer/mine', authMiddleware, farmerOnly, async (req, res, next) => {
  try {
    const products = await db.getProducts({ farmerId: req.user.id });
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }
    res.json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create produce (Farmer only)
router.post('/', authMiddleware, farmerOnly, async (req, res, next) => {
  try {
    const {
      title,
      category,
      variety,
      description,
      pricePerUnit,
      unit,
      availableQuantity,
      minOrderQuantity,
      harvestDate,
      isOrganic,
      state,
      location,
      images,
      mandiBenchmark,
      retailBenchmark
    } = req.body;

    if (!title || !category || !pricePerUnit || !availableQuantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, category, price, and available quantity are required' 
      });
    }

    const user = await db.findUserById(req.user.id);

    const defaultImages = [
      category.toLowerCase().includes('grain')
        ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
        : category.toLowerCase().includes('fruit')
          ? 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80'
          : category.toLowerCase().includes('vegetable')
            ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
    ];

    const newProd = await db.createProduct({
      title,
      category: category || 'Grains & Cereals',
      variety: variety || '',
      description: description || '',
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'kg',
      availableQuantity: Number(availableQuantity),
      minOrderQuantity: Number(minOrderQuantity) || 10,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      isOrganic: Boolean(isOrganic),
      state: state || user.state || 'Punjab',
      location: location || `${user.district || ''}, ${user.village || ''}`,
      farmerId: req.user.id,
      farmerName: req.user.name,
      farmerPhone: user.phone || '',
      images: (images && images.length) ? images : defaultImages,
      mandiBenchmark: Number(mandiBenchmark) || Math.round(Number(pricePerUnit) * 0.85),
      retailBenchmark: Number(retailBenchmark) || Math.round(Number(pricePerUnit) * 1.35)
    });

    res.status(201).json({
      success: true,
      message: 'Produce listing created successfully!',
      product: newProd
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update produce
router.put('/:id', authMiddleware, farmerOnly, async (req, res, next) => {
  try {
    const existing = await db.findProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    // Ensure farmer owns the product or is admin
    if (existing.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this listing' });
    }

    const updated = await db.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Produce updated successfully',
      product: updated
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete produce
router.delete('/:id', authMiddleware, farmerOnly, async (req, res, next) => {
  try {
    const existing = await db.findProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    if (existing.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this listing' });
    }

    await db.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Produce listing deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
