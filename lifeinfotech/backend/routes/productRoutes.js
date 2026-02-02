const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

/* =========================
    MULTER CONFIG
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
        cb(null, 'anantam-main-banner' + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
const bannerUpload = multer({ storage: bannerStorage });

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
let currentBannerUrl = `${BASE_URL}/banar/banner1.jpg`; 

/* =========================
    HELPERS
========================= */
const parseJsonFields = (data) => {
    const fieldsToParse = ['variants', 'features', 'faqs', 'included_products'];
    fieldsToParse.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
            try {
                data[field] = JSON.parse(data[field]);
            } catch (e) {
                console.error(`Error parsing ${field}:`, e);
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
    1. STATIC / SPECIAL ROUTES (VVIP: Search hamesha upar)
   ========================================== */

// --- SEARCH & FILTER (Fixed for 500 Error) ---
router.get('/search', protect, async (req, res) => {
    try {
        const { category, startDate, endDate, is_combo } = req.query;
        let query = {};

        if (category && category.trim() !== "" && category !== "undefined" && category !== "null") {
            query.category_id = category;
        }

        if (is_combo === 'true') {
            query.is_combo = true;
        } else if (is_combo === 'false') {
            query.is_combo = false;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate && startDate !== "") query.createdAt.$gte = new Date(startDate);
            if (endDate && endDate !== "") query.createdAt.$lte = new Date(endDate);
            if (Object.keys(query.createdAt).length === 0) delete query.createdAt;
        }

        const products = await Product.find(query)
            .populate('category_id', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Banner public fetch
router.get('/banner', (req, res) => {
    res.json({ success: true, url: currentBannerUrl });
});

// Collection fetch
router.get('/anantam-collection', async (req, res) => {
    try {
        const products = await Product.find({ is_anantam: true }).sort({ updatedAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ==========================================
    2. MAIN PRODUCT ROUTES (Public)
   ========================================== */

// Get All
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category_id', 'name')
            .populate('season', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get by Category
router.get('/by-category/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category_id: req.params.categoryId }).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ==========================================
    3. PROTECTED ROUTES (Admin Operations)
   ========================================== */

   // --- CREATE COMBO ROUTE (VVIP: Post / se pehle rakhein) ---
router.post('/create-combo', protect, async (req, res) => {
  try {
    const { name, includedProducts, mrp, selling_price, category_id } = req.body;

    // 1. Dono products ka data fetch karein images nikalne ke liye
    const productsData = await Product.find({ _id: { $in: includedProducts } });

    // 2. Automatic image handling (pehli 2 images le lo)
    const comboImages = productsData.map(p => p.images[0]).filter(img => img);

    const newCombo = new Product({
      name,
      is_combo: true,
      included_products: includedProducts,
      category_id,
      variants: [{
        size: "Combo Pack",
        mrp: mrp,
        selling_price: selling_price
      }],
      images: comboImages.length > 0 ? comboImages : [`${BASE_URL}/uploads/default-combo.png`],
      in_stock: true
    });

    await newCombo.save();
    res.status(201).json({ success: true, message: "Combo Created Successfully! 🎁", data: newCombo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Create Product
router.post('/', protect, upload.array('images', 10), async (req, res) => {
    try {
        let data = { ...req.body };
        data = parseJsonFields(data);
        data = cleanObjectIds(data);
        if (req.files?.length) {
            data.images = req.files.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
        }
        data.is_bestseller = String(data.is_bestseller) === 'true';
        data.is_hot_deal = String(data.is_hot_deal) === 'true';
        data.in_stock = String(data.in_stock) === 'true' || String(data.in_stock) === '1';

        const product = await Product.create(data);
        res.status(201).json({ success: true, message: 'Product Added ✅', data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Update Anantam Status
router.put('/anantam/:id', protect, async (req, res) => {
    try {
        const { is_anantam } = req.body;
        const updated = await Product.findByIdAndUpdate(req.params.id, { is_anantam }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Product nahi mila" });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Toggle Bestseller
router.put('/:id/bestseller', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Not found" });
        product.is_bestseller = !product.is_bestseller;
        await product.save();
        res.json({ success: true, is_bestseller: product.is_bestseller });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Banner Upload
router.post('/banner-upload', protect, bannerUpload.single('banner'), (req, res) => {
    try {
        if (req.file) {
            currentBannerUrl = `${BASE_URL}/uploads/banners/${req.file.filename}?t=${Date.now()}`;
            res.json({ success: true, url: currentBannerUrl, message: "Banner Updated! ✅" });
        } else {
            res.status(400).json({ success: false, message: "File missing ❌" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ==========================================
    4. PARAMETERIZED ROUTES (Hamesha niche)
   ========================================== */

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id season included_products');
        if (!product) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Full Product
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
    try {
        let data = { ...req.body };
        data = parseJsonFields(data);
        data = cleanObjectIds(data);
        if (req.files?.length) {
            data.images = req.files.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json({ success: true, message: 'Product Updated ✅', data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete Product
router.delete('/:id', protect, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product Deleted 🗑️' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


const Settings = require('../models/Settings');

// 1. GET Banner (Ab DB se aayega)
router.get('/banner', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'banner_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'banner_settings' });
    }
    res.json({ success: true, url: settings.currentBannerUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. UPLOAD Banner (Ab DB mein save hoga)
router.post('/banner-upload', protect, bannerUpload.single('banner'), async (req, res) => {
  try {
    if (req.file) {
      const newUrl = `${BASE_URL}/uploads/banners/${req.file.filename}`;
      
      // Database mein update karein
      await Settings.findOneAndUpdate(
        { key: 'banner_settings' },
        { currentBannerUrl: newUrl },
        { upsert: true }
      );

      res.json({ success: true, url: newUrl, message: "Banner Saved in DB! ✅" });
    } else {
      res.status(400).json({ success: false, message: "File missing" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;