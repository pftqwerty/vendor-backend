require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Storage setup for images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => res.send('✅ Vendor Backend Running!'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menu', menuRoutes);

const vendorRoutes = require('./routes/vendorRoutes');

// Add the vendor routes
app.use('/api/vendors', vendorRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);
