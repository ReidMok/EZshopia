import { GoogleGenerativeAI, SchemaType, FunctionDeclarationSchemaType } from "@google/generative-ai";
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
  if (!key) {
    console.warn("API Key not found. Check environment variable API_KEY.");
    return null;
  }
  try {
    return new GoogleGenerativeAI(key);
  } catch (e) {
    console.error("Failed to initialize AI client", e);
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
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const promptText = `Branding expert task: Create brand identity for: "${prompt}". Return JSON with keys: name, description, primaryColor, secondaryColor, fontFamily, heroHeadline.`;
    
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("No text");
    return JSON.parse(text);
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
  // 优先使用服务端 API 路由（更安全）
  try {
    const response = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      console.error("Server API route error:", errorData);
      throw new Error(errorData.error || errorData.details || `API request failed with status ${response.status}`);
    }
  } catch (fetchError: any) {
    console.error("Server API route failed:", fetchError);
    
    // 回退到客户端直接调用（向后兼容）
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
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        {
          text: "Analyze product image. Generate listing JSON with keys: title, descriptionHtml, seoTitle, seoDescription, tags (array), estimatedPrice (number), suggestedAdCopy."
        }
      ]);
      
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Failed");
      return JSON.parse(text);
    } catch (e: any) {
      console.error("Vision AI Error", e);
      const errorMessage = e?.message || e?.toString() || "Unknown error";
      const hasApiKey = !!getApiKey();
      
      // 显示更详细的错误信息
      const detailedError = hasApiKey 
        ? `API Error: ${errorMessage}${errorMessage.includes('API_KEY') ? ' Check Hostinger environment variables.' : ''}`
        : 'Please check API Key in environment variables. Visit /api/gemini/test to verify.';
      
      return {
        title: "Error Generating Product",
        descriptionHtml: `<p>Could not analyze image. ${detailedError}</p><p style="color: #666; font-size: 12px; margin-top: 8px;">Check browser console (F12) for detailed error logs.</p>`,
        seoTitle: "Error",
        seoDescription: hasApiKey ? `API Error: ${errorMessage.substring(0, 100)}` : "API Key Missing",
        tags: ["error"],
        estimatedPrice: 0,
        suggestedAdCopy: hasApiKey ? `Error: ${errorMessage.substring(0, 50)}` : "Error generating copy."
      };
    }
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
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const result = await model.generateContent(`Generate legal policies JSON for ${companyName}, ${country}. Keys: privacyPolicy, termsOfService, shippingPolicy. Content: HTML strings.`);
    const response = await result.response;
    return JSON.parse(response.text() || "{}");
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
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Reply to ${customerName}: "${emailBody}". Tone: ${tone}.`);
    const response = await result.response;
    return response.text() || "";
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
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Reply to review. Customer: ${customerName}, Rating: ${rating}, Comment: ${comment}`);
    const response = await result.response;
    return response.text() || "";
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
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const result = await model.generateContent(`Analyze customer ${name}, spent $${spent}, orders ${orderCount}. Return JSON {tags: string[], insight: string}`);
    const response = await result.response;
    return JSON.parse(response.text() || "{}");
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
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create marketing strategy HTML for ${products.length} products.`);
    const response = await result.response;
    return response.text() || "";
  } catch (e) {
    return "Error generating strategy.";
  }
}