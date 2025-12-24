const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: [true , 'User ID is required']
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: [true , 'Product ID is required']
        },
        quantity:{
            type: Number,
            required: [true , 'Product quantity is required'],
        }, 
    }],
    totalAmount: {
        type: Number,
        required: [true , 'Total amount is required']
    }
} , { timestamps: true });

module.exports = mongoose.model('orders' , orderSchema);