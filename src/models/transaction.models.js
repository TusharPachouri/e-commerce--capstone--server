import mongoose, {Schema} from 'mongoose';

TransactionSchema = mongoose.Schema({
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
    }
}, {
    timestamps: true
})

Transaction = mongoose.model('transaction', TransactionSchema)

module.exports = Transaction