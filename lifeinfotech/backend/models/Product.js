const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },

  // --- IDENTITY & DESCRIPTIONS ---
  tagline: { type: String }, 
  short_description: { type: String },
  long_description: { type: String }, // Frontend ka 'long_description' yahan save hoga
  how_to_use: { type: String },
  net_content: { type: String }, // e.g., "15g", "30 Capsules"

  // --- MAIN ECONOMICS (Admin Dashboard) ---
  mrp: { type: Number, default: 0 },
  cost_price: { type: Number, default: 0 },
  selling_price: { type: Number, default: 0 },
  discount_percentage: { type: Number, default: 0 },
  profit_amount: { type: Number, default: 0 },
  profit_percentage: { type: Number, default: 0 },

  // --- DYNAMIC ARRAYS ---
  // Variants Array
  variants: [{
    size: { type: String },
    mrp: { type: Number },
    cost: { type: Number },
    selling_price: { type: Number },
    discount: { type: Number },
    profit: { type: Number }
  }],

  // Mamaearth Style Features
  features: [{
    title: { type: String },
    description: { type: String }
  }],

  // FAQ Section
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],

  // --- STATUS & FLAGS ---
  is_combo: { type: Boolean, default: false },
  included_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  is_bestseller: { type: Boolean, default: false },
  in_stock: { type: Boolean, default: true },
  is_anantam: { type: Boolean, default: false },
  
  // --- METRICS ---
  rating: { type: Number, default: 4.5 },
  reviews_count: { type: Number, default: 0 },

  // --- MEDIA ---
  images: [{ type: String }], // Array for multiple image paths

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
