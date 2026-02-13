const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true, 
        trim: true 
    },
    discountAmount: { 
        type: Number, 
        required: true 
    }, 
    minOrderAmount: { 
        type: Number, 
        default: 0 
    },
    // ✅ Yeh field add karein
    startDate: { 
        type: Date, 
        required: true 
    },
    expiryDate: { 
        type: Date, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Coupon', couponSchema);