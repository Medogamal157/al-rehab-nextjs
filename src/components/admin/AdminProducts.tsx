'use client';

import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, X, Save, Search, Loader2, AlertCircle, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { MultiImageUpload } from './MultiImageUpload';
import { TagInput } from './TagInput';
import { KeyValueInput } from './KeyValueInput';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { parseApiErrors, getFieldError, getGeneralError, FieldError, generateSlug } from '@/lib/form-validation';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id?: string;
  url: string;
  isMain: boolean;
  alt?: string | null;
  order?: number;
  productId?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  englishName?: string | null;
  botanicalName?: string | null;
  slug: string;
  description?: string | null;
  categoryId: string;
  category?: Category | null;
  season?: string | null;
  harvestSeason?: string | null;
  packing?: string | null;
  weight?: string | null;
  origin?: string | null;
  shelfLife?: string | null;
  storageTemp?: string | null;
  availableForms: string[];
  specifications?: Record<string, string> | null;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  englishName: string;
  botanicalName: string;
  slug: string;
  description: string;
  categoryId: string;
  season: string;
  harvestSeason: string;
  packing: string;
  weight: string;
  origin: string;
  shelfLife: string;
  storageTemp: string;
  availableForms: string[];
  specifications: Record<string, string>;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  images: ProductImage[];
}

interface AdminProductsProps {
  initialData: {
    products: Product[];
    categories: Category[];
  };
}

const initialFormData: FormData = {
  name: '',
  englishName: '',
  botanicalName: '',
  slug: '',
  description: '',
  categoryId: '',
  season: '',
  harvestSeason: '',
  packing: '',
  weight: '',
  origin: 'Egypt',
  shelfLife: '',
  storageTemp: '',
  availableForms: [],
  specifications: {},
  features: [],
  isActive: true,
  isFeatured: false,
  displayOrder: 0,
  images: [],
};

export function AdminProducts({ initialData }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [categories] = useState<Category[]>(initialData.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Refetch function for after mutations
  const refetchProducts = async () => {
    try {
      const response = await fetch('/api/products', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Failed to refetch products:', err);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setFormErrors([]);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        englishName: product.englishName || '',
        botanicalName: product.botanicalName || '',
        slug: product.slug,
        description: product.description || '',
        categoryId: product.categoryId,
        season: product.season || '',
        harvestSeason: product.harvestSeason || '',
        packing: product.packing || '',
        weight: product.weight || '',
        origin: product.origin || 'Egypt',
        shelfLife: product.shelfLife || '',
        storageTemp: product.storageTemp || '',
        availableForms: product.availableForms || [],
        specifications: (product.specifications as Record<string, string>) || {},
        features: product.features || [],
        isActive: product.isActive !== false,
        isFeatured: product.isFeatured || false,
        displayOrder: product.displayOrder || 0,
        images: product.images || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        ...initialFormData,
        categoryId: categories[0]?.id || '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormErrors([]);
    setFormData(initialFormData);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const newFormData = { ...formData, name };
    if (!editingProduct && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      newFormData.slug = generateSlug(name);
    }
    setFormData(newFormData);
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: FieldError[] = [];

    if (!formData.name?.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (formData.name.length > 200) {
      errors.push({ field: 'name', message: 'Name must be 200 characters or less' });
    }

    if (!formData.slug?.trim()) {
      errors.push({ field: 'slug', message: 'Slug is required' });
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.push({ field: 'slug', message: 'Slug must be lowercase letters, numbers, and hyphens only' });
    }

    if (!formData.categoryId) {
      errors.push({ field: 'categoryId', message: 'Category is required' });
    }

    if (formData.description && formData.description.length > 5000) {
      errors.push({ field: 'description', message: 'Description must be 5000 characters or less' });
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setFormErrors([]);

    try {
      const payload = {
        ...formData,
        englishName: formData.englishName || undefined,
        botanicalName: formData.botanicalName || undefined,
        description: formData.description || undefined,
        season: formData.season || undefined,
        harvestSeason: formData.harvestSeason || undefined,
        packing: formData.packing || undefined,
        weight: formData.weight || undefined,
        origin: formData.origin || undefined,
        shelfLife: formData.shelfLife || undefined,
        storageTemp: formData.storageTemp || undefined,
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
      };

      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          const errors = parseApiErrors(data);
          if (errors.length > 0) {
            setFormErrors(errors);
            return;
          }
          throw new Error(data.error || 'Failed to update product');
        }

        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          const errors = parseApiErrors(data);
          if (errors.length > 0) {
            setFormErrors(errors);
            return;
          }
          throw new Error(data.error || 'Failed to create product');
        }

        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      await refetchProducts();
      handleCloseModal();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      await refetchProducts();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.botanicalName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading state
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">Manage your product catalog</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or botanical name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => {
          const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '';
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-200 relative">
                {mainImage && (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.isFeatured && (
                    <span className="bg-[#c4a24c] text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <Star className="w-3 h-3" fill="currentColor" />
                      Featured
                    </span>
                  )}
                  {!product.isActive && (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs text-gray-600">
                  {product.category?.name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg text-gray-900 mb-1">{product.name}</h3>
                {product.botanicalName && (
                  <p className="text-sm text-gray-500 italic mb-2">{product.botanicalName}</p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {product.description || 'No description'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div>
                    <span className="font-medium">Origin:</span> {product.origin || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Season:</span> {product.season || 'N/A'}
                  </div>
                  {product.availableForms?.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Forms:</span> {product.availableForms.slice(0, 3).join(', ')}
                      {product.availableForms.length > 3 && ` +${product.availableForms.length - 3} more`}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Create your first product to get started'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
              <h2 className="text-xl text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {/* General error alert */}
              {getGeneralError(formErrors) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{getGeneralError(formErrors)}</span>
                </div>
              )}

              {/* Section: Basic Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Fennel Seeds"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                        getFieldError(formErrors, 'name') ? 'border-red-500 bg-red-50' : ''
                      }`}
                      required
                      maxLength={200}
                    />
                    {getFieldError(formErrors, 'name') && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError(formErrors, 'name')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      placeholder="e.g., fennel-seeds"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                        getFieldError(formErrors, 'slug') ? 'border-red-500 bg-red-50' : ''
                      }`}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (lowercase, hyphens only)</p>
                    {getFieldError(formErrors, 'slug') && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError(formErrors, 'slug')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={formData.englishName}
                      onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                      placeholder="Alternative English name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Botanical Name
                    </label>
                    <input
                      type="text"
                      value={formData.botanicalName}
                      onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                      placeholder="e.g., Foeniculum vulgare"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent italic"
                      maxLength={200}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                      getFieldError(formErrors, 'categoryId') ? 'border-red-500 bg-red-50' : ''
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {getFieldError(formErrors, 'categoryId') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'categoryId')}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed product description..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                      getFieldError(formErrors, 'description') ? 'border-red-500 bg-red-50' : ''
                    }`}
                    maxLength={5000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Detailed description for the product page</span>
                    <span className={`text-xs ${formData.description.length > 4500 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {formData.description.length}/5000
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: Images */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                <MultiImageUpload
                  value={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  folder="products"
                  maxImages={5}
                />
              </div>

              {/* Section: Product Details */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g., Egypt"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Season
                    </label>
                    <input
                      type="text"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      placeholder="e.g., Available all seasons"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harvest Season
                    </label>
                    <input
                      type="text"
                      value={formData.harvestSeason}
                      onChange={(e) => setFormData({ ...formData, harvestSeason: e.target.value })}
                      placeholder="e.g., March - June"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Packing
                    </label>
                    <input
                      type="text"
                      value={formData.packing}
                      onChange={(e) => setFormData({ ...formData, packing: e.target.value })}
                      placeholder="e.g., Polypropylene Bags"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g., 10 kg - 25 kg"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Life
                    </label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                      placeholder="e.g., 18 months"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Temperature
                    </label>
                    <input
                      type="text"
                      value={formData.storageTemp}
                      onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
                      placeholder="e.g., Cool, dry place"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Available Forms */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Forms</h3>
                <TagInput
                  value={formData.availableForms}
                  onChange={(availableForms) => setFormData({ ...formData, availableForms })}
                  label=""
                  placeholder="Add form (e.g., Whole Seeds, Ground/Powder, Crushed)"
                  hint="Press Enter or comma to add each form. Examples: Whole leaves, Crushed, Powder, Fine cut"
                />
              </div>

              {/* Section: Specifications */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                <KeyValueInput
                  value={formData.specifications}
                  onChange={(specifications) => setFormData({ ...formData, specifications })}
                  label=""
                  keyPlaceholder="Specification (e.g., Purity)"
                  valuePlaceholder="Value (e.g., 99% min)"
                  hint="Add key-value pairs for product specifications like Origin, Form, Color, Moisture, Purity, etc."
                />
              </div>

              {/* Section: Key Features */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
                <TagInput
                  value={formData.features}
                  onChange={(features) => setFormData({ ...formData, features })}
                  label=""
                  placeholder="Add feature (e.g., High quality, Food-grade certified)"
                  hint="Press Enter or comma to add each feature. These will be displayed as bullet points."
                />
              </div>

              {/* Section: Display Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#c4a24c] border-gray-300 rounded focus:ring-[#c4a24c]"
                    />
                    <Star className="w-4 h-4 text-[#c4a24c]" />
                    <span className="text-sm text-gray-700">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#2d7a3e] border-gray-300 rounded focus:ring-[#2d7a3e]"
                    />
                    <Eye className="w-4 h-4 text-[#2d7a3e]" />
                    <span className="text-sm text-gray-700">Active (visible on website)</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t -mx-4 px-4 py-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
