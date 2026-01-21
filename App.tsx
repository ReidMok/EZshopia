import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import AiProductCreator from './components/AiProductCreator.tsx';
import Settings from './components/Settings.tsx';
import Dashboard from './components/Dashboard.tsx';
import MarketingAgent from './components/MarketingAgent.tsx';
import Inbox from './components/Inbox.tsx';
import Reviews from './components/Reviews.tsx';
import Workflows from './components/Workflows.tsx';
import Customers from './components/Customers.tsx';
import SuperAdminDashboard from './components/SuperAdminDashboard.tsx';
import Login from './components/Login.tsx';
import Storefront from './components/Storefront.tsx';
import OrderDetail from './components/OrderDetail.tsx';
import { Product, ProductStatus, StoreConfig, Email, Review, Customer, Order } from './types.ts';
import { Plus, Package, Repeat, LogOut, Eye, AlertTriangle } from 'lucide-react';

// Default Config
const DEFAULT_CONFIG: StoreConfig = {
  id: 'store_1',
  name: 'Ezshopia Demo Store',
  subdomain: 'demo',
  plan: 'PRO',
  description: 'A next-gen AI store.',
  currency: 'USD',
  email: 'admin@ezshopia.com',
  address: '',
  enableAi: true, // Default to enabled if API Key is present
  theme: {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#1e293b', // slate-800
    fontFamily: 'Inter',
    heroHeadline: 'Welcome to the Future of Commerce'
  }
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    storeId: 'demo',
    title: 'Minimalist Ceramic Vase',
    slug: 'minimalist-ceramic-vase',
    descriptionHtml: '<p>Handcrafted with love.</p>',
    price: 45.00,
    images: ['https://picsum.photos/400/400'],
    status: ProductStatus.ACTIVE,
    seoTitle: 'Minimalist Ceramic Vase | Home Decor',
    seoDescription: 'Beautiful white ceramic vase.',
    tags: ['decor', 'vase', 'minimalist'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_EMAILS: Email[] = [
    { id: 'e1', from: 'Sarah Jenkins', subject: 'Question about shipping to Canada', body: 'Hi, I really love the Ceramic Vase but I was wondering if you ship to Toronto? And how long does it take?', date: '10:30 AM', isRead: false, status: 'PENDING' },
    { id: 'e2', from: 'Mike Ross', subject: 'Order #1002 Return', body: 'The item arrived broken. I need a refund immediately.', date: 'Yesterday', isRead: true, status: 'PENDING' },
];

const INITIAL_REVIEWS: Review[] = [
    { id: 'r1', productId: '1', productName: 'Minimalist Ceramic Vase', customer: 'Emily Clark', rating: 5, comment: 'Absolutely stunning! Looks exactly like the photos.', date: '2 days ago', status: 'APPROVED' },
    { id: 'r2', productId: '1', productName: 'Minimalist Ceramic Vase', customer: 'John Doe', rating: 2, comment: 'Smaller than I expected.', date: '1 day ago', status: 'PENDING' },
];

const INITIAL_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Alice Wong', email: 'alice@example.com', totalSpent: 1250.50, ordersCount: 12, lastOrderDate: '2023-10-24', tags: [] },
    { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', totalSpent: 45.00, ordersCount: 1, lastOrderDate: '2023-10-23', tags: ['New'] },
    { id: 'c3', name: 'Charlie Day', email: 'charlie@example.com', totalSpent: 299.99, ordersCount: 2, lastOrderDate: '2023-09-15', tags: [] },
];

const INITIAL_ORDERS: Order[] = [
    { id: '#ORD-1002', customer: 'Alice Wong', total: 125.50, status: 'PAID', date: 'Oct 24, 2023', items: 3 },
    { id: '#ORD-1001', customer: 'Bob Smith', total: 45.00, status: 'SHIPPED', date: 'Oct 23, 2023', items: 1 },
    { id: '#ORD-1000', customer: 'Charlie Day', total: 299.99, status: 'PENDING', date: 'Oct 22, 2023', items: 5 },
];

// Define View Modes
type ViewMode = 'LOGIN' | 'MERCHANT' | 'SUPER_ADMIN' | 'STOREFRONT';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOGIN'); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mountError, setMountError] = useState<string | null>(null);

  // Initial states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Load from localStorage safely
  useEffect(() => {
    try {
      console.log("App Mounting...");
      const savedProducts = localStorage.getItem('ezshopia_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedConfig = localStorage.getItem('ezshopia_config');
      if (savedConfig) setStoreConfig(JSON.parse(savedConfig));

      const savedEmails = localStorage.getItem('ezshopia_emails');
      if (savedEmails) setEmails(JSON.parse(savedEmails));

      const savedReviews = localStorage.getItem('ezshopia_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedCustomers = localStorage.getItem('ezshopia_customers');
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedOrders = localStorage.getItem('ezshopia_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (error: any) {
      console.error('Failed to load storage:', error);
      setMountError(error.message);
    }
  }, []);

  // Persist effects
  useEffect(() => { try { localStorage.setItem('ezshopia_products', JSON.stringify(products)); } catch(e){} }, [products]);
  useEffect(() => { try { localStorage.setItem('ezshopia_config', JSON.stringify(storeConfig)); } catch(e){} }, [storeConfig]);
  useEffect(() => { try { localStorage.setItem('ezshopia_emails', JSON.stringify(emails)); } catch(e){} }, [emails]);
  useEffect(() => { try { localStorage.setItem('ezshopia_reviews', JSON.stringify(reviews)); } catch(e){} }, [reviews]);
  useEffect(() => { try { localStorage.setItem('ezshopia_customers', JSON.stringify(customers)); } catch(e){} }, [customers]);
  useEffect(() => { try { localStorage.setItem('ezshopia_orders', JSON.stringify(orders)); } catch(e){} }, [orders]);

  // Handlers
  const handleUpdateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleSaveProduct = (partialProduct: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      storeId: storeConfig.id,
      title: partialProduct.title || 'Untitled',
      slug: (partialProduct.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
      descriptionHtml: partialProduct.descriptionHtml || '',
      price: partialProduct.price || 0,
      images: partialProduct.images || [],
      status: ProductStatus.DRAFT,
      seoTitle: partialProduct.seoTitle || '',
      seoDescription: partialProduct.seoDescription || '',
      tags: partialProduct.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...partialProduct
    };

    setProducts([newProduct, ...products]);
    setIsCreating(false);
  };

  const handleEmailReply = (id: string, replyText: string) => {
      setEmails(emails.map(e => e.id === id ? { ...e, status: 'REPLIED', replyDraft: replyText } : e));
  };

  const handleUpdateReview = (updatedReview: Review) => {
      setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
  }

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  }

  // --- ERROR BOUNDARY UI ---
  if (mountError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200 max-w-lg text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
          <p className="text-gray-600 mb-4">Something went wrong while loading the application.</p>
          <code className="block bg-gray-100 p-3 rounded text-left text-xs font-mono mb-4 text-red-600 overflow-auto">
            {mountError}
          </code>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW RENDERERS ---

  if (viewMode === 'LOGIN') {
    return <Login onLogin={(role) => setViewMode(role)} />;
  }

  if (viewMode === 'STOREFRONT') {
    return <Storefront products={products} config={storeConfig} onExit={() => setViewMode('MERCHANT')} />;
  }

  if (viewMode === 'SUPER_ADMIN') {
    return (
      <div className="relative">
        <SuperAdminDashboard />
        <button 
          onClick={() => setViewMode('MERCHANT')}
          className="fixed bottom-4 right-4 bg-white text-slate-900 border border-slate-300 px-4 py-2 rounded-full shadow-xl flex items-center text-sm font-bold hover:bg-slate-50 z-50"
        >
          <Repeat className="w-4 h-4 mr-2" /> Exit God Mode
        </button>
      </div>
    );
  }

  const renderMerchantContent = () => {
    switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'settings': return <Settings storeConfig={storeConfig} onUpdateConfig={handleUpdateStoreConfig} />;
        case 'marketing': return <MarketingAgent products={products} />;
        case 'inbox': return <Inbox emails={emails} onReply={handleEmailReply} />;
        case 'reviews': return <Reviews reviews={reviews} onUpdateReview={handleUpdateReview} />;
        case 'workflows': return <Workflows />;
        case 'customers': return <Customers customers={customers} onUpdateCustomer={handleUpdateCustomer} />;
        case 'orders':
            if (selectedOrder) {
                return (
                    <OrderDetail 
                        order={selectedOrder} 
                        onClose={() => setSelectedOrder(null)}
                        onUpdateStatus={handleUpdateOrderStatus}
                    />
                );
            }
            return (
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                        <tr 
                            key={order.id} 
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        );
        case 'products':
            if (isCreating) {
                return <AiProductCreator onSave={handleSaveProduct} onCancel={() => setIsCreating(false)} />;
            }
            return (
                <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your catalog. {products.length} items total.</p>
                    </div>
                    <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product (AI)
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                {product.images[0] ? (
                                    <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" />
                                ) : (
                                    <Package className="h-6 w-6 m-2 text-gray-400" />
                                )}
                                </div>
                                <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.title}</div>
                                <div className="text-xs text-gray-500">SKU: {product.id.toUpperCase()}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {product.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {storeConfig.currency === 'EUR' ? '€' : storeConfig.currency === 'GBP' ? '£' : '$'}
                            {product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-1 w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: product.seoTitle && product.seoDescription ? '90%' : '30%' }}
                                ></div>
                                </div>
                                <span className="text-xs text-gray-500">{product.seoTitle ? '90' : '30'}</span>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            );
        default:
            return <div>Not found</div>;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} storeName={storeConfig.name}>
        {renderMerchantContent()}
      </Layout>
      
      {/* View Toggles Fixed on Screen */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button 
            onClick={() => setViewMode('STOREFRONT')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center text-sm font-bold hover:bg-emerald-700 transition-transform hover:scale-105 justify-center"
        >
            <Eye className="w-4 h-4 mr-2" /> View Live Store
        </button>
        <button 
            onClick={() => setViewMode('SUPER_ADMIN')}
            className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center text-sm font-bold hover:bg-slate-800 transition-transform hover:scale-105 justify-center"
        >
            <Repeat className="w-4 h-4 mr-2" /> God Mode
        </button>
        <button 
            onClick={() => setViewMode('LOGIN')}
            className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full shadow-xl flex items-center text-sm font-bold hover:bg-red-50 transition-transform hover:scale-105 justify-center"
        >
            <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>
    </>
  );
};

export default App;