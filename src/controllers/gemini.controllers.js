import { geminiContent } from "../utils/gemini.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!title) throw new ApiError(400, "Prompt is required");
  const response = await geminiContent(prompt);
  return res.json(
    new ApiResponse(200, { response }, "Ai response generated successfully")
  );
});

export { generateContent}