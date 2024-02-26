import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profile: {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      profilePicture: String, // URL to the profile picture
    },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["credit/debit card", "PayPal", "Stripe"], // Add more payment methods if needed
        },
        cardNumber: String,
        expirationDate: String,
        cvv: String,
        billingAddress: {
          street: String,
          city: String,
          state: String,
          postalCode: String,
          country: String,
        },
      },
    ],
    orders: [
      {
        orderId: mongoose.Schema.Types.ObjectId, // Reference to the Order model
        orderDate: Date,
        products: [
          {
            productId: mongoose.Schema.Types.ObjectId, // Reference to the Product model
            quantity: Number,
            rentalDuration: Number, // in days
            rentalPrice: Number,
            totalPrice: Number,
          },
        ],
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
        },
      },
    ],
    rentalHistory: [
      {
        productId: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        rentalStartDate: Date,
        rentalEndDate: Date,
        rentalPrice: Number,
      },
    ],
    wishlist: [
      {
        productId: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviews: [
      {
        productId: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        reviewText: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      currency: {
        type: String,
        default: "USD", // Default currency
      },
      language: {
        type: String,
        default: "en", // Default language
      },
      categoriesOfInterest: [String], // Array of category names
    },
    subscription: {
      type: String, // Subscription plan name
      default: "basic", // Default subscription plan
    },
    privacySettings: {
      receiveMarketingEmails: {
        type: Boolean,
        default: true,
      },
      receiveNotificationEmails: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
