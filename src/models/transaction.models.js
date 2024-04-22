import mongoose, { Schema } from 'mongoose';

const TransactionSchema = mongoose.Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1 // Assuming default quantity is 1
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending'
    },
    payed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);
