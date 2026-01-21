import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false,
          error: 'API_KEY not configured in environment variables',
          apiKeyPresent: false,
          apiKeyLength: 0
        },
        { status: 500 }
      );
    }

    // Test if API Key is valid by making a simple request
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent('Say "OK" if you can read this.');
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        success: true,
        message: 'API Key is valid and working',
        apiKeyPresent: true,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 6) + '...',
        testResponse: text
      });
    } catch (apiError: any) {
      return NextResponse.json(
        { 
          success: false,
          error: 'API Key is present but invalid or has errors',
          apiKeyPresent: true,
          apiKeyLength: apiKey.length,
          apiKeyPrefix: apiKey.substring(0, 6) + '...',
          details: apiError?.message || apiError?.toString()
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Unknown error',
        details: error?.toString()
      },
      { status: 500 }
    );
  }
}
