const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// 1. Storage Setup
const storage = multer.diskStorage({
  destination: 'public/uploads/categories/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
const BASE_URL = 'http://localhost:5000';

// --- GET CATEGORIES (Public: No protect needed) ---
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ created_at: -1 });
        res.json({ data: categories });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- CREATE CATEGORY (Protected) ---
// Route ke beech mein 'protect' lagana hai
router.post('/', protect, upload.single('image_url'), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image_url = `${BASE_URL}/uploads/categories/${req.file.filename}`;
        }
        const newCategory = new Category(data);
        const saved = await newCategory.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- UPDATE CATEGORY (Protected) ---
router.put('/:id', protect, upload.single('image_url'), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image_url = `${BASE_URL}/uploads/categories/${req.file.filename}`;
        }
        const updated = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- DELETE CATEGORY (Protected) ---
router.delete('/:id', protect, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted! ✅" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;