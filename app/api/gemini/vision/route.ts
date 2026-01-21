import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API_KEY not configured in environment variables' },
        { status: 500 }
      );
    }

    const { base64Image, mimeType } = await request.json();

    if (!base64Image || !mimeType) {
      return NextResponse.json(
        { error: 'Missing base64Image or mimeType' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      {
        text: 'Analyze product image. Generate listing JSON with keys: title, descriptionHtml, seoTitle, seoDescription, tags (array), estimatedPrice (number), suggestedAdCopy.',
      },
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: 'No response from Gemini API' },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Gemini Vision API Error:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to generate product from image',
        details: error?.toString()
      },
      { status: 500 }
    );
  }
}
