const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone, state, district, village, businessName, businessType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name,
      email,
      passwordHash,
      role: role === 'farmer' ? 'farmer' : 'buyer',
      phone: phone || '',
      state: state || 'Punjab',
      district: district || '',
      village: village || '',
      businessName: businessName || '',
      businessType: businessType || '',
      deliveryAddress: `${village || district || ''}, ${state || ''}`
    });

    const token = createToken(user);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        village: user.village,
        businessName: user.businessName,
        rating: user.rating,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = createToken(user);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        village: user.village,
        businessName: user.businessName,
        rating: user.rating,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/demo-login
router.post('/demo-login', async (req, res, next) => {
  try {
    if (process.env.DEMO_LOGIN_ENABLED !== 'true') {
      return res.status(404).json({ success: false, message: 'Demo login is disabled' });
    }
    const { role } = req.body; // 'farmer' | 'buyer' | 'admin'
    const targetEmail = role === 'farmer' 
      ? 'farmer@annsetu.com' 
      : role === 'admin' 
        ? 'admin@annsetu.com' 
        : 'buyer@annsetu.com';

    let user = await db.findUserByEmail(targetEmail);
    if (!user) {
      const users = await db.getUsers();
      user = users.find(u => u.role === (role || 'farmer')) || users[0];
    }

    const token = createToken(user);
    res.json({
      success: true,
      message: `Logged in as Demo ${user.role.toUpperCase()} (${user.name})`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        village: user.village,
        businessName: user.businessName,
        rating: user.rating,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        village: user.village,
        businessName: user.businessName,
        rating: user.rating,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
