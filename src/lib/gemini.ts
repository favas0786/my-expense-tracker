import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import type { Transaction } from "../types"; 


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Google Gemini API key in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);


const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
 
});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];


export async function analyzeSpending(
  transactions: Transaction[]
): Promise<string> {
  if (transactions.length === 0) {
    return "There are no transactions to analyze. Please add some expenses.";
  }

  const transactionsString = transactions
    .map(
      (tx) =>
        `Date: ${tx.date}, Description: ${
          tx.description
        }, Category: ${tx.category}, Amount: ${tx.amount.toFixed(2)}`
    )
    .join("\n");

  const prompt = `
    You are a friendly and practical financial advisor.
    A user has provided you with their recent spending history.
    Please analyze it and provide a brief summary (under 150 words) with actionable insights.

    Rules:
    - Identify the top 2-3 spending categories.
    - Give one or two practical, easy-to-follow tips for improvement.
    - Be encouraging, not judgmental.
    - Format your response using simple markdown (bolding, bullet points).

    Here is the user's spending data:
    ---
    ${transactionsString}
    ---
  `;

  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I wasn't able to analyze your spending. Please try again later.";
  }
}