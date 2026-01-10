
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSystemCommentary = async (score: number, status: string) => {
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Nokia 3310 Game Master. The user is playing Snake. 
      Current Score: ${score}. Game Status: ${status}.
      Provide a short, witty, retro-themed comment (max 15 words) in the style of 1990s tech culture.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text || "Keep sliding, snake charmer!";
  } catch (error) {
    console.error("System Error:", error);
    return "Snake on a plane? No, snake on a phone!";
  }
};

export const getStrategyHint = async (score: number) => {
  try {
    const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide one quick pro-tip for high-score Snake players based on a score of ${score}. Be concise.`,
    });
    return response.text;
  } catch (error) {
    return "Don't hit the walls!";
  }
}
