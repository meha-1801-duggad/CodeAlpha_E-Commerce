const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./data/database');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Nova Luxe E-Commerce API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for unknown HTML navigation routes
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html') && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    next();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
async function startServer() {
  try {
    await db.initDatabase();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  🚀 Nova Luxe E-Commerce Server is running!`);
      console.log(`  🔗 Local Storefront: http://localhost:${PORT}`);
      console.log(`  📡 API Endpoint:     http://localhost:${PORT}/api/products`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();
