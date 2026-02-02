const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

/* =======================
    ROUTES IMPORT
======================= */
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sliderRoutes = require('./routes/adminSlider');
const adminFAQ = require('./routes/adminFAQ');
const seasonRoute = require('./routes/seasonRoute');
const anantamRoutes = require('./routes/anantamRoutes');

const app = express();

/* =======================
    MIDDLEWARE
======================= */
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL, 
    'http://localhost:5173',  
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ✅ SERVE UPLOADED IMAGES
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

/* =======================
    MONGODB CONNECTION
======================= */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lebrostone';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch((err) => console.error('MongoDB error ❌', err));

/* =======================
    ROUTES USE (Order Corrected)
======================= */

// 1. Specific routes ko hamesha upar rakhein
app.use('/api/admin/sliders', sliderRoutes); 
app.use('/api/anantam', anantamRoutes);

// 2. General routes ko niche rakhein
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminFAQ);

// 3. Baaki routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seasons', seasonRoute);

// Health Check
app.get('/', (req, res) => {
    res.send('Server is running perfectly...');
});

/* =======================
    SERVER START
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} 🚀`);
});