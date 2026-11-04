require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mandiRoutes = require('./routes/mandiRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets and background image
app.use('/static-assets', express.static(path.join(__dirname, '..')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.get(['/background.jpg', '/Background.jpg'], (req, res) => {
  const fs = require('fs');
  const candidates = [
    path.join(__dirname, '../assets/background.jpg'),
    path.join(__dirname, '../client/public/background.jpg'),
    path.join(__dirname, '../client/public/Background.jpg'),
    path.join(__dirname, '../background.jpg')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return res.sendFile(c);
  }
  res.status(404).send('Background not found');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AnnSetu Agricultural MERN Stack',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build in production / single-folder deployment
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // Fallback landing page if client not yet built
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AnnSetu - Connecting Farmers & Buyers</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Poppins', sans-serif; background: #f5f2e7; color: #2e7d32; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 600px; }
        h1 { font-size: 32px; margin-bottom: 12px; }
        p { color: #555; line-height: 1.6; }
        a { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #2e7d32; color: white; text-decoration: none; border-radius: 30px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🌾 AnnSetu API Server Live</h1>
        <p>The fullstack MERN backend is active and ready. All API endpoints are operational.</p>
        <p>Run <code>npm run build</code> in the project directory to bundle the React frontend.</p>
        <a href="/api/health">Check API Health</a>
      </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in production.');
  }
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌾 ========================================================`);
    console.log(`🌾 AnnSetu MERN Application Running on Port ${PORT}`);
    console.log(`🌾 Local URL: http://localhost:${PORT}`);
    console.log(`🌾 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌾 ========================================================\n`);
  });
}

startServer();
