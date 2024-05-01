import { User } from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import { Rental } from "../models/rental.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addTransaction = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!quantity) throw new ApiError(400, "Price is required");
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  const buyer = req.user._id;
  const seller = product.owner;
  const price = product.price * quantity;

  const transaction = new Transaction({
    seller,
    buyer,
    product: productId,
    price,
    quantity,
  });
  res
    .status(201)
    .json(
      new ApiResponse(201, { transaction }, "Transaction created successfully")
    );
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("seller", "username email fullName")
    .populate("buyer", "username email avatar fullName")
    .populate("product", "item_name price");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transactions },
        "Transactions retrieved successfully"
      )
    );
});

const getTransactionsByLoggedInUser = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ buyer: req.user._id })
    .populate("seller", "username email")
    .populate("buyer", "username email avatar fullName")
    .populate("product", "item_name price");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transactions },
        "Transactions retrieved successfully"
      )
    );
});

const getTransactionsByProductOwner = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ seller: req.user._id })
    .populate("seller", "username email")
    .populate("buyer", "username email avatar fullName")
    .populate("product", "item_name price");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transactions },
        "Transactions retrieved successfully"
      )
    );
});

const updateStatusOrPayed = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) throw new ApiError(404, "Transaction not found");
  if (req.user._id.toString() !== transaction.seller.toString())
    throw new ApiError(
      403,
      "You are not authorized to update this transaction"
    );
  const { status, payed } = req.body;
  if (!status && !payed) throw new ApiError(400, "Status or payed is required");
  if (status) transaction.status = status;
  if (payed) transaction.payed = payed;
  await transaction.save();
  res.status(200).json(new ApiResponse(200, { transaction }));
});

export { addTransaction };
