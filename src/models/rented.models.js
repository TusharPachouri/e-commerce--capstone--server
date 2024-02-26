const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rentalStartDate: {
    type: Date,
    required: true
  },
  rentalEndDate: {
    type: Date,
    required: true
  },
  rentalPrice: {
    type: Number,
    required: true
  },
  rentalDeposit: {
    type: Number,
    required: true
  },
  returned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
