'use client';

import React, { useState } from 'react';
import Layout from './Layout';
import AiProductCreator from './AiProductCreator';
import Settings from './Settings';
import Dashboard from './Dashboard';
import MarketingAgent from './MarketingAgent';
import Inbox from './Inbox';
import Reviews from './Reviews';
import Workflows from './Workflows';
import Customers from './Customers';
import OrderDetail from './OrderDetail';
import ProductEditor from './ProductEditor';
import { Product, ProductStatus, StoreConfig, Email, Review, Customer, Order, Workflow } from '../types';
import { Plus, Package, LogOut, Edit2, Eye as EyeIcon } from 'lucide-react';

type ActiveTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'inbox'
  | 'reviews'
  | 'marketing'
  | 'workflows'
  | 'settings';

type MerchantAdminConsoleProps = {
  storeKey: string;
  storeConfig: StoreConfig;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  emails: Email[];
  workflows: Workflow[];

  onLogout: () => void;
  onUpdateStoreConfig: (newConfig: Partial<StoreConfig>) => Promise<void> | void;

  onSaveProduct: (partial: Partial<Product>) => Promise<void> | void;
  onUpdateProduct: (updatedProduct: Product) => Promise<void> | void;

  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void> | void;
  onUpdateCustomer: (updatedCustomer: Customer) => Promise<void> | void;

  onReplyEmail: (id: string, replyText: string) => Promise<void> | void;
  onUpdateReview: (updatedReview: Review) => Promise<void> | void;

  onToggleWorkflow: (workflowId: string, nextIsActive: boolean) => Promise<void> | void;
};

export default function MerchantAdminConsole(props: MerchantAdminConsoleProps) {
  const {
    storeKey,
    storeConfig,
    products,
    orders,
    customers,
    reviews,
    emails,
    workflows,
    onLogout,
    onUpdateStoreConfig,
    onSaveProduct,
    onUpdateProduct,
    onUpdateOrderStatus,
    onUpdateCustomer,
    onReplyEmail,
    onUpdateReview,
    onToggleWorkflow,
  } = props;

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Keep currency symbol logic identical to App.tsx (legacy demo UI).
  const currencySymbol = storeConfig.currency === 'EUR' ? '€' : storeConfig.currency === 'GBP' ? '£' : '$';

  const merchantContent = (() => {
    const handleUpdateStoreConfigLocal = (patch: Partial<StoreConfig>) => onUpdateStoreConfig(patch);

    const handleSaveProduct = async (partialProduct: Partial<Product>) => {
      await onSaveProduct(partialProduct);
      setIsCreating(false);
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
      await onUpdateProduct(updatedProduct);
      setEditingProduct(null);
    };

    const handleEmailReply = async (id: string, replyText: string) => onReplyEmail(id, replyText);

    const handleUpdateCustomer = async (updatedCustomer: Customer) => onUpdateCustomer(updatedCustomer);

    const handleUpdateReview = async (updatedReview: Review) => onUpdateReview(updatedReview);

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) =>
      onUpdateOrderStatus(orderId, newStatus);

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return (
          <Settings
            storeConfig={storeConfig}
            onUpdateConfig={handleUpdateStoreConfigLocal}
            hideIntegrations
          />
        );
      case 'marketing':
        return <MarketingAgent products={products} />;
      case 'inbox':
        return <Inbox emails={emails} onReply={handleEmailReply} />;
      case 'reviews':
        return <Reviews reviews={reviews} onUpdateReview={handleUpdateReview} />;
      case 'workflows':
        return <Workflows workflows={workflows} onToggle={(id, next) => onToggleWorkflow(id, next)} />;
      case 'customers':
        return <Customers customers={customers} onUpdateCustomer={handleUpdateCustomer} />;
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-4 h-4 mr-1.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'products':
        if (isCreating) {
          return (
            <AiProductCreator
              onSave={async (partial) => {
                await handleSaveProduct(partial);
              }}
              onCancel={() => setIsCreating(false)}
            />
          );
        }
        if (editingProduct) {
          return (
            <ProductEditor
              product={editingProduct}
              onSave={async (updated) => {
                await handleUpdateProduct(updated);
              }}
              onCancel={() => setEditingProduct(null)}
            />
          );
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currencySymbol}
                        {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: product.seoTitle && product.seoDescription ? '90%' : '30%' }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{product.seoTitle ? '90' : '30'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProduct(product);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
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
  })();

  const storeRootHref = (() => {
    if (typeof window === 'undefined') return `/s/${encodeURIComponent(storeKey)}`;
    const pathname = window.location.pathname || '';
    const isPathMode = pathname.startsWith(`/s/${storeKey}/`) || pathname.startsWith(`/s/${encodeURIComponent(storeKey)}/`);
    return isPathMode ? `/s/${encodeURIComponent(storeKey)}` : '/';
  })();

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as ActiveTab)}
        storeName={storeConfig.name}
        rightActions={
          <a
            href={storeRootHref}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300"
          >
            View store
          </a>
        }
      >
        {merchantContent}
      </Layout>

      {/* View Toggles Fixed on Screen (match App.tsx legacy demo UI) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => {
            onLogout();
          }}
          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full shadow-xl flex items-center text-sm font-bold hover:bg-red-50 transition-transform hover:scale-105 justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>
    </>
  );
}

