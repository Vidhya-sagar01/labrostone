const express = require('express');
const router = express.Router(); // ✅ Added this line
const Season = require('../models/Season');

// GET ALL SEASONS
router.get('/', async (req, res) => {
  try {
    const seasons = await Season.find().sort({ createdAt: -1 });
    res.json({ success: true, seasons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE NEW SEASON
router.post('/', async (req, res) => {
  try {
    const newSeason = await Season.create(req.body);
    res.status(201).json({ success: true, season: newSeason });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// UPDATE SEASON
router.put('/:id', async (req, res) => {
  try {
    const updated = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, season: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE SEASON
router.delete('/:id', async (req, res) => {
  try {
    await Season.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Season Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;