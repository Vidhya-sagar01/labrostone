const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

/* =========================
    MULTER CONFIG (Live Ready)
========================= */
const storage = multer.diskStorage({
    destination: 'public/uploads/products/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    }
});

const bannerStorage = multer.diskStorage({
    destination: 'public/uploads/banners/',
    filename: (req, file, cb) => {
        cb(null, 'main-banner-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
const bannerUpload = multer({ storage: bannerStorage });

const BASE_URL = process.env.BASE_URL || 'https://labrostone-backend.onrender.com';

/* =========================
    HELPERS (Parsing Logic)
========================= */
const parseJsonFields = (data) => {
    // Frontend stringify karke bhejta hai, humein wapas object banana hai
    const fieldsToParse = ['variants', 'pricing_variants', 'features', 'key_features', 'faqs', 'included_products'];
    fieldsToParse.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
            try {
                data[field] = JSON.parse(data[field]);
            } catch (e) {
                console.error(`Error parsing ${field}:`, e);
                data[field] = [];
            }
        }
    });
    return data;
};

const cleanObjectIds = (data) => {
    if (data.season === "" || data.season === "null" || data.season === undefined) delete data.season;
    if (data.category_id === "" || data.category_id === "null" || data.category_id === undefined) delete data.category_id;
    return data;
};

/* ==========================================
    1. SPECIAL & PUBLIC ROUTES (Hamesha Upar)
========================================== */

// Banner Fetch (Database se)
router.get('/banner', async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'banner_settings' });
        res.json({ success: true, url: settings ? settings.currentBannerUrl : "" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Search & Filter
router.get('/search', protect, async (req, res) => {
    try {
        const { category, startDate, endDate, is_combo } = req.query;
        let query = {};
        if (category && category.trim() !== "" && category !== "undefined") query.category_id = category;
        if (is_combo) query.is_combo = (is_combo === 'true');
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        const products = await Product.find(query).populate('category_id', 'name').sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Anantam Collection
router.get('/anantam-collection', async (req, res) => {
    try {
        const products = await Product.find({ is_anantam: true }).sort({ updatedAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ==========================================
    2. MAIN PRODUCT CRUD
========================================== */

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category_id season').sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get by Category ID
router.get('/by-category/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category_id: req.params.categoryId }).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE PRODUCT (Main Sync Logic)
router.post('/', protect, upload.array('images', 10), async (req, res) => {
    try {
        let data = { ...req.body };
        data = parseJsonFields(data);
        data = cleanObjectIds(data);

       
        if (data.pricing_variants) data.variants = data.pricing_variants;
        if (data.key_features) data.features = data.key_features;
        if (data.description) data.long_description = data.description;

        
        const nums = ['mrp', 'cost_price', 'selling_price', 'discount_percentage', 'profit_amount'];
        nums.forEach(f => { if (data[f]) data[f] = Number(data[f]); });

        // Boolean Sync
        data.is_bestseller = String(data.is_bestseller) === 'true';
        data.in_stock = String(data.in_stock) === 'true' || String(data.in_stock) === '1';

        
        if (req.files?.length) {
            data.images = req.files.map(file => `uploads/products/${file.filename}`);
        }

        const product = await Product.create(data);
        res.status(201).json({ success: true, message: 'Saved! ✅', data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

/* ==========================================
    3. UPDATES & DELETE
========================================== */

// Update Full Product
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
    try {
        let data = { ...req.body };
        data = parseJsonFields(data);
        data = cleanObjectIds(data);

        
        if (data.pricing_variants) data.variants = data.pricing_variants;
        if (data.key_features) data.features = data.key_features;
        if (data.description) data.long_description = data.description;

        
        if (req.files?.length) {
            data.images = req.files.map(file => `uploads/products/${file.filename}`);
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json({ success: true, message: 'Updated! ✅', data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});   

router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: 'Deleted Successfully! 🗑️' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Banner Upload
router.post('/banner-upload', protect, bannerUpload.single('banner'), async (req, res) => {
    try {
        if (req.file) {
            const newUrl = `${BASE_URL}/uploads/banners/${req.file.filename}`;
            await Settings.findOneAndUpdate({ key: 'banner_settings' }, { currentBannerUrl: newUrl }, { upsert: true });
            res.json({ success: true, url: newUrl });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
