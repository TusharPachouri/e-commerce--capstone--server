import mongoose, { Schema } from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAvailableForRent: {
      type: Boolean,
      required: false,
      default: true,
    },
    rentPrice: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("product", ProductSchema);
