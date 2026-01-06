import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisionResult, StoreConfig } from "../types.ts";

// Helper to safely access env vars
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
    // @ts-ignore
    if (typeof window !== 'undefined' && window.process?.env?.API_KEY) {
      // @ts-ignore
      return window.process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return '';
};

export const hasValidApiKey = (): boolean => {
  return !!getApiKey();
};

const getAiClient = () => {
  const key = getApiKey();
  if (!key) return null; // Return null strictly if no key
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.warn("Failed to initialize AI client", e);
    return null;
  }
};

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- MOCK DATA GENERATORS ---

/**
 * Task 2.1: Prompt-to-Store
 */
export const generateStoreTheme = async (prompt: string): Promise<StoreConfig['theme'] & { name: string; description: string }> => {
  const ai = getAiClient();
  
  // Use Mock if no AI client
  if (!ai) {
    console.warn("Using Mock Data for Store Theme");
    await new Promise(r => setTimeout(r, 1000)); // Fake delay
    return {
      name: "Zen Mock Store",
      description: `Generated from: "${prompt}". A calm, minimalist store focusing on essential products.`,
      primaryColor: "#57534e", // stone-600
      secondaryColor: "#e7e5e4", // stone-200
      fontFamily: "Inter",
      heroHeadline: "Simplicity is the Ultimate Sophistication"
    };
  }

  try {
    const modelId = "gemini-3-flash-preview";
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        primaryColor: { type: Type.STRING },
        secondaryColor: { type: Type.STRING },
        fontFamily: { type: Type.STRING },
        heroHeadline: { type: Type.STRING }
      },
      required: ["name", "description", "primaryColor", "secondaryColor", "fontFamily", "heroHeadline"]
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Branding expert task: Create brand identity for: "${prompt}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (!response.text) throw new Error("No text");
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AI Error, falling back to mock", e);
    return {
      name: "Fallback Store",
      description: "AI generation failed, this is a fallback theme.",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontFamily: "Inter",
      heroHeadline: "Welcome to Our Store"
    };
  }
};

/**
 * Task 2.2: Vision-to-Listing
 */
export const generateProductFromImage = async (base64Image: string, mimeType: string): Promise<VisionResult> => {
  const ai = getAiClient();

  if (!ai) {
    console.warn("Using Mock Data for Product Vision");
    await new Promise(r => setTimeout(r, 1500));
    return {
      title: "Premium Mock Product",
      descriptionHtml: "<p>This is a <strong>simulated</strong> product description because no API key was provided.</p><ul><li>High quality material</li><li>Eco-friendly design</li><li>Durable construction</li></ul>",
      seoTitle: "Premium Mock Product | Best in Class",
      seoDescription: "Discover our premium mock product, perfect for testing the UI layout.",
      tags: ["mock", "demo", "test", "premium"],
      estimatedPrice: 99.99,
      suggestedAdCopy: "✨ Experience the future of mock data! #Ezshopia #Demo"
    };
  }

  try {
    const modelId = "gemini-2.5-flash-image";
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        descriptionHtml: { type: Type.STRING },
        seoTitle: { type: Type.STRING },
        seoDescription: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        estimatedPrice: { type: Type.NUMBER },
        suggestedAdCopy: { type: Type.STRING }
      },
      required: ["title", "descriptionHtml", "seoTitle", "seoDescription", "tags", "estimatedPrice", "suggestedAdCopy"]
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Analyze product image. Generate listing JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (!response.text) throw new Error("Failed");
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Vision AI Error", e);
    return {
      title: "Error Generating Product",
      descriptionHtml: "<p>Could not analyze image. Please check API Key.</p>",
      seoTitle: "Error",
      seoDescription: "Error",
      tags: ["error"],
      estimatedPrice: 0,
      suggestedAdCopy: "Error generating copy."
    };
  }
};

/**
 * Task 2.3: AI Legal Assistant
 */
export const generateLegalDocs = async (companyName: string, country: string, address: string) => {
  const ai = getAiClient();

  if (!ai) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      privacyPolicy: `<h1>Privacy Policy for ${companyName}</h1><p>This is a MOCK privacy policy generated without AI.</p>`,
      termsOfService: `<h1>Terms of Service</h1><p>Welcome to ${companyName}. These are mock terms.</p>`,
      shippingPolicy: `<h1>Shipping</h1><p>We ship everywhere (Mock Policy).</p>`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate legal policies JSON for ${companyName}, ${country}. Keys: privacyPolicy, termsOfService, shippingPolicy. Content: HTML strings.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { privacyPolicy: "Error", termsOfService: "Error", shippingPolicy: "Error" };
  }
};

/**
 * AI Email Draft
 */
export const generateEmailDraft = async (customerName: string, emailBody: string, tone: string) => {
  const ai = getAiClient();
  if (!ai) return `[MOCK DRAFT] Hi ${customerName},\n\nThank you for your email. This is a simulated response in a ${tone} tone.\n\nBest regards,\nEzshopia Support`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Reply to ${customerName}: "${emailBody}". Tone: ${tone}.`
    });
    return response.text || "";
  } catch (e) {
    return "Error generating draft.";
  }
};

/**
 * AI Review Reply
 */
export const generateReviewReply = async (customerName: string, rating: number, comment: string) => {
  const ai = getAiClient();
  if (!ai) return `Hi ${customerName}, thanks for your ${rating}-star review! (Mock Reply)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Reply to review. Customer: ${customerName}, Rating: ${rating}, Comment: ${comment}`
    });
    return response.text || "";
  } catch (e) {
    return "Thanks for your feedback!";
  }
};

/**
 * AI Customer Segmentation
 */
export const analyzeCustomerSegment = async (name: string, spent: number, orderCount: number) => {
  const ai = getAiClient();
  if (!ai) {
    return {
      tags: spent > 100 ? ["Big Spender (Mock)", "VIP"] : ["New Customer (Mock)"],
      insight: "This is a mock insight generated without AI."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze customer ${name}, spent $${spent}, orders ${orderCount}. Return JSON {tags: string[], insight: string}`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { tags: ["Error"], insight: "Could not analyze." };
  }
};

/**
 * Marketing Strategy
 */
export const generateMarketingStrategy = async (products: any[]) => {
  const ai = getAiClient();
  if (!ai) return "<h3>Mock Strategy</h3><p>1. Target Audience: Everyone.</p><p>2. Ad Copy: Buy Now!</p><p>3. Budget: $100/day</p>";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create marketing strategy HTML for ${products.length} products.`
    });
    return response.text || "";
  } catch (e) {
    return "Error generating strategy.";
  }
}