const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

/* ==========================================
   1. BANNER CONFIGURATION (Multer)
========================================== */
const storage = multer.diskStorage({
  destination: 'public/uploads/banners/',
  filename: (req, file, cb) => {
    // Fixed name taaki purana banner overwrite ho jaye
    cb(null, 'anantam-main-banner' + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const BASE_URL = process.env.BASE_URL || 'https://lebrostone.lifeinfotechinstitute.com/';

// Note: Real world mein ise DB Settings model mein save karein
let currentBannerUrl = `${BASE_URL}/banar/banner1.jpg`; 

/* ==========================================
   2. BANNER API ROUTES
========================================== */

// GET Banner (Public)
router.get('/banner', (req, res) => {
  res.json({ success: true, url: currentBannerUrl });
});

// UPLOAD Banner (Admin Only)
router.post('/banner-upload', protect, upload.single('banner'), (req, res) => {
  try {
    if (req.file) {
      currentBannerUrl = `${BASE_URL}/uploads/banners/${req.file.filename}`;
      res.json({ success: true, url: currentBannerUrl, message: "Banner Updated! ✅" });
    } else {
      res.status(400).json({ success: false, message: "File missing ❌" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================================
   3. PRODUCT COLLECTION ROUTES
========================================== */

// GET Selected Anantam Collection (Public)
router.get('/collection', async (req, res) => {
  try {
    const products = await Product.find({ is_anantam: true }).sort({ updatedAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ ADD THIS: Toggle Anantam Status Route
router.put('/anantam/:id', protect, async (req, res) => {
  try {
    const { is_anantam } = req.body;
    
    // Database mein product ka status update karein
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { is_anantam: is_anantam },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;