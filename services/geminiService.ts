
import { GoogleGenAI, Type } from "@google/genai";
import { Cafe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCafeReview = async (cafeName: string): Promise<string> => {
  try {
    const prompt = `為一家位於台北，名為「${cafeName}」的咖啡廳寫一段簡短、生動且真實的評論。請使用繁體中文。評論內容可以提及咖啡、氣氛、服務或任何特別之處。風格可以是有趣的、中性的，甚至是帶點小小抱怨的，以增加真實感。`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating review:", error);
    return "抱歉，AI 評論生成失敗，請稍後再試。";
  }
};

export const findCafesByNeeds = async (userInput: string, cafes: Cafe[]): Promise<number[]> => {
  const simplifiedCafes = cafes.map(cafe => ({
    id: cafe.id,
    name: cafe.name,
    description: cafe.description,
    menuItems: cafe.menu.map(item => item.name).join(', '),
    hasOutletSeats: cafe.seats.outlet.total > 0,
    address: cafe.address,
  }));

  const systemInstruction = `You are a friendly and knowledgeable cafe expert in Taipei. Your task is to help users find the perfect cafe based on their specific needs.
You will be given a user's request and a list of available cafes in JSON format.
Analyze the user's request for keywords and concepts related to atmosphere (quiet, retro), amenities (outlets, no time limit), food/drinks (Basque cheesecake), and furniture (high tables).
Compare these needs against the provided cafe data (name, description, menu items).
Your goal is to identify the top 3 cafes that best match the user's request.
You MUST respond ONLY with a JSON object containing the IDs of the top 3 recommended cafes, in order of relevance. Do not include any other text, explanation, or greetings in your response.`;

  const prompt = `User request: "${userInput}"\n\nCafe list: ${JSON.stringify(simplifiedCafes)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cafeIds: {
              type: Type.ARRAY,
              description: "An array of the top 3 cafe IDs that best match the user's request, sorted by relevance.",
              items: {
                type: Type.NUMBER,
              }
            }
          },
          required: ["cafeIds"]
        },
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.cafeIds)) {
        return result.cafeIds as number[];
    }
    
    console.error("Failed to parse cafe IDs from Gemini response:", result);
    return [];

  } catch (error) {
    console.error("Error finding cafes:", error);
    return [];
  }
};
