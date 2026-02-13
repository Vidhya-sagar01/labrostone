const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// ✅ 1. Naya Coupon Create karein (Date + Time support)
router.post('/add', async (req, res) => {
    try {
        // 1. Destructure startDate from req.body
        const { code, discountAmount, minOrderAmount, startDate, expiryDate } = req.body;

        // 2. Create new document
        const newCoupon = new Coupon({
          code,
          discountAmount,
          minOrderAmount,
          startDate, // Ab ye defined hai
          expiryDate
        });

        await newCoupon.save();
        res.status(201).json({ success: true, data: newCoupon });
    } catch (err) {
        // Agar startDate missing hogi toh Mongoose validation error dega
        res.status(400).json({ success: false, message: err.message });
    }
});

// ✅ 2. Saare Coupons fetch karein
router.get('/all', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ 3. Coupon delete karein
router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Nahi mila" });
        res.status(200).json({ success: true, message: "Coupon deleted! 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;