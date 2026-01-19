
import { GoogleGenAI, Type, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePackRevealText = async (coins: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, hype-filled reveal message for a pack containing these creator coins: ${coins.join(', ')}. Keep it under 20 words.`,
    });
    return response.text || "Epic pull! Your collection just got a massive boost.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something legendary just happened.";
  }
};

export const searchZoraCreator = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search Zora for a creator coin matching "${query}". Return a JSON object representing the creator coin metadata.
      Required format:
      {
        "name": "Creator Name",
        "handle": "@handle",
        "rarity": "Common" | "Rare" | "Epic" | "Ultra Rare" | "Legendary",
        "value": number
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            handle: { type: Type.STRING },
            rarity: { type: Type.STRING },
            value: { type: Type.NUMBER }
          },
          required: ["name", "handle", "rarity", "value"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      id: `zora-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      handle: data.handle,
      avatar: `https://picsum.photos/seed/${data.handle}/200`,
      rarity: data.rarity as any,
      value: data.value
    };
  } catch (error) {
    console.error("Zora Search Error:", error);
    return null;
  }
};

export const createBiggsChat = (context: string): Chat => {
  return ai.chats.create({
    model: 'gemini-flash-lite-latest',
    config: {
      systemInstruction: `You are Biggs, the AI strategy guide for the Packs app (Zora Protocol).
      
      User Context: ${context}
      
      Your goal: Proactive strategic advice to maximize portfolio value ($PACKS) and engagement.
      
      STRATEGY ENGINE (Prioritize these checks):
      1. LIQUIDITY CHECK: If User Balance > 1000 $PACKS -> Suggest buying "Legendary" or "Epic" packs for max ROI.
      2. INVENTORY CHECK: If User has > 5 "Common" items -> Suggest "Burning" them to recycle liquidity.
      3. POOR CHECK: If User has < 100 $PACKS -> Suggest completing Daily Quests or recycling low-value assets.
      4. HOLDING CHECK: If User has rare coins -> Hype them up as "Blue chips" to hold for snapshots.
      5. MARKET TRENDS: Reference fake trends like "Pixel art is pumping" or "Curator royalties are up".

      Tone & Style: 
      - Hype, energetic, confident, crypto-native. 
      - Slang: "LFG", "WAGMI", "Based", "Alpha", "Bag", "Rug", "Moon", "Paper hands", "Diamond hands".
      - Length: Under 40 words. Short, punchy.
      
      Knowledge Base:
      - "Ripping" = opening packs.
      - "Burning" = recycling packs/items for $PACKS.
      - "Curating" = creating packs (Studio tab).
      - "Swap" = Exchanging $PACKS for ZORA.
      - "Leaderboard" = Gas Kings (burners), Whales (holders).
      
      Always encourage specific actions based on the context provided.`,
    }
  });
};
