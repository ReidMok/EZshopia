import React, { useState } from 'react';
import { Facebook, Instagram, Loader2, Megaphone, Sparkles, TrendingUp, Target } from 'lucide-react';
import { Product } from '../types.ts';
import { generateMarketingStrategy } from '../services/geminiService.ts';

interface MarketingAgentProps {
  products: Product[];
}

const MarketingAgent: React.FC<MarketingAgentProps> = ({ products }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const generateStrategy = async () => {
    setIsGenerating(true);
    try {
      const text = await generateMarketingStrategy(products);
      setStrategy(text);
    } catch (e: any) {
      console.error(e);
      setStrategy(`<p class='text-red-500'>Error connecting to Marketing AI Agent: ${e.message}</p>`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Marketing Agent</h1>
          <p className="text-sm text-gray-500 mt-1">Automate your Meta Ads strategy using Gemini.</p>
        </div>
        <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                System Online
            </span>
        </div>
      </div>

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Facebook className="w-24 h-24 text-blue-600" />
            </div>
            <div className="flex items-center mb-4 relative z-10">
                <div className="bg-blue-600 p-2 rounded-lg mr-3 shadow-lg shadow-blue-200">
                    <Facebook className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Facebook Ads Manager</h3>
                    <p className="text-xs text-gray-500">Connected as Ezshopia Admin</p>
                </div>
            </div>
            <div className="mt-4 flex space-x-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Active Campaigns</p>
                    <p className="font-bold text-gray-900">3</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Spend / Day</p>
                    <p className="font-bold text-gray-900">$45.00</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Instagram className="w-24 h-24 text-pink-600" />
            </div>
            <div className="flex items-center mb-4 relative z-10">
                <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-2 rounded-lg mr-3 shadow-lg shadow-pink-200">
                    <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Instagram Shopping</h3>
                    <p className="text-xs text-gray-500">Product Sync Active</p>
                </div>
            </div>
             <div className="mt-4">
                <button className="w-full text-xs font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 py-2 rounded-lg transition-colors">
                    View Catalog Status
                </button>
            </div>
        </div>
      </div>

      {/* AI Strategy Generator */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center mb-4 md:mb-0">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Campaign Strategist</h3>
                    <p className="text-sm text-gray-500">Let AI analyze your {products.length} products and build a plan.</p>
                </div>
            </div>
            <button 
                onClick={generateStrategy}
                disabled={isGenerating || products.length === 0}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                {isGenerating ? 'Analyzing Market...' : 'Generate Campaign'}
            </button>
        </div>

        <div className="p-8 min-h-[300px] bg-white">
            {!strategy ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12 border-2 border-dashed border-gray-100 rounded-xl">
                    <Target className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Click "Generate Campaign" to receive a tailored strategy.</p>
                </div>
            ) : (
                <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-indigo-700">
                    <div dangerouslySetInnerHTML={{ __html: strategy }} />
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button className="text-sm text-gray-500 hover:text-gray-900 mr-4" onClick={() => setStrategy(null)}>Discard</button>
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm">
                            Deploy to Ads Manager
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MarketingAgent;