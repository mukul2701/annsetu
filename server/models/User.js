const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'buyer' },
  phone: { type: String, default: '' },
  state: { type: String, default: '' },
  district: { type: String, default: '' },
  village: { type: String, default: '' },
  farmSize: { type: String, default: '' },
  businessName: { type: String, default: '' },
  businessType: { type: String, default: '' },
  deliveryAddress: { type: String, default: '' },
  avatar: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  isVerified: { type: Boolean, default: false },
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
