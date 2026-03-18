import React, { useMemo } from 'react';
import { Product, StoreConfig } from '../types.ts';
import { ShoppingBag, Menu, Search, X, Instagram, Facebook, Twitter, ArrowRight, Plus } from 'lucide-react';

function formatMoney(currency: string, amount: number) {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return `${symbol}${amount.toFixed(2)}`;
}

interface StorefrontProps {
  products: Product[];
  config: StoreConfig;
  onExit: () => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, config, onExit }) => {
  const activeProducts = useMemo(() => products.filter(p => p.status === 'ACTIVE'), [products]);
  const primary = config.theme.primaryColor;
  const secondary = config.theme.secondaryColor;

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: config.theme.fontFamily }}>
      {/* Dynamic Announcement Bar */}
      <div className="py-2 text-center text-[11px] sm:text-xs font-semibold text-white px-4" style={{ backgroundColor: secondary }}>
        Free shipping over $50 • 30-day returns • Secure checkout
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-500 md:hidden mr-4" />
              <a href="./" className="text-lg sm:text-2xl font-extrabold tracking-tight" style={{ color: secondary }}>
                {config.name}
              </a>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="./#products" className="text-gray-900 hover:text-gray-500 font-semibold text-sm">Shop</a>
              <a href="./#products" className="text-gray-900 hover:text-gray-500 font-semibold text-sm">New</a>
              <a href="./#products" className="text-gray-900 hover:text-gray-500 font-semibold text-sm">About</a>
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
      <div className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">New season essentials</p>
                <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  {config.theme.heroHeadline}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
                  {config.description}
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#products"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white shadow-sm"
                    style={{ backgroundColor: primary }}
                  >
                    Shop now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="#products"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Browse best sellers
                  </a>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                  <div className="text-xs text-gray-600">
                    <div className="font-bold text-gray-900">30-day</div>
                    <div>returns</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="font-bold text-gray-900">Secure</div>
                    <div>payments</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="font-bold text-gray-900">Fast</div>
                    <div>shipping</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 rounded-[32px] blur-2xl opacity-40" style={{ backgroundColor: primary }} />
                <div className="relative rounded-[28px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 font-extrabold tracking-widest text-sm">HERO IMAGE</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-900">Featured drop</div>
                      <div className="text-xs font-semibold text-gray-500">Limited</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      A Shopify-style storefront template, powered by Ezshopia.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured products</h2>
            <p className="mt-1 text-sm text-gray-600">Clean, Shopify-style cards with real product pages.</p>
          </div>
          <a href="#products" className="text-sm font-semibold hover:underline flex items-center" style={{ color: primary }}>
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        {activeProducts.length === 0 ? (
             <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active products found in catalog.</p>
                <p className="text-sm text-gray-400">Go to Admin > Products to add items.</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
            {activeProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative">
                  <a href={`products/${encodeURIComponent(product.slug || '')}`} className="block">
                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/800'}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </a>

                  {product.tags?.includes('New') && (
                    <span className="absolute top-3 left-3 bg-white/95 border border-gray-200 text-[10px] font-extrabold px-2 py-1 uppercase tracking-wider rounded-full">
                      New
                    </span>
                  )}

                  <button
                    type="button"
                    className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ backgroundColor: primary }}
                    onClick={() => alert('Demo: cart not connected yet')}
                  >
                    <Plus className="w-4 h-4" />
                    Quick add
                  </button>
                </div>

                <div className="mt-4">
                  <a
                    href={`products/${encodeURIComponent(product.slug || '')}`}
                    className="block text-sm font-semibold text-gray-900 hover:underline underline-offset-4"
                    style={{ textDecorationColor: primary }}
                  >
                    {product.title}
                  </a>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-600 truncate">{product.tags?.[0] || 'General'}</div>
                    <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      {formatMoney(config.currency, product.price)}
                    </div>
                  </div>
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