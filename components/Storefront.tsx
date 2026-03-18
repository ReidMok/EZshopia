import React, { useMemo } from 'react';
import { Product, StoreConfig } from '../types.ts';
import { ShoppingBag, Star, Menu, Search, X, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

interface StorefrontProps {
  products: Product[];
  config: StoreConfig;
  onExit: () => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, config, onExit }) => {
  const activeProducts = useMemo(() => products.filter(p => p.status === 'ACTIVE'), [products]);

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: config.theme.fontFamily }}>
      {/* Dynamic Announcement Bar */}
      <div className="py-2 text-center text-xs font-medium text-white px-4" style={{ backgroundColor: config.theme.secondaryColor }}>
        GRAND OPENING SALE — FREE SHIPPING ON ALL ORDERS
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-500 md:hidden mr-4" />
              <span className="text-2xl font-bold tracking-tight" style={{ color: config.theme.secondaryColor }}>
                {config.name}
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-500 font-medium text-sm">Shop All</a>
              <a href="#" className="text-gray-900 hover:text-gray-500 font-medium text-sm">New Arrivals</a>
              <a href="#" className="text-gray-900 hover:text-gray-500 font-medium text-sm">About Us</a>
            </div>

            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              <div className="relative group cursor-pointer">
                <ShoppingBag className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
              <button 
                onClick={onExit}
                className="ml-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center transition-colors border border-gray-300"
              >
                <X className="w-3 h-3 mr-1" /> Exit Preview
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{config.theme.heroHeadline.split(' ').slice(0, 3).join(' ')}</span>{' '}
                  <span className="block" style={{ color: config.theme.primaryColor }}>{config.theme.heroHeadline.split(' ').slice(3).join(' ')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {config.description}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg transition-transform hover:scale-105" style={{ backgroundColor: config.theme.primaryColor }}>
                      Shop Collection
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* Placeholder Hero Image using Primary Color Tint */}
             <div className="w-full h-full opacity-20" style={{ backgroundColor: config.theme.primaryColor }}></div>
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-4xl opacity-20 rotate-12">
                STORE HERO IMAGE
             </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <a href="#" className="text-sm font-medium hover:underline flex items-center" style={{ color: config.theme.primaryColor }}>
                View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
        </div>
        
        {activeProducts.length === 0 ? (
             <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active products found in catalog.</p>
                <p className="text-sm text-gray-400">Go to Admin > Products to add items.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
            {activeProducts.map((product) => (
                <div key={product.id} className="group relative">
                <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                    <img
                        src={product.images[0] || 'https://via.placeholder.com/400'}
                        alt={product.title}
                        className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
                    />
                    {product.tags.includes('New') && (
                        <span className="absolute top-2 left-2 bg-white text-xs font-bold px-2 py-1 uppercase tracking-wide rounded">New</span>
                    )}
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                    <h3 className="text-sm text-gray-700">
                        <a
                          href={`/products/${encodeURIComponent(product.slug || '')}`}
                          className="text-left hover:underline cursor-pointer"
                          style={{ textDecorationColor: config.theme.primaryColor }}
                        >
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.title}
                        </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 capitalize">{product.tags[0] || 'General'}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                        {config.currency === 'USD' ? '$' : '€'}{product.price.toFixed(2)}
                    </p>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">{config.name}</h3>
                    <p className="text-gray-400 text-sm max-w-xs">{config.description}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
                        <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Connect</h3>
                    <div className="flex space-x-4">
                        <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter</p>
                        <div className="flex">
                            <input type="email" placeholder="Enter your email" className="bg-gray-800 border-none text-white text-sm px-4 py-2 rounded-l-md w-full focus:ring-1 focus:ring-white" />
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-r-md text-sm font-bold hover:bg-gray-100" style={{ color: config.theme.primaryColor }}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} {config.name}. Powered by Ezshopia.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Storefront;