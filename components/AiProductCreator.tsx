import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Check, AlertCircle, X, Loader2, Tag, FileText, Share2 } from 'lucide-react';
import { fileToGenerativePart, generateProductFromImage } from '../services/geminiService.ts';
import { VisionResult, Product } from '../types.ts';

interface AiProductCreatorProps {
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const AiProductCreator: React.FC<AiProductCreatorProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<VisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setError(null);
      
      // Auto start processing
      setStep('processing');
      try {
        const base64Data = await fileToGenerativePart(file);
        // Use data URL so it survives localStorage + page reloads (objectURL would break)
        const dataUrl = `data:${file.type};base64,${base64Data}`;
        setImagePreview(dataUrl);
        const result = await generateProductFromImage(base64Data, file.type);
        setGeneratedData(result);
        setStep('review');
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to analyze image with AI.");
        setStep('upload');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Logic for drag and drop could go here, simplified for now
  };

  if (step === 'upload') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI Vision-to-Listing</h2>
          <p className="text-gray-500 mt-2">Upload a product photo and let Gemini 2.5 Flash generate your entire product listing, SEO tags, and ad copy.</p>
        </div>

        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {imagePreview && (
            <img src={imagePreview} alt="Processing" className="w-full h-full object-cover rounded-lg opacity-50" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Analyzing Product Visuals...</h3>
        <p className="text-gray-500 mt-2">Identifying features, estimating price, and writing SEO copy.</p>
      </div>
    );
  }

  // Review Step
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-5xl mx-auto flex flex-col md:flex-row overflow-hidden">
      {/* Left: Image & Quick Stats */}
      <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Source Image</h3>
        <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          {imagePreview && <img src={imagePreview} alt="Product" className="w-full h-full object-contain" />}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <Tag className="w-4 h-4 mr-2" />
              Estimated Price
            </div>
            <div className="text-2xl font-bold text-gray-900">${generatedData?.estimatedPrice.toFixed(2)}</div>
          </div>

           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
            <div className="flex items-center text-sm font-medium text-indigo-700 mb-2">
              <Share2 className="w-4 h-4 mr-2" />
              Meta Ads Agent
            </div>
            <p className="text-xs text-indigo-900 italic">"{generatedData?.suggestedAdCopy}"</p>
            <button className="mt-3 w-full text-xs bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition-colors">
              Push to Facebook Ads
            </button>
          </div>
        </div>
      </div>

      {/* Right: Editable Content */}
      <div className="w-full md:w-2/3 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Review AI Generation</h2>
          <div className="flex space-x-3">
             <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
               Discard
             </button>
             <button 
                onClick={() => generatedData && onSave({
                  title: generatedData.title,
                  descriptionHtml: generatedData.descriptionHtml,
                  price: generatedData.estimatedPrice,
                  images: imagePreview ? [imagePreview] : [],
                  seoTitle: generatedData.seoTitle,
                  seoDescription: generatedData.seoDescription,
                  tags: generatedData.tags
                })}
                className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 flex items-center"
              >
               <Check className="w-4 h-4 mr-2" />
               Save Product
             </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
            <input 
              type="text" 
              defaultValue={generatedData?.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Description HTML */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML)</label>
            <div 
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg overflow-y-auto bg-gray-50 text-sm font-mono text-gray-600"
              contentEditable
              suppressContentEditableWarning
            >
              {generatedData?.descriptionHtml}
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              AI generated standard HTML structure with &lt;ul&gt; lists.
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              SEO Preview (Google)
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
               <div className="text-blue-800 text-lg font-medium hover:underline cursor-pointer truncate">
                 {generatedData?.seoTitle}
               </div>
               <div className="text-green-700 text-sm mb-1">
                 https://ezshopia.store/products/sample-slug
               </div>
               <div className="text-gray-600 text-sm line-clamp-2">
                 {generatedData?.seoDescription}
               </div>
            </div>
          </div>
          
           {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Smart Tags</label>
            <div className="flex flex-wrap gap-2">
              {generatedData?.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AiProductCreator;