const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, default: '' },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  deliveryAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String
  },
  deliveryType: { type: String, default: 'Direct Farm Dispatch (Trucking)' },
  paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'], 
    default: 'placed' 
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    message: String
  }]
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
