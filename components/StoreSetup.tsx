import React, { useState } from 'react';
import { Wand2, Store, Loader2, ArrowRight } from 'lucide-react';
import { generateStoreTheme } from '../services/geminiService.ts';
import { StoreConfig } from '../types.ts';

interface StoreSetupProps {
  onApplyTheme: (theme: Partial<StoreConfig>) => void;
}

const StoreSetup: React.FC<StoreSetupProps> = ({ onApplyTheme }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Partial<StoreConfig> | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const themeData = await generateStoreTheme(prompt);
      setResult({
        name: themeData.name,
        description: themeData.description,
        theme: {
          primaryColor: themeData.primaryColor,
          secondaryColor: themeData.secondaryColor,
          fontFamily: themeData.fontFamily,
          heroHeadline: themeData.heroHeadline
        }
      });
    } catch (e: any) {
      alert(e.message || "AI Generation failed. Check API Key in settings.");
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = () => {
    if (result) {
      onApplyTheme(result);
      // Optional: Add a toast or visual feedback here
      alert(`Theme "${result.name}" applied successfully!`);
      setResult(null); // Reset or keep it visible
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Wand2 className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prompt-to-Store</h2>
          <p className="text-sm text-gray-500">Describe your dream store, and AI will build the branding.</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 outline-none"
            rows={4}
            placeholder="e.g., A minimalist store selling handcrafted Japanese ceramic teacups. The vibe should be zen, earthy, and premium."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
            {loading ? 'Designing your store...' : 'Generate Store Theme'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">AI Proposed Branding</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Store Name</label>
                <p className="font-bold text-lg text-gray-900">{result.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Font Family</label>
                <p className="font-medium text-gray-900">{result.theme?.fontFamily}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-gray-500">Tagline / Description</label>
              <p className="text-sm text-gray-700 italic">"{result.description}"</p>
            </div>

            <div className="mt-4 flex space-x-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: result.theme?.primaryColor }}></div>
                  <span className="text-xs font-mono">{result.theme?.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: result.theme?.secondaryColor }}></div>
                  <span className="text-xs font-mono">{result.theme?.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl text-white relative overflow-hidden" style={{ backgroundColor: result.theme?.primaryColor }}>
            <div className="relative z-10">
                <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm mb-2">Hero Preview</span>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{result.theme?.heroHeadline}</h1>
                <p className="opacity-90 text-sm max-w-md">{result.description}</p>
                <button 
                    className="mt-4 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded shadow-lg hover:bg-gray-100 transition"
                    style={{ color: result.theme?.primaryColor }}
                >
                    Shop Now
                </button>
            </div>
            {/* Abstract Shape */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="flex justify-between pt-2">
            <button 
                onClick={() => setResult(null)}
                className="text-gray-500 hover:text-gray-900 text-sm"
            >
                Try Again
            </button>
            <button 
                onClick={applyTheme}
                className="flex items-center bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black"
            >
                Apply Theme <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
  </svg>
);

export default StoreSetup;