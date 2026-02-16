const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 1. Manual Sign-Up Route (YEH NAYA ADD KIYA HAI)
router.post("/manual-signup", async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    // Create new user
    user = new User({
      name,
      email,
      phoneNumber,
      password, // Note: Production mein bcrypt use karke hash zaroor karein
      address: { houseNo: "", nearby: "", city: "", state: "", pincode: "" },
    });

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (err) {
    console.error("Signup Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error during signup" });
  }
});

// 2. Manual Login Route - Login with Mobile Number
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // Find user by phoneNumber
    const user = await User.findOne({ phoneNumber });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Mobile Number or Password" });
    }

    res.status(200).json({ success: true, user, token: "dummy-token" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 3. Google Auth Route
router.post("/google-auth", async (req, res) => {
  const { email, name, sub, picture } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId: sub,
        picture,
        address: { houseNo: "", nearby: "", city: "", state: "", pincode: "" },
      });
      await user.save();
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
