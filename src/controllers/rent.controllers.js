import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Rental } from "../models/rental.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addRental = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate)
    throw new ApiError(400, "Start date and end date are required");
  const buyer = req.user._id;
  if (!buyer) throw new ApiError(400, "Buyer is required");
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (!product.isAvailableForRent)
    throw new ApiError(400, "Product is not available for rent");
  const costPerDay = product.rentPrice;

  // Calculate the duration of the rental
  const duration = new Date(endDate) - new Date(startDate);
  const durationInDays = duration / (1000 * 60 * 60 * 24);
  // Calculate the total price
  const total_price = costPerDay * durationInDays;

  const rental = new Rental({
    seller: product.owner,
    buyer,
    product: productId,
    startDate,
    endDate,
    total_price,
  });
  await rental.save();
  res
    .status(201)
    .json(new ApiResponse(201, { rental }, "Rental created successfully"));
});

const getRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find()
    .populate("seller", "username email fullName")
    .populate("buyer", "username email avatar fullName");
  res
    .status(200)
    .json(new ApiResponse(200, { rentals }, "Rentals retrieved successfully"));
});

const getRentalsByLoggedInUser = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ buyer: req.user._id })
    .populate("seller", "username email")
    .populate("buyer", "username email avatar fullName");
  res
    .status(200)
    .json(new ApiResponse(200, { rentals }, "Rentals retrieved successfully"));
});

const endRental = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    throw new ApiError(404, "Rental not found");
  }
  const currentDate = new Date();
  if (currentDate >= rental.endDate) {
    throw new ApiError(400, "Rental has already ended");
  }
  rental.endDate = currentDate;
  await rental.save();
  res
    .status(200)
    .json(new ApiResponse(200, { rental }, "Rental ended successfully"));
});

const getRentalsBySellerId = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ seller: req.params.id })
    .populate("seller", "username email")
    .populate("buyer", "username email avatar fullName");
  res
    .status(200)
    .json(new ApiResponse(200, { rentals }, "Rentals retrieved successfully"));
});

export {
  addRental,
  getRentals,
  getRentalsByLoggedInUser,
  endRental,
  getRentalsBySellerId,
};
