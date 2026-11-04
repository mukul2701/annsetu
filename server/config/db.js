const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const initialData = require('../data/initialData');

const DB_FILE_PATH = path.join(__dirname, '../data/annsetu_store.json');

let isMongoConnected = false;
let memoryStore = null;

// Initialize file store if needed
async function loadStore() {
  if (isMongoConnected) {
    const collection = mongoose.connection.collection('annsetu_state');
    let record = await collection.findOne({ _id: 'primary' });
    if (!record) {
      record = { _id: 'primary', data: JSON.parse(JSON.stringify(initialData)) };
      await collection.insertOne(record);
    }
    memoryStore = record.data;
    return memoryStore;
  }
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      memoryStore = JSON.parse(raw);
    } else {
      memoryStore = JSON.parse(JSON.stringify(initialData));
      await saveStore();
    }
  } catch (err) {
    console.warn('[AnnSetu DB] Error reading file store, initializing fresh data:', err.message);
    memoryStore = JSON.parse(JSON.stringify(initialData));
    await saveStore();
  }
  return memoryStore;
}

async function saveStore() {
  if (isMongoConnected) {
    await mongoose.connection.collection('annsetu_state').replaceOne(
      { _id: 'primary' },
      { _id: 'primary', data: memoryStore },
      { upsert: true }
    );
    return;
  }
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AnnSetu DB] Error saving store:', err.message);
  }
}

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      console.log('[AnnSetu DB] Connecting to MongoDB Atlas / Server...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongoConnected = true;
      await loadStore();
      console.log('✅ [AnnSetu DB] MongoDB Connected Successfully!');
      return true;
    } catch (err) {
      console.warn('⚠️ [AnnSetu DB] MongoDB connection error:', err.message);
      console.log('⚡ [AnnSetu DB] Switching to Built-in Resilient Store (Zero Downtime Mode)...');
      isMongoConnected = false;
      if (process.env.NODE_ENV === 'production') throw err;
    }
  } else {
    console.log('ℹ️ [AnnSetu DB] MONGO_URI not set. Running with built-in persistent local store.');
    if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI_REQUIRED === 'true') {
      throw new Error('MONGO_URI must be configured in production to persist application data.');
    }
  }

  await loadStore();
  return false;
}

// Data Access Layer (Works seamlessly with or without external MongoDB)
const db = {
  isMongoConnected: () => isMongoConnected,

  // Users
  getUsers: async () => {
    await loadStore();
    return memoryStore.users;
  },
  findUserById: async (id) => {
    await loadStore();
    return memoryStore.users.find(u => u._id === id);
  },
  findUserByEmail: async (email) => {
    await loadStore();
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser: async (userData) => {
    await loadStore();
    const newUser = {
      _id: 'user_' + Date.now(),
      rating: 5.0,
      isVerified: userData.role === 'farmer',
      createdAt: new Date().toISOString(),
      avatar: userData.avatar || (userData.role === 'farmer' 
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
      ...userData
    };
    memoryStore.users.push(newUser);
    await saveStore();
    return newUser;
  },

  // Products
  getProducts: async ({ category, state, search, organic, farmerId, sort } = {}) => {
    await loadStore();
    let prods = [...memoryStore.products];

    if (farmerId) {
      prods = prods.filter(p => p.farmerId === farmerId);
    }
    if (category && category !== 'All') {
      prods = prods.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (state && state !== 'All') {
      prods = prods.filter(p => p.state.toLowerCase() === state.toLowerCase());
    }
    if (organic === 'true' || organic === true) {
      prods = prods.filter(p => p.isOrganic === true);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      prods = prods.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      prods.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sort === 'price_desc') {
      prods.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (sort === 'rating') {
      prods.sort((a, b) => b.rating - a.rating);
    } else {
      prods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return prods;
  },
  findProductById: async (id) => {
    await loadStore();
    return memoryStore.products.find(p => p._id === id);
  },
  createProduct: async (productData) => {
    await loadStore();
    const newProduct = {
      _id: 'prod_' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      status: 'available',
      createdAt: new Date().toISOString(),
      ...productData
    };
    memoryStore.products.unshift(newProduct);
    await saveStore();
    return newProduct;
  },
  updateProduct: async (id, updates) => {
    await loadStore();
    const idx = memoryStore.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...updates, updatedAt: new Date().toISOString() };
    await saveStore();
    return memoryStore.products[idx];
  },
  deleteProduct: async (id) => {
    await loadStore();
    const idx = memoryStore.products.findIndex(p => p._id === id);
    if (idx === -1) return false;
    memoryStore.products.splice(idx, 1);
    await saveStore();
    return true;
  },

  // Orders
  getOrders: async ({ buyerId, farmerId } = {}) => {
    await loadStore();
    let ords = [...memoryStore.orders];
    if (buyerId) {
      ords = ords.filter(o => o.buyerId === buyerId);
    }
    if (farmerId) {
      ords = ords.filter(o => o.items && o.items.some(item => item.farmerId === farmerId));
    }
    return ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  findOrderById: async (id) => {
    await loadStore();
    return memoryStore.orders.find(o => o._id === id);
  },
  createOrder: async (orderData) => {
    await loadStore();
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderNumber: 'AS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      orderStatus: 'placed',
      paymentStatus: orderData.paymentMethod?.includes('Cash') ? 'pending' : 'paid',
      timeline: [
        { status: 'placed', timestamp: new Date().toISOString(), message: 'Order placed by buyer' }
      ],
      createdAt: new Date().toISOString(),
      ...orderData
    };

    // Auto-decrement product stock
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const prod = memoryStore.products.find(p => p._id === item.productId);
        if (prod) {
          prod.availableQuantity = Math.max(0, (prod.availableQuantity || 0) - item.quantity);
          if (prod.availableQuantity === 0) {
            prod.status = 'sold_out';
          }
        }
      });
    }

    memoryStore.orders.unshift(newOrder);
    await saveStore();
    return newOrder;
  },
  updateOrderStatus: async (id, status, note = '') => {
    await loadStore();
    const order = memoryStore.orders.find(o => o._id === id);
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'delivered') order.paymentStatus = 'paid';
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      message: note || `Order updated to ${status}`
    });
    await saveStore();
    return order;
  },

  // Mandi Rates
  getMandiRates: async ({ state, category, search } = {}) => {
    await loadStore();
    let rates = [...memoryStore.mandiRates];
    if (state && state !== 'All') {
      rates = rates.filter(r => r.state.toLowerCase() === state.toLowerCase());
    }
    if (category && category !== 'All') {
      rates = rates.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      rates = rates.filter(r => 
        r.commodity.toLowerCase().includes(q) ||
        r.mandi.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q)
      );
    }
    return rates;
  },

  // Inquiries
  getInquiries: async ({ buyerId, farmerId } = {}) => {
    await loadStore();
    let inqs = [...(memoryStore.inquiries || [])];
    if (buyerId) inqs = inqs.filter(i => i.buyerId === buyerId);
    if (farmerId) inqs = inqs.filter(i => i.farmerId === farmerId);
    return inqs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createInquiry: async (inquiryData) => {
    await loadStore();
    if (!memoryStore.inquiries) memoryStore.inquiries = [];
    const newInquiry = {
      _id: 'inq_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...inquiryData
    };
    memoryStore.inquiries.unshift(newInquiry);
    await saveStore();
    return newInquiry;
  },
  replyInquiry: async (id, replyText) => {
    await loadStore();
    if (!memoryStore.inquiries) return null;
    const inq = memoryStore.inquiries.find(i => i._id === id);
    if (!inq) return null;
    inq.farmerReply = replyText;
    inq.status = 'replied';
    inq.repliedAt = new Date().toISOString();
    await saveStore();
    return inq;
  },

  // Analytics & Stats
  getAnalytics: async () => {
    await loadStore();
    const farmersCount = memoryStore.users.filter(u => u.role === 'farmer').length + 150;
    const buyersCount = memoryStore.users.filter(u => u.role === 'buyer').length + 120;
    const totalOrdersCount = memoryStore.orders.length + 200;
    const totalProductsCount = memoryStore.products.length;

    let totalGmv = memoryStore.orders.reduce((sum, o) => sum + (o.grandTotal || o.totalAmount || 0), 0) + 485000;
    let totalProduceTons = 420;

    return {
      totalFarmers: farmersCount,
      totalBuyers: buyersCount,
      totalOrders: totalOrdersCount,
      totalProducts: totalProductsCount,
      totalGmvRupees: totalGmv,
      totalProduceTons: totalProduceTons,
      activeMandiCount: memoryStore.mandiRates.length
    };
  },

  // Reset to default seed
  resetSeed: async () => {
    memoryStore = JSON.parse(JSON.stringify(initialData));
    await saveStore();
    return true;
  }
};

module.exports = {
  connectDB,
  db
};

