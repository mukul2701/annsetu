const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, default: '' },
  farmerId: { type: String, required: true },
  message: { type: String, required: true },
  farmerReply: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
  repliedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
