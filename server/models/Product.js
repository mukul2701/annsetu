const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Grains & Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Spices & Herbs', 'Dairy & Organic', 'Oilseeds']
  },
  variety: { type: String, default: '' },
  description: { type: String, default: '' },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  availableQuantity: { type: Number, required: true },
  minOrderQuantity: { type: Number, default: 1 },
  harvestDate: { type: String, default: '' },
  isOrganic: { type: Boolean, default: false },
  state: { type: String, required: true },
  location: { type: String, default: '' },
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, default: '' },
  images: [{ type: String }],
  mandiBenchmark: { type: Number, default: 0 },
  retailBenchmark: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'sold_out', 'paused'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
