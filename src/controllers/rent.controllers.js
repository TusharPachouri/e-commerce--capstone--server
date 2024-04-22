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
  const total_price = costPerDay * (endDate - startDate);
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

export { addRental };
