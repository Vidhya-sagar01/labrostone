const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  subSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  productType: { type: String, default: 'Physical' },
  sku: { type: String, unique: true },
  unit: { type: String, default: 'kg' },
  unitPrice: { type: Number, required: true },
  minOrderQty: { type: Number, default: 1 },
  currentStockQty: { type: Number, default: 0 },
  discountType: { type: String, default: 'Flat' },
  discountAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  thumbnail: { type: String }, // Image Path
  images: [String], // Additional Images
  status: { type: Boolean, default: true },
  productTag: { 
    type: String, 
    enum: ['Simple', 'Best Seller', 'New Arrival'], 
    default: 'Simple' 
  },
  promotion: { 
    type: Boolean, 
    default: false // By default promotion deactive rahega
  },
  is_anantam: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);