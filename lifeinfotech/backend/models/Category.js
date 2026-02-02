const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true 
  },
  image_url: { 
    type: String, 
    default: null 
  },
  min_price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  max_price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  discount_text: { 
    type: String, 
    default: null 
  },
  card_offers: { 
    type: String, // SQL text field ke liye String sahi hai
    default: null 
  },
  festival_offers: { 
    type: String, 
    default: null 
  }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Category', categorySchema);