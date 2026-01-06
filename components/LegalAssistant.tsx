import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, Loader2, Download } from 'lucide-react';
import { generateLegalDocs } from '../services/geminiService.ts';

const LegalAssistant: React.FC = () => {
  const [formData, setFormData] = useState({ company: '', country: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<{privacyPolicy: string; termsOfService: string; shippingPolicy: string} | null>(null);

  const handleGenerate = async () => {
    if (!formData.company || !formData.country) return;
    setLoading(true);
    try {
      const result = await generateLegalDocs(formData.company, formData.country, formData.address);
      setDocs(result);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to generate policies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-green-100 rounded-lg">
          <Scale className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Legal Compliance</h2>
          <p className="text-sm text-gray-500">Auto-draft policies based on your location using Gemini 3.</p>
        </div>
      </div>

      {!docs ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Store Name</label>
              <input 
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="Ezshopia LLC"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country / Jurisdiction</label>
                <input 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="123 Commerce St"
                />
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
              {loading ? 'Consulting AI...' : 'Generate Legal Policies'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(docs).map(([key, content]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-96">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-4 flex-1 overflow-y-auto text-xs text-gray-600 leading-relaxed font-mono">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
              <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                 <button className="text-sm text-green-600 font-medium flex items-center justify-center w-full hover:underline">
                   <Download className="w-4 h-4 mr-1" /> Save as Page
                 </button>
              </div>
            </div>
          ))}
          <div className="col-span-full flex justify-end">
             <button onClick={() => setDocs(null)} className="text-sm text-gray-500 hover:text-gray-900">Generate Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalAssistant;