const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// Multer Config for Images
const storage = multer.diskStorage({
    destination: 'public/uploads/reviews/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// 1. Add New Review
router.post('/add', protect, upload.single('image'), async (req, res) => {
    try {
        const { customerName, rating, comment } = req.body;
        const newReview = new Review({
            customerName,
            rating,
            comment,
            customerImage: req.file ? `/uploads/reviews/${req.file.filename}` : ''
        });
        await newReview.save();
        res.status(201).json({ success: true, message: "Review Added!", data: newReview });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// 2. Get All Reviews (Public)
router.get('/all', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Delete Review
router.delete('/:id', protect, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;