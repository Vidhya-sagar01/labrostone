const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const Admin = require('../models/Admin'); 

const router = express.Router();

/* ================= 1. TEMPORARY REGISTER ROUTE ================= */
// URL: https://labrostone-backend.onrender.com/api/admin/temp-register
router.post('/temp-register', async (req, res) => {
    try {
        const email = "admin@gmail.com";
        const password = "Admin123";
        const name = "Admin User";

        // Check agar user pehle se hai
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin pehle se bana hua hai!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = await Admin.create({
            email,
            password: hashedPassword,
            name
        });

        res.status(201).json({ 
            success: true, 
            message: 'Naya admin account admin@gmail.com ke liye ban gaya hai!', 
            admin: { email: newAdmin.email } 
        });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error: " + err.message });
    }
});

/* ================= 2. LOGIN ADMIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email check karein
    const admin = await Admin.findOne({ email });
    
    // Agar Master credentials match hote hain toh direct login allow karein
    if (email === "admin@gmail.com" && password === "Admin123") {
        const token = jwt.sign(
            { id: admin ? admin._id : 'master_admin' }, 
            'super_secret_admin_key', 
            { expiresIn: '24h' }
        );
        return res.json({
            success: true,
            message: 'Master Login successful',
            token: token,
            adminId: admin ? admin._id : null
        });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id }, 
      'super_secret_admin_key', 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      adminId: admin._id
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;