import React, { ReactNode } from 'react';
import { ShoppingBag, Box, Settings, BarChart3, Menu, Bell, LayoutDashboard, Megaphone, Inbox, MessageSquare, Workflow, Users, Globe } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  storeName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, storeName = "Ezshopia Demo" }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products (AI)', icon: Box },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {storeName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Self-hosted AI Commerce</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
              EZ
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">admin@ezshopia.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
             <div className="hidden md:flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 mr-2">
               <Globe className="w-3 h-3 mr-1" />
               Hostinger Ready
             </div>
             <button className="p-2 text-gray-400 hover:text-gray-600 relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="h-8 w-px bg-gray-200 mx-2"></div>
             <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">v1.2.5</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;