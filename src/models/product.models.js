import mongoose, {Schema} from 'mongoose';

ProductSchema = mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    clicks: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
})

const Product = mongoose.model('product', ProductSchema)

module.exports = Product