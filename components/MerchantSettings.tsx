'use client';

import React, { useMemo, useState } from 'react';
import { User, Palette, Scale } from 'lucide-react';
import StoreSetup from './StoreSetup';
import LegalAssistant from './LegalAssistant';
import type { StoreConfig } from '../types';

interface MerchantSettingsProps {
  storeConfig: StoreConfig;
  onUpdateConfig: (newConfig: Partial<StoreConfig>) => void;
}

type Tab = 'general' | 'branding' | 'legal';

export default function MerchantSettings({ storeConfig, onUpdateConfig }: MerchantSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const [generalForm, setGeneralForm] = useState({
    name: storeConfig.name,
    email: storeConfig.email,
    currency: storeConfig.currency,
  });

  const menu = useMemo(
    () =>
      [
        { id: 'general' as const, label: 'General Info', icon: User },
        { id: 'branding' as const, label: 'Branding', icon: Palette },
        { id: 'legal' as const, label: 'Legal', icon: Scale },
      ] as const,
    []
  );

  const handleGeneralSave = () => {
    onUpdateConfig({
      name: generalForm.name,
      email: generalForm.email,
      currency: generalForm.currency,
    });
    alert('Store profile updated successfully!');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Settings</h2>
          </div>
          <nav className="p-2 space-y-1">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

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
                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={generalForm.email}
                    onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={generalForm.currency}
                  onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
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

        {activeTab === 'branding' && <StoreSetup onApplyTheme={onUpdateConfig} />}
        {activeTab === 'legal' && <LegalAssistant />}
      </div>
    </div>
  );
}

