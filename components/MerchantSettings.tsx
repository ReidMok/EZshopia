'use client';

import React, { useMemo, useState } from 'react';
import { User, Palette, Scale, Users, CreditCard, Truck, Globe } from 'lucide-react';
import StoreSetup from './StoreSetup';
import LegalAssistant from './LegalAssistant';
import type { StoreConfig } from '../types';

interface MerchantSettingsProps {
  storeConfig: StoreConfig;
  onUpdateConfig: (newConfig: Partial<StoreConfig>) => void;
}

type Tab = 'general' | 'branding' | 'legal' | 'domains' | 'team' | 'payment' | 'shipping';

export default function MerchantSettings({ storeConfig, onUpdateConfig }: MerchantSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const [generalForm, setGeneralForm] = useState({
    name: storeConfig.name,
    email: storeConfig.email,
    currency: storeConfig.currency,
  });

  const [domainInput, setDomainInput] = useState(storeConfig.customDomains?.[0] || '');

  const normalizeDomain = (input: string) => {
    const raw = (input || '').trim().toLowerCase();
    if (!raw) return '';
    // Remove protocol + path.
    const noProto = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    // Remove port.
    return noProto.replace(/:\d+$/, '');
  };

  const menu = useMemo(
    () =>
      [
        { id: 'general' as const, label: 'General Info', icon: User },
        { id: 'branding' as const, label: 'Branding', icon: Palette },
        { id: 'legal' as const, label: 'Legal', icon: Scale },
        { id: 'domains' as const, label: 'Domains', icon: Globe },
        { id: 'team' as const, label: 'Team & Roles', icon: Users },
        { id: 'payment' as const, label: 'Payments', icon: CreditCard },
        { id: 'shipping' as const, label: 'Shipping', icon: Truck },
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

        {activeTab === 'domains' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-3xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Domains</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-bold text-gray-900">Temporary URL</div>
                <div className="text-xs text-gray-500 mt-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/s/${encodeURIComponent(storeConfig.subdomain)}` : ''}
                </div>
                <div className="text-xs text-gray-500 mt-2">It will keep working even after you add a custom domain.</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom domain</label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="example.com"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="text-xs text-gray-500 mt-2">
                  After saving, requests to this domain will be routed to your storefront.
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                  onClick={() => {
                    const host = normalizeDomain(domainInput);
                    if (!host) {
                      alert('Please input a valid domain.');
                      return;
                    }
                    onUpdateConfig({ customDomains: [host] });
                    alert('Domain saved. Please wait DNS propagation then refresh storefront.');
                  }}
                >
                  Save domain
                </button>
                {storeConfig.customDomains?.[0] ? (
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      onUpdateConfig({ customDomains: [] });
                      setDomainInput('');
                      alert('Custom domain removed.');
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <div className="font-bold mb-1">DNS setup</div>
                <div className="text-xs text-blue-800/90">
                  Point your domain (root) DNS to this platform (A/CNAME). After DNS is live, your storefront will work on the custom domain.
                </div>
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
                  <td className="py-3 text-sm font-medium">owner@your-store.com (You)</td>
                  <td className="py-3 text-sm text-gray-500">Owner</td>
                  <td className="py-3 text-sm text-right text-green-600">Full Access</td>
                </tr>
                <tr>
                  <td className="py-3 text-sm font-medium">support@your-store.com</td>
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
}

