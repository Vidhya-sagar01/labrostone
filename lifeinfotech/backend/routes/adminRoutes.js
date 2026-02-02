const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Isse top par add karein
const Admin = require('../models/Admin');

const router = express.Router();

// ... Create Admin wala code ...

/* ================= LOGIN ADMIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 2. TOKEN GENERATE KAREIN
    // Yahan 'secret_key_lebrostone' ki jagah apni secret key rakhein
    const token = jwt.sign(
      { id: admin._id }, 
      'super_secret_admin_key', 
      { expiresIn: '24h' }
    );

    // 3. TOKEN KO RESPONSE MEIN BHEJEIN
    res.json({
      success: true,
      message: 'Login successful',
      token: token,      // <-- Ab frontend ko ye 'token' milega
      adminId: admin._id
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;