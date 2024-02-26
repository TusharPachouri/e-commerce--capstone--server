const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rentalPrice: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    rentalDuration: {
      type: Number,
      required: true, // Duration in days
    },
    rentalDeposit: {
      type: Number,
      required: true,
    },
    images: [String], // array of URLs for product images
    ratings: [
      {
        userId: mongoose.Schema.Types.ObjectId, // reference to the User model
        ref: "User",
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reviewText: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    availableForRent: {
      type: Boolean,
      default: true,
    },
    rentalHistory: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        ref: "User",
        rentalStartDate: Date,
        rentalEndDate: Date,
        rentalPrice: Number,
        rentalDeposit: Number,
        returned: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
