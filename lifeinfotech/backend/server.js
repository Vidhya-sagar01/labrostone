const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sliderRoutes = require('./routes/adminSlider');
const seasonRoute = require('./routes/seasonRoute');
const anantamRoutes = require('./routes/anantamRoutes');
const faqRoutes = require('./routes/adminFAQ');
const app = express();

app.use(express.json());

// CORS configuration
const allowedOrigins = [
    'https://labrostone-frontend.onrender.com',
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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch((err) => console.error('MongoDB error ❌', err));

/* =======================
    ROUTES MAPPING
======================= */
app.use('/api/admin', adminRoutes);          
app.use('/api/admin/sliders', sliderRoutes); 
app.use('/api/admin/faqs', faqRoutes);      
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seasons', seasonRoute);
app.use('/api/anantam', anantamRoutes);

app.get('/', (req, res) => res.send('Lebrostone Backend is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} 🚀`));