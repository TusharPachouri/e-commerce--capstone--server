import { runChat } from "../utils/gemini.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateContent = asyncHandler(async (req, res) => {
  const { userPrompt } = req.body;
  if (!userPrompt) throw new ApiError(400, "prompt required");
  const products = await Product.find();
  // console.log(products);
  const content = await runChat(userPrompt, products);
  return res.json(
    new ApiResponse(200, { content }, "Content generated successfully")
  );
});

export { generateContent}