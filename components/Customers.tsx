import React, { useState } from 'react';
import { Users, Search, Filter, MoreHorizontal, Sparkles, Loader2, Mail } from 'lucide-react';
import { Customer } from '../types.ts';
import { analyzeCustomerSegment } from '../services/geminiService.ts';

interface CustomersProps {
  customers: Customer[];
  onUpdateCustomer: (customer: Customer) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, onUpdateCustomer }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAiAnalysis = async (customer: Customer) => {
    setAnalyzingId(customer.id);
    try {
        const result = await analyzeCustomerSegment(customer.name, customer.totalSpent, customer.ordersCount);
        onUpdateCustomer({
            ...customer,
            tags: result.tags,
            aiInsights: result.insight
        });
    } catch (e: any) {
        console.error(e);
        alert(e.message || "Analysis failed.");
    } finally {
        setAnalyzingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-1">Manage relationships and view AI insights.</p>
            </div>
            <div className="flex space-x-2">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status/Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <React.Fragment key={customer.id}>
                        <tr className="hover:bg-gray-50 group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-xs text-gray-500">{customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                    {customer.tags && customer.tags.length > 0 ? customer.tags.map((tag, i) => (
                                        <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            tag.includes('VIP') ? 'bg-purple-100 text-purple-800' :
                                            tag.includes('Risk') ? 'bg-red-100 text-red-800' : 
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {tag}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-gray-400">No tags</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.ordersCount} orders
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${customer.totalSpent.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => handleAiAnalysis(customer)}
                                        disabled={analyzingId === customer.id}
                                        className="text-purple-600 hover:text-purple-900 font-medium text-xs flex items-center disabled:opacity-50"
                                        title="Generate AI Tags"
                                    >
                                        {analyzingId === customer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        {customer.aiInsights && (
                            <tr className="bg-purple-50/50">
                                <td colSpan={5} className="px-6 py-2 text-xs text-purple-700 flex items-center">
                                    <Sparkles className="w-3 h-3 mr-2 text-purple-500" />
                                    <span className="font-semibold mr-1">AI Insight:</span> {customer.aiInsights}
                                </td>
                            </tr>
                        )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Customers;