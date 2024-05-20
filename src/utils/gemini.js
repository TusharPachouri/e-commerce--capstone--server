import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import e from "express";
// node --version # Should be >= 18
// npm install @google/generative-ai

const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = "AIzaSyDj4yC0DiJVBpbQQltwlQil5QfADQOAvm0";

async function runChat(userPrompt, products) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  let chatHistory = [];
  
  let prompt = `I have the following products in my store: ${products}. Based on the user's query: "${userPrompt}",
   suggest the most suitable product from my store. If the recommended product is not available,
   suggest the most relevant product from the store. and do not forget to mention the price of the product.
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
  // console.log(response.text());
  return response.text();
}

export { runChat };
