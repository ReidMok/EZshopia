import React, { useState } from 'react';
import { LayoutDashboard, Users, Server, ShieldAlert, Activity, DollarSign, Search, Power, Settings as SettingsIcon, Database } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED';
  mrr: number;
  geminiUsage: number; // Token count
}

const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'Apple Store', subdomain: 'apple', plan: 'ENTERPRISE', status: 'ACTIVE', mrr: 299, geminiUsage: 1500000 },
  { id: 't2', name: 'Minimalist Ceramics', subdomain: 'ceramics', plan: 'PRO', status: 'ACTIVE', mrr: 79, geminiUsage: 45000 },
  { id: 't3', name: 'Bad Store', subdomain: 'scam', plan: 'FREE', status: 'SUSPENDED', mrr: 0, geminiUsage: 1200 },
];

const SuperAdminDashboard: React.FC = () => {
  const [tenants, setTenants] = useState(MOCK_TENANTS);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => 
      t.id === id ? { ...t, status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : t
    ));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Ezshopia <span className="text-indigo-400">God Mode</span></h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
           <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700 rounded-full">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span>System Healthy</span>
           </div>
           <span className="text-slate-400">admin@ezshopia.com</span>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <p className="text-slate-400 text-sm font-medium mb-2">Total ARR</p>
             <h3 className="text-3xl font-bold text-white">$145.2k</h3>
             <div className="mt-2 text-green-400 text-xs flex items-center">
               <Activity className="w-3 h-3 mr-1" /> +12% this month
             </div>
           </div>
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <p className="text-slate-400 text-sm font-medium mb-2">Active Tenants</p>
             <h3 className="text-3xl font-bold text-white">1,204</h3>
             <div className="mt-2 text-blue-400 text-xs flex items-center">
               <Users className="w-3 h-3 mr-1" /> +45 new today
             </div>
           </div>
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <p className="text-slate-400 text-sm font-medium mb-2">Global AI Usage (Tokens)</p>
             <h3 className="text-3xl font-bold text-white">85.4M</h3>
             <div className="mt-2 text-purple-400 text-xs flex items-center">
               <Server className="w-3 h-3 mr-1" /> Cost est. $420
             </div>
           </div>
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <p className="text-slate-400 text-sm font-medium mb-2">Platform Load</p>
             <h3 className="text-3xl font-bold text-green-400">24%</h3>
             <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-green-500 h-full w-1/4"></div>
             </div>
           </div>
        </div>

        {/* Tenant Management */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-400" />
              Tenant Database
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Find store..."
                className="bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <table className="min-w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Store Name / Subdomain</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Usage</th>
                <th className="px-6 py-4">MRR</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{tenant.name}</div>
                    <div className="text-xs text-indigo-400">{tenant.subdomain}.ezshopia.com</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      tenant.plan === 'ENTERPRISE' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' :
                      tenant.plan === 'PRO' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center text-xs font-bold ${tenant.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>
                       <span className={`w-2 h-2 rounded-full mr-2 ${tenant.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       {tenant.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                    {(tenant.geminiUsage / 1000).toFixed(1)}k
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">
                    ${tenant.mrr}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleStatus(tenant.id)}
                      className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title={tenant.status === 'ACTIVE' ? "Suspend Store" : "Activate Store"}
                    >
                      {tenant.status === 'ACTIVE' ? <Power className="w-4 h-4 text-red-400" /> : <Power className="w-4 h-4 text-green-400" />}
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* System Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-bold mb-4 flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-orange-400" />
                Global Controls
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700">
                   <div>
                     <p className="text-sm font-bold">Maintenance Mode</p>
                     <p className="text-xs text-slate-500">Disable all store fronts temporarily.</p>
                   </div>
                   <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="w-3 h-3 bg-slate-400 rounded-full absolute top-1 left-1"></div>
                   </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700">
                   <div>
                     <p className="text-sm font-bold">API Rate Limiting</p>
                     <p className="text-xs text-slate-500">Global cap: 100 req/s per tenant.</p>
                   </div>
                   <span className="text-xs font-mono text-green-400">ENABLED</span>
                </div>
             </div>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Payment Gateways
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-300">Stripe Platform Fee</span>
                   <span className="text-sm font-bold text-white bg-slate-700 px-2 py-1 rounded">2.0%</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-300">PayPal Connect</span>
                   <span className="text-xs text-green-400">Active</span>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;