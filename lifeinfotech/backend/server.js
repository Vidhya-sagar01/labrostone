// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path'); 
// require('dotenv').config();

// /* =======================
//    ROUTES IMport
// ======================= */

// const categoryRoutes = require('./routes/categoryRoutes');
// const productRoutes = require('./routes/productRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const sliderRoutes = require('./routes/adminSlider');
// const adminFAQ = require('./routes/adminFAQ');
// const seasonRoute = require('./routes/seasonRoute');
// const anantamRoutes = require('./routes/anantamRoutes');

// const app = express();

// /* =======================
//    MIDDLEWARE
// ======================= */
// app.use(express.json());
// app.use(cors());

// // ✅ SERVE UPLOADED IMAGES
// app.use(
//   '/uploads',
//   express.static(path.join(__dirname, 'public/uploads'))
// );

// /* =======================
//    MONGODB CONNECTION
// ======================= */
// const MONGO_URI =
//   process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lebrostone';

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected ✅'))
//   .catch((err) => console.error('MongoDB error ❌', err));

// /* =======================
//    ROUTES use
// ======================= */
// app.use('/api/admin', adminRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/admin/sliders', sliderRoutes);
// app.use('/api/admin', adminFAQ);
// app.use('/api/seasons', seasonRoute);
// app.use('/api/anantam', anantamRoutes);
// /* =======================
//    SERVER START
// ======================= */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} 🚀`);
// });
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

// CORS Configuration: Production mein ye frontend URL ko allow karega
const allowedOrigins = [
    process.env.FRONTEND_URL, // Render frontend URL
    'http://localhost:5173',  // Local development
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
// 'public/uploads' folder ko static banane ke liye absolute path use karna behtar hai
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

/* =======================
    MONGODB CONNECTION
======================= */
// Local backup ke liye default URI rakha hai, Render par process.env.MONGO_URI kaam karega
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lebrostone';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch((err) => console.error('MongoDB error ❌', err));

/* =======================
    ROUTES USE
======================= */
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/sliders', sliderRoutes);
app.use('/api/admin', adminFAQ);
app.use('/api/seasons', seasonRoute);
app.use('/api/anantam', anantamRoutes);

// Health Check Route (Render monitoring ke liye acha hota hai)
app.get('/', (req, res) => {
    res.send('Server is running perfectly...');
});

/* =======================
    SERVER START
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});