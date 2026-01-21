import React from 'react';
import { DollarSign, ShoppingBag, Users, Zap, ArrowUp, ArrowDown, Globe } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hostinger Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
         <div className="flex items-center space-x-2 text-emerald-800 text-sm font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Live System Active</span>
         </div>
         <div className="flex items-center text-xs text-emerald-700">
            <Globe className="w-3 h-3 mr-1" />
            Auto-deploy enabled
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">$24,500</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-green-600 flex items-center font-medium">
              <ArrowUp className="w-3 h-3 mr-1" /> 12%
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">1,240</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-green-600 flex items-center font-medium">
              <ArrowUp className="w-3 h-3 mr-1" /> 8%
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">AI Tokens Used</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">840K</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-gray-500 flex items-center">
              Gemini 2.5 Flash
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Ad Spend (Meta)</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">$1,200</h3>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
             <div className="flex items-center mt-4 text-xs">
              <span className="text-red-500 flex items-center font-medium">
                <ArrowDown className="w-3 h-3 mr-1" /> 2%
              </span>
              <span className="text-gray-400 ml-2">ROI 3.4x</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((height, i) => {
              // h-64 = 256px, calculate actual pixel height
              const pixelHeight = (height / 100) * 256;
              return (
                <div key={i} className="flex-1 relative group" style={{ height: '256px' }}>
                  <div 
                    className="w-full bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-500 absolute bottom-0"
                    style={{ height: `${pixelHeight}px`, minHeight: '4px' }}
                  ></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                    ${height * 100}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Jan</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent AI Activities</h3>
          <div className="space-y-4">
            {[
              { action: "Product Listing Created", detail: "Ceramic Vase", time: "2 min ago", type: "vision" },
              { action: "Store Theme Updated", detail: "Minimalist Zen", time: "1 hour ago", type: "prompt" },
              { action: "Legal Docs Generated", detail: "Privacy Policy", time: "3 hours ago", type: "legal" },
              { action: "Meta Ad Deployed", detail: "Summer Sale Campaign", time: "5 hours ago", type: "ads" },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full mr-4 ${
                  log.type === 'vision' ? 'bg-blue-500' : 
                  log.type === 'prompt' ? 'bg-purple-500' :
                  log.type === 'ads' ? 'bg-indigo-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.detail}</p>
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;