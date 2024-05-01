import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const { item_name, description, category, price, isAvailableForRent,rentPrice, detail1, detail2 } = req.body;
  
  if (!item_name || !description || !category || !price || !req.file || !detail1 || !detail2)
    throw new ApiError(400, "All fields are required");
  const owner = req.user._id;
  if (!owner) throw new ApiError(400, "Owner is required");
  const imageLocalPath = req.file.path;
  if(isAvailableForRent && !rentPrice) throw new ApiError(400, "Rent price is required");

  const uploadResult = await uploadOnCloudinary(imageLocalPath, "productImage");
  const productImage = uploadResult.secure_url;

  const product = new Product({
    item_name,
    description,
    category,
    price,
    image: productImage,
    isAvailableForRent,
    rentPrice,
    owner,
    detail1,
    detail2,
  });

  await product.save();
  res
    .status(201)
    .json(new ApiResponse(201, { product }, "Post created successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("owner", "username email");
  res.status(200).json(new ApiResponse(200, { products }));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "owner",
    "username email avatar fullName"
  );
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(new ApiResponse(200, { product }));
});

const getProductsByLoggedInUser = asyncHandler(async (req, res) => {
  const products = await Product.find({ owner: req.user._id }).populate(
    "owner",
    "username email fullName"
  );
  res.status(200).json(new ApiResponse(200, { products }));
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (req.user._id.toString() !== product.owner.toString())
    throw new ApiError(403, "You are not authorized to update this product");

  const { item_name, description, category, price } = req.body;
  if (!item_name || !description || !category || !price)
    throw new ApiError(400, "All fields are required");

  product.item_name = item_name;
  product.description = description;
  product.category = category;
  product.price = price;
  product.isAvailableForRent = req.body.isAvailableForRent;
  product.rentPrice = req.body.rentPrice;

  await product.save();
  res.status(200).json(new ApiResponse(200, { product }));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (req.user._id.toString() !== product.owner.toString())
    throw new ApiError(403, "You are not authorized to delete this product");

  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  await deleteFromCloudinary(product.image, "image", "productImage");
  res
    .status(200)
    .json(
      new ApiResponse(200, { deletedProduct }, "Product deleted successfully")
    );
});
// chcking if fork is working or not
// sample comment will be removed later

export {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByLoggedInUser,
};
