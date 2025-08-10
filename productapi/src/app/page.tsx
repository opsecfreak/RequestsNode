
'use client';

import React, { useState, useEffect } from "react";

interface Product {
  id?: number;
  name: string;
  regular_price: string;
  sale_price?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  manage_stock?: boolean;
  stock_quantity?: number;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  categories?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  type?: 'simple' | 'grouped' | 'external' | 'variable';
  status?: 'draft' | 'pending' | 'private' | 'publish';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    focus_keyword?: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count?: number;
}

// Single Product Form Component
function SingleProductForm({ 
  onSubmit, 
  loading, 
  categories, 
  initialData 
}: { 
  onSubmit: (data: Product) => Promise<boolean>; 
  loading: boolean; 
  categories: Category[];
  initialData?: Product | null;
}) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    regular_price: "",
    sale_price: "",
    description: "",
    short_description: "",
    sku: "",
    manage_stock: false,
    stock_quantity: 0,
    stock_status: 'instock',
    weight: "",
    length: "",
    width: "",
    height: "",
    type: 'simple',
    status: 'publish',
    categories: [],
    seo: {
      title: "",
      description: "",
      keywords: "",
      focus_keyword: ""
    }
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        categories: initialData.categories || [],
        seo: {
          title: "",
          description: "",
          keywords: "",
          focus_keyword: "",
          ...initialData.seo
        }
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        name: "",
        regular_price: "",
        sale_price: "",
        description: "",
        short_description: "",
        sku: "",
        manage_stock: false,
        stock_quantity: 0,
        stock_status: 'instock',
        weight: "",
        length: "",
        width: "",
        height: "",
        type: 'simple',
        status: 'publish',
        categories: [],
        seo: {
          title: "",
          description: "",
          keywords: "",
          focus_keyword: ""
        }
      });
    }
  };

  const updateField = (field: keyof Product, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Single Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.sku}
              onChange={(e) => updateField('sku', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Regular Price *</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.regular_price}
              onChange={(e) => updateField('regular_price', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.sale_price}
              onChange={(e) => updateField('sale_price', e.target.value)}
            />
          </div>
          
          {/* Product Type and Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Type</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
            >
              <option value="simple">Simple</option>
              <option value="grouped">Grouped</option>
              <option value="external">External</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Stock Management */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.stock_status}
              onChange={(e) => updateField('stock_status', e.target.value)}
            >
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
              <option value="onbackorder">On Backorder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.stock_quantity}
              onChange={(e) => updateField('stock_quantity', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              placeholder="e.g., 1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dimensions (L x W x H)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                value={formData.length}
                onChange={(e) => updateField('length', e.target.value)}
                placeholder="Length"
              />
              <input
                type="text"
                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                value={formData.width}
                onChange={(e) => updateField('width', e.target.value)}
                placeholder="Width"
              />
              <input
                type="text"
                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                value={formData.height}
                onChange={(e) => updateField('height', e.target.value)}
                placeholder="Height"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="bg-gray-700 rounded p-3 max-h-32 overflow-auto">
            {categories.length === 0 ? (
              <span className="text-gray-400 text-sm">No categories available</span>
            ) : (
              categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    checked={formData.categories?.some(c => c.id === category.id)}
                    onChange={(e) => {
                      const currentCategories = formData.categories || [];
                      if (e.target.checked) {
                        updateField('categories', [...currentCategories, { id: category.id, name: category.name }]);
                      } else {
                        updateField('categories', currentCategories.filter(c => c.id !== category.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">SEO & RankMath Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                value={formData.seo?.title || ""}
                onChange={(e) => updateField('seo', { ...formData.seo, title: e.target.value })}
                placeholder="SEO optimized title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Focus Keyword</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                value={formData.seo?.focus_keyword || ""}
                onChange={(e) => updateField('seo', { ...formData.seo, focus_keyword: e.target.value })}
                placeholder="Main SEO keyword"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                rows={2}
                value={formData.seo?.description || ""}
                onChange={(e) => updateField('seo', { ...formData.seo, description: e.target.value })}
                placeholder="Meta description for search engines (150-160 characters)"
                maxLength={160}
              />
              <div className="text-xs text-gray-400 mt-1">
                {(formData.seo?.description || "").length}/160 characters
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                value={formData.seo?.keywords || ""}
                onChange={(e) => updateField('seo', { ...formData.seo, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows={2}
            value={formData.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows={4}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Full product description (HTML allowed)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
          disabled={loading || !formData.name || !formData.regular_price}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

// Bulk Product Row Component
function BulkProductRow({ 
  product, 
  index, 
  onUpdate, 
  onRemove, 
  canRemove,
  categories
}: { 
  product: Product; 
  index: number; 
  onUpdate: (index: number, field: keyof Product, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  categories: Category[];
}) {
  return (
    <div className="bg-gray-700 rounded p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Product {index + 1}</h3>
        {canRemove && (
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Name *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">SKU</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.sku}
            onChange={(e) => onUpdate(index, 'sku', e.target.value)}
            placeholder="SKU"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Regular Price *</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.regular_price}
            onChange={(e) => onUpdate(index, 'regular_price', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Sale Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.sale_price}
            onChange={(e) => onUpdate(index, 'sale_price', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Stock Qty</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.stock_quantity}
            onChange={(e) => onUpdate(index, 'stock_quantity', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Stock Status</label>
          <select
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.stock_status}
            onChange={(e) => onUpdate(index, 'stock_status', e.target.value)}
          >
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
            <option value="onbackorder">On Backorder</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.type}
            onChange={(e) => onUpdate(index, 'type', e.target.value)}
          >
            <option value="simple">Simple</option>
            <option value="grouped">Grouped</option>
            <option value="external">External</option>
            <option value="variable">Variable</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Weight</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.weight}
            onChange={(e) => onUpdate(index, 'weight', e.target.value)}
            placeholder="1.5"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Categories</label>
          <select
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.categories?.[0]?.id || ""}
            onChange={(e) => {
              const categoryId = parseInt(e.target.value);
              const category = categories.find(c => c.id === categoryId);
              if (category) {
                onUpdate(index, 'categories', [{ id: category.id, name: category.name }]);
              } else {
                onUpdate(index, 'categories', []);
              }
            }}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">SEO Keywords</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
            value={product.seo?.keywords || ""}
            onChange={(e) => onUpdate(index, 'seo', { ...product.seo, keywords: e.target.value })}
            placeholder="keyword1, keyword2"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Short Description</label>
        <textarea
          className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 text-sm"
          rows={2}
          value={product.short_description}
          onChange={(e) => onUpdate(index, 'short_description', e.target.value)}
          placeholder="Brief product description..."
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [bulkProducts, setBulkProducts] = useState<Product[]>([
    {
      name: "",
      regular_price: "",
      sale_price: "",
      description: "",
      short_description: "",
      sku: "",
      manage_stock: false,
      stock_quantity: 0,
      stock_status: 'instock',
      weight: "",
      length: "",
      width: "",
      height: "",
      type: 'simple',
      status: 'publish',
      categories: [],
      seo: {
        title: "",
        description: "",
        keywords: "",
        focus_keyword: ""
      }
    }
  ]);
  const [activeTab, setActiveTab] = useState<'list' | 'single' | 'bulk' | 'ai-generate'>('list');
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedProduct, setGeneratedProduct] = useState<Product | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    handleGetCategories();
  }, []);

  // GET categories
  const handleGetCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const response = await res.json();
      
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err.message);
    }
  };

  // GET request through our API route
  const handleGetProducts = async () => {
    setLoading(true);
    setStatus("Sending GET request...");
    try {
      const res = await fetch("/api/products?page=1&per_page=10");
      if (!res.ok) throw new Error("Failed to fetch products");
      const response = await res.json();
      
      if (response.success) {
        setProducts(response.data);
        setStatus(response.message);
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
    setLoading(false);
  };

  // POST request through our API route for single product
  const handleInsertProduct = async (productData: Product) => {
    setLoading(true);
    setStatus("Inserting product...");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) throw new Error("Failed to insert product");
      const response = await res.json();
      
      if (response.success) {
        setStatus(response.message);
        setProducts((prev) => [response.data, ...prev]);
        return true;
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Bulk insert products
  const handleBulkInsert = async () => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of bulkProducts) {
      if (product.name && product.regular_price) {
        const success = await handleInsertProduct(product);
        if (success) successCount++;
        else errorCount++;
      }
    }
    
    setStatus(`Bulk insert completed: ${successCount} success, ${errorCount} errors`);
    if (successCount > 0) {
      // Reset bulk products form
      setBulkProducts([{
        name: "",
        regular_price: "",
        sale_price: "",
        description: "",
        short_description: "",
        sku: "",
        manage_stock: false,
        stock_quantity: 0,
        stock_status: 'instock',
        weight: "",
        length: "",
        width: "",
        height: "",
        type: 'simple',
        status: 'publish',
        categories: [],
        seo: {
          title: "",
          description: "",
          keywords: "",
          focus_keyword: ""
        }
      }]);
    }
    setLoading(false);
  };

  // Add new product row to bulk edit
  const addBulkProductRow = () => {
    setBulkProducts([...bulkProducts, {
      name: "",
      regular_price: "",
      sale_price: "",
      description: "",
      short_description: "",
      sku: "",
      manage_stock: false,
      stock_quantity: 0,
      stock_status: 'instock',
      weight: "",
      length: "",
      width: "",
      height: "",
      type: 'simple',
      status: 'publish',
      categories: [],
      seo: {
        title: "",
        description: "",
        keywords: "",
        focus_keyword: ""
      }
    }]);
  };

  // Update bulk product
  const updateBulkProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...bulkProducts];
    updated[index] = { ...updated[index], [field]: value };
    setBulkProducts(updated);
  };

  // Remove bulk product row
  const removeBulkProductRow = (index: number) => {
    if (bulkProducts.length > 1) {
      setBulkProducts(bulkProducts.filter((_, i) => i !== index));
    }
  };

  // AI Product Generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setStatus("Please enter a product description for AI generation");
      return;
    }

    setAiLoading(true);
    setStatus("Generating product with AI...");
    
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          categories: categories
        }),
      });
      
      if (!res.ok) throw new Error("Failed to generate product");
      const response = await res.json();
      
      if (response.success) {
        setGeneratedProduct(response.data);
        const modelInfo = response.model_used ? ` (using ${response.model_used})` : '';
        setStatus("Product generated successfully!" + modelInfo + " You can now review and edit it.");
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Use AI generated product in single form
  const useGeneratedProduct = () => {
    if (generatedProduct) {
      setActiveTab('single');
      // The SingleProductForm will be updated to accept initial data
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">WooCommerce Product Manager</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 flex space-x-1 flex-wrap">
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'list' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('list')}
            >
              List Products
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'single' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('single')}
            >
              Add Single Product
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'bulk' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('bulk')}
            >
              Bulk Add Products
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'ai-generate' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('ai-generate')}
            >
              AI Generate
            </button>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <div className="bg-gray-900 rounded p-3 text-sm">
            <span className="text-gray-300">{status || "No request sent yet."}</span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Product List</h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                onClick={handleGetProducts}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Products"}
              </button>
            </div>
            <div className="bg-gray-900 rounded p-4 max-h-96 overflow-auto">
              {products.length === 0 ? (
                <span className="text-gray-400">No products loaded. Click "Refresh Products" to load data.</span>
              ) : (
                <div className="grid gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="border border-gray-700 rounded p-4 bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <span className="text-green-400 font-semibold">${p.price || p.regular_price}</span>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p><strong>ID:</strong> {p.id}</p>
                        <p><strong>SKU:</strong> {p.sku || 'N/A'}</p>
                        <p><strong>Stock:</strong> {p.stock_status} {p.stock_quantity ? `(${p.stock_quantity})` : ''}</p>
                        <p><strong>Type:</strong> {p.type}</p>
                        {p.short_description && <p><strong>Description:</strong> {p.short_description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'single' && (
          <SingleProductForm
            onSubmit={handleInsertProduct}
            loading={loading}
            categories={categories}
            initialData={generatedProduct}
          />
        )}

        {activeTab === 'bulk' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Bulk Add Products</h2>
              <div className="space-x-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={addBulkProductRow}
                >
                  Add Row
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                  onClick={handleBulkInsert}
                  disabled={loading || bulkProducts.every(p => !p.name || !p.regular_price)}
                >
                  {loading ? "Processing..." : "Insert All Products"}
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-auto">
              {bulkProducts.map((product, index) => (
                <BulkProductRow
                  key={index}
                  product={product}
                  index={index}
                  onUpdate={updateBulkProduct}
                  onRemove={removeBulkProductRow}
                  canRemove={bulkProducts.length > 1}
                  categories={categories}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai-generate' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Product Generation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Description Prompt</label>
                <textarea
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the product you want to create. Be specific about features, target audience, price range, etc. Example: 'Create a wireless bluetooth headphone for gamers, premium quality, around $150, with noise cancellation and RGB lighting'"
                  disabled={aiLoading}
                />
              </div>
              
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded"
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
              >
                {aiLoading ? "Generating..." : "Generate Product with AI"}
              </button>

              {generatedProduct && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Generated Product Preview</h3>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={useGeneratedProduct}
                    >
                      Use This Product
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Name:</strong> {generatedProduct.name}
                    </div>
                    <div>
                      <strong>Price:</strong> ${generatedProduct.regular_price}
                      {generatedProduct.sale_price && ` (Sale: $${generatedProduct.sale_price})`}
                    </div>
                    <div>
                      <strong>SKU:</strong> {generatedProduct.sku}
                    </div>
                    <div>
                      <strong>Stock:</strong> {generatedProduct.stock_quantity}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Short Description:</strong> {generatedProduct.short_description}
                    </div>
                    {generatedProduct.seo && (
                      <div className="md:col-span-2">
                        <strong>SEO Title:</strong> {generatedProduct.seo.title}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
