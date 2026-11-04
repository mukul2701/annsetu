const mongoose = require('mongoose');

const mandiPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true },
  category: { type: String, default: 'Grains' },
  mandi: { type: String, required: true },
  state: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  lastUpdated: { type: String, default: 'Today' }
}, { timestamps: true });

module.exports = mongoose.models.MandiPrice || mongoose.model('MandiPrice', mandiPriceSchema);
