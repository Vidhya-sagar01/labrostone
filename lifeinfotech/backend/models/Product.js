const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' }, 

  // --- COMBO LOGIC (Integrated) ---
  is_combo: { 
    type: Boolean, 
    default: false 
  },
  // Isme hum un products ki ID save karenge jo is combo ka hissa hain
  included_products: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }
  ],

  short_description: { type: String },
  long_description: { type: String },

  // Pricing & Sizes
  variants: [{
    size: { type: String }, // e.g. "Combo Pack", "20g", "100ml"
    mrp: { type: Number },
    selling_price: { type: Number },
  }],

  // Bullet points (Mamaearth style)
  features: [{
    title: { type: String },
    description: { type: String }
  }],

  how_to_use: { type: String },

  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],

  // Badges & Stats
  is_bestseller: { type: Boolean, default: false },
  in_stock: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  reviews_count: { type: Number, default: 0 },

  // Media
  images: [{ type: String }], 

  is_anantam: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);