import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Tag as TagIcon, DollarSign, FileText, Eye } from 'lucide-react';
import { Product, ProductStatus } from '../types.ts';

interface ProductEditorProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [imagePreview, setImagePreview] = useState<string>(product.images[0] || '');

  const previewSlug = formData.slug || 'product-slug';
  const previewHref = (() => {
    if (typeof window === 'undefined') return `/products/${encodeURIComponent(previewSlug)}`;
    const pathname = window.location.pathname || '';
    // Merchant admin runs at /s/{storeKey}/admin, so we can always build correct public product URL.
    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/');
      const storeKey = parts[2] || 'demo';
      return `/s/${encodeURIComponent(storeKey)}/products/${encodeURIComponent(previewSlug)}`.replace(/\/{2,}/g, '/');
    }
    // Fallback: subdomain style /products/[slug]
    return `/products/${encodeURIComponent(previewSlug)}`;
  })();
  const previewAbsolute = typeof window !== 'undefined' ? `${window.location.origin}${previewHref}` : previewHref;

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        handleInputChange('images', [result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProduct: Product = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedProduct);
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      handleInputChange('tags', [...formData.tags, tag.trim()]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">Update product information and details</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter product title"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Compare At Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare At Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice || ''}
                  onChange={(e) => handleInputChange('compareAtPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00 (optional)"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ProductStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={ProductStatus.DRAFT}>DRAFT</option>
                  <option value={ProductStatus.ACTIVE}>ACTIVE</option>
                  <option value={ProductStatus.ARCHIVED}>ARCHIVED</option>
                </select>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="product-url-slug"
                />
                <p className="mt-1 text-xs text-gray-500">Used in product URL</p>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="border-b border-gray-200 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Product Image
            </label>
            <div className="flex items-start space-x-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">Upload a product image (JPG, PNG, etc.)</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description (HTML)
            </label>
            <textarea
              value={formData.descriptionHtml}
              onChange={(e) => handleInputChange('descriptionHtml', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
              placeholder="Enter product description (HTML supported)"
            />
            <p className="mt-2 text-xs text-gray-500">You can use HTML tags like &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>
          </div>

          {/* Tags */}
          <div className="border-b border-gray-200 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* SEO Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-gray-500" />
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter SEO title (appears in search results)"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.seoTitle.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter SEO description (appears in search results)"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.seoDescription.length}/160 characters</p>
              </div>
              {/* SEO Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Preview
                </label>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <a
                    href={previewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-800 text-lg font-medium hover:underline truncate block cursor-pointer"
                  >
                    {formData.seoTitle || 'Your product title will appear here'}
                  </a>
                  <a
                    href={previewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-700 text-sm mb-1 hover:underline block"
                  >
                    {previewAbsolute}
                  </a>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {formData.seoDescription || 'Your SEO description will appear here'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Ads Copy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Ads Copy
            </label>
            <textarea
              value={formData.adCopy || ''}
              onChange={(e) => handleInputChange('adCopy', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter ad copy for Facebook/Meta ads"
            />
            <p className="mt-1 text-xs text-gray-500">Optional: Copy for social media advertising</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
