// utils/gemini.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (query) => {
  try {
    if (!query) {
      throw new Error("Query parameter is required");
    }

    console.log(`Received query: ${query}`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(query);

    const text = result.response.text();
    console.log(`Gemini API response: ${text}`);

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Let the route handler decide how to respond
  }
};

export default getGeminiResponse;
