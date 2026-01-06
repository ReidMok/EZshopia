import React, { useState } from 'react';
import { User, Palette, Scale, CreditCard, Truck, Link2, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import StoreSetup from './StoreSetup.tsx';
import LegalAssistant from './LegalAssistant.tsx';
import { StoreConfig } from '../types.ts';
import { hasValidApiKey } from '../services/geminiService.ts';

interface SettingsProps {
  storeConfig: StoreConfig;
  onUpdateConfig: (newConfig: Partial<StoreConfig>) => void;
}

const Settings: React.FC<SettingsProps> = ({ storeConfig, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState('general');
  // Local state for General tab form
  const [generalForm, setGeneralForm] = useState({
    name: storeConfig.name,
    email: storeConfig.email,
    currency: storeConfig.currency
  });

  // Safe check for API key
  const hasApiKey = hasValidApiKey();
  const isAiEnabled = storeConfig.enableAi && hasApiKey;

  const handleGeneralSave = () => {
    onUpdateConfig({
      name: generalForm.name,
      email: generalForm.email,
      currency: generalForm.currency
    });
    alert("Store profile updated successfully!");
  };

  const menu = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'integrations', label: 'Integrations (API)', icon: Link2 },
    { id: 'branding', label: 'AI Branding', icon: Palette },
    { id: 'legal', label: 'Legal (AI)', icon: Scale },
    { id: 'team', label: 'Team & Roles', icon: Users },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-4 border-b border-gray-100">
             <h2 className="font-bold text-gray-900">Settings</h2>
           </div>
           <nav className="p-2 space-y-1">
             {menu.map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === item.id 
                     ? 'bg-blue-50 text-blue-700' 
                     : 'text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 <item.icon className="w-4 h-4 mr-3" />
                 {item.label}
               </button>
             ))}
           </nav>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto">
         {activeTab === 'general' && (
           <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-3xl">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Store Profile</h3>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                   <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                   <input 
                      type="email" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                   />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={generalForm.currency}
                    onChange={(e) => setGeneralForm({...generalForm, currency: e.target.value})}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
               </div>
               <div className="pt-4">
                 <button 
                    onClick={handleGeneralSave}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                 >
                   Save Changes
                 </button>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'branding' && (
            <StoreSetup onApplyTheme={onUpdateConfig} />
         )}
         
         {activeTab === 'legal' && <LegalAssistant />}

         {activeTab === 'integrations' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">System Integrations</h3>
                <div className="space-y-6">
                    {/* Gemini Configuration - Environment Based with User Toggle */}
                    <div className={`p-5 border ${isAiEnabled ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'} rounded-lg transition-colors`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center ${isAiEnabled ? 'bg-white' : 'bg-gray-100'}`}>
                                    <span className={`font-bold text-lg ${isAiEnabled ? 'text-blue-500' : 'text-gray-400'}`}>G</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Google Gemini API</h4>
                                    <p className="text-xs text-gray-500">Required for Product AI, Legal, and Marketing agents.</p>
                                </div>
                            </div>
                            
                            {hasApiKey && (
                                 <button 
                                    onClick={() => onUpdateConfig({ enableAi: !storeConfig.enableAi })}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                        isAiEnabled 
                                        ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                        : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                    }`}
                                 >
                                    {isAiEnabled ? 'Disconnect' : 'Connect'}
                                 </button>
                            )}
                        </div>
                        
                        <div className="flex items-center mt-2">
                            {isAiEnabled ? (
                                <div className="flex items-center text-green-700 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Active & Connected
                                </div>
                            ) : (
                                <div className="flex items-center text-gray-500 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    {hasApiKey ? 'Disconnected by User' : 'API Key Missing in Environment'}
                                </div>
                            )}
                        </div>
                        
                        {!hasApiKey && (
                            <p className="mt-2 text-xs text-red-600">
                                Please configure <code>API_KEY</code> in your environment variables (.env.local).
                            </p>
                        )}
                    </div>

                    {/* Meta Mock */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                f
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Meta Graph API</h4>
                                <p className="text-xs text-gray-500">For Marketing Agent & Catalog Sync.</p>
                            </div>
                        </div>
                        <button className="text-sm text-gray-400 border border-gray-200 px-3 py-1 rounded cursor-not-allowed">Coming Soon</button>
                    </div>

                    {/* Stripe Mock */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Stripe Payments</h4>
                                <p className="text-xs text-gray-500">Checkout processing.</p>
                            </div>
                        </div>
                         <button className="text-sm text-gray-400 border border-gray-200 px-3 py-1 rounded cursor-not-allowed">Coming Soon</button>
                    </div>
                </div>
            </div>
         )}

         {activeTab === 'team' && (
             <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                    <button className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg">Invite Member</button>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left text-xs font-medium text-gray-500 pb-2">User</th>
                            <th className="text-left text-xs font-medium text-gray-500 pb-2">Role</th>
                            <th className="text-right text-xs font-medium text-gray-500 pb-2">Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-3 text-sm font-medium">admin@ezshopia.com (You)</td>
                            <td className="py-3 text-sm text-gray-500">Owner</td>
                            <td className="py-3 text-sm text-right text-green-600">Full Access</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-sm font-medium">support@ezshopia.com</td>
                            <td className="py-3 text-sm text-gray-500">Support Agent</td>
                            <td className="py-3 text-sm text-right text-gray-500">Inbox, Orders</td>
                        </tr>
                    </tbody>
                </table>
             </div>
         )}

         {activeTab === 'payment' && (
           <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
             <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
             <p>Stripe & PayPal integrations are managed here in the production version.</p>
           </div>
         )}
         
         {activeTab === 'shipping' && (
           <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
             <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
             <p>Configure shipping zones and rates.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default Settings;