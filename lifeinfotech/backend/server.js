const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sliderRoutes = require('./routes/adminSlider');
const adminFAQ = require('./routes/adminFAQ');
const seasonRoute = require('./routes/seasonRoute');
const anantamRoutes = require('./routes/anantamRoutes');
const faqRoutes = require('./routes/faqRoutes');

const app = express();

/* =======================
    MIDDLEWARE & CORS
======================= */
app.use(express.json());

// Sabhi Origins ko handle karne ke liye simple aur robust configuration
const allowedOrigins = [
    'https://labrostone-frontend.onrender.com', // Aapka Live Frontend URL
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Bina origin wali requests (jaise Postman ya mobile apps) ko allow karein
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS Blocked for Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static Files Path Fix (Ensure it matches your folder structure)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

/* =======================
    MONGODB CONNECTION
======================= */
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch((err) => console.error('MongoDB error ❌', err));

/* =======================
    ROUTES USE
======================= */
app.use('/api/admin/sliders', sliderRoutes); 
app.use('/api/anantam', anantamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminFAQ);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seasons', seasonRoute);
app.use('/api/admin', faqRoutes);

app.get('/', (req, res) => {
    res.send('Lebrostone Backend is running perfectly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} 🚀`);
});