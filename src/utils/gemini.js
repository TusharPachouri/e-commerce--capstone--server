import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
// node --version # Should be >= 18
// npm install @google/generative-ai

const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = "AIzaSyDj4yC0DiJVBpbQQltwlQil5QfADQOAvm0";

async function runChat(userPrompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  let chatHistory = [];
  let prompt = `Search for a product matching the following details:
  Category: ${productDetails.category}
  Brand: ${productDetails.brand}
  Price Range: ${productDetails.priceRange}
  Specifications: ${productDetails.specifications}
  Include any other relevant information here.
  `;

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  chatHistory.push({ user: prompt, response: result.response.text() });
  console.log(response.text());
}

runChat("My name is tushar");
