const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const Product = require('../models/Product');
const Category = require('../models/Category');

// 1. Sabhi Categories fetch karein [cite: 1, 42, 79, 119, 158, 197, 242, 288, 333, 378, 423, 468]
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// 2. Selected Category ke Products fetch karein
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find({ category_id: category });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// 3. Selected Product ke FAQs fetch karein [cite: 27, 66, 106, 145, 184, 229, 275, 320, 365, 410, 455, 500]
router.get('/faqs', async (req, res) => {
  try {
    const { productId } = req.query;
    const faqs = await Faq.find({ productId }).sort({ createdAt: -1 });
    res.json({ faqs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching FAQs" });
  }
});

// 4. Naya FAQ add karein
router.post('/faqs', async (req, res) => {
  try {
    const { question, answer, productId } = req.body;
    const newFaq = new Faq({ question, answer, productId });
    await newFaq.save();
    res.status(201).json({ faq: newFaq });
  } catch (err) {
    res.status(400).json({ message: "Error saving FAQ" });
  }
});


router.delete('/faqs/:id', async (req, res) => {
  try {
    const faqId = req.params.id;
    const deletedFaq = await Faq.findByIdAndDelete(faqId);

    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found in database" });
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("Server Delete Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;