const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: 'public/uploads/blogs/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Add Blog
router.post('/add', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, shortDescription, longDescription } = req.body;
        const newBlog = new Blog({
            title,
            shortDescription,
            longDescription,
            image: req.file ? `/uploads/blogs/${req.file.filename}` : ''
        });
        await newBlog.save();
        res.status(201).json({ success: true, message: "Blog Created! ✍️" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get All Blogs
router.get('/all', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;