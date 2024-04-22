import mongoose, {Schema} from 'mongoose';

const rentalSchema = mongoose.Schema({
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
    startDate: {
        type: Date,
        required: true,
        trim: true
    },
    endDate: {
        type: Date,
        required: true,
        trim: true
    },
    price_per_day: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    

}, {
    timestamps: true
})

export const Rental = mongoose.model('Rental', rentalSchema)

