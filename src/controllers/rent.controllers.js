import { User } from "../models/user.models.js";
import { Rental } from "../models/rental.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addRental = asyncHandler(async (req, res) => {
    const { seller, product, startDate, endDate, price_per_day, total_price } = req.body;
    if (!seller || !product || !startDate || !endDate || !price_per_day || !total_price)
        throw new ApiError(400, "All fields are required");

    const rental = new Rental({
        seller,
        buyer,
        product,
        startDate,
        endDate,
        price_per_day,
        total_price
    });
    
    await rental.save();
    res
        .status(201)
        .json(new ApiResponse(201, { rental }, "Post created successfully"));
})

export { addRental };