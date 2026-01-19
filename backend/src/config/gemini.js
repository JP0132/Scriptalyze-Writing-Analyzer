const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Singleton instance of the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;
