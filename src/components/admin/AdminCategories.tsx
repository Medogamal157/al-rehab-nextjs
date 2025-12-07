'use client';

import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderTree, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApi, ApiCategory } from '@/hooks/useApi';
import { ImageUpload } from './ImageUpload';
import { parseApiErrors, getFieldError, getGeneralError, generateSlug, VALIDATION_RULES, FieldError } from '@/lib/form-validation';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
}

const defaultFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '',
  image: '',
  displayOrder: 0,
  isActive: true,
};

const iconOptions = ['Apple', 'Carrot', 'Leaf', 'Wheat', 'Grape', 'Cherry', 'Citrus', 'Flower', 'Tree', 'Sprout', 'Sparkles'];

const colorOptions = [
  { name: 'Red', value: 'red-500' },
  { name: 'Orange', value: 'orange-500' },
  { name: 'Amber', value: 'amber-500' },
  { name: 'Green', value: 'green-500' },
  { name: 'Emerald', value: 'emerald-500' },
  { name: 'Blue', value: 'blue-500' },
  { name: 'yellow', value: 'yellow-500' },
];

interface AdminCategoriesProps {
  initialData?: ApiCategory[];
}

export function AdminCategories({ initialData = [] }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<ApiCategory[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const { loading, error, get, post, put, del } = useApi<ApiCategory[]>();
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  // Refetch function for manual refresh
  const refetchCategories = async () => {
    const result = await get('/api/categories?activeOnly=false');
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  useEffect(() => {
    if (!editingCategory && formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }));
    }
  }, [formData.name, editingCategory]);

  const handleOpenModal = (category?: ApiCategory) => {
    setFormErrors([]); // Clear errors when opening modal
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '',
        image: category.image || '',
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(defaultFormData);
    setFormErrors([]);
  };

  // Client-side validation before submit
  const validateForm = (): boolean => {
    const errors: FieldError[] = [];

    // Name validation
    if (!formData.name.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (formData.name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be 100 characters or less' });
    }

    // Slug validation
    if (!formData.slug.trim()) {
      errors.push({ field: 'slug', message: 'Slug is required' });
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.push({ field: 'slug', message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
    } else if (formData.slug.length > 100) {
      errors.push({ field: 'slug', message: 'Slug must be 100 characters or less' });
    }

    // Description validation
    if (formData.description && formData.description.length > 1000) {
      errors.push({ field: 'description', message: 'Description must be 1000 characters or less' });
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation first
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setFormErrors([]);

    try {
      if (editingCategory) {
        const result = await put(`/api/categories/${editingCategory.id}`, formData);
        if (result.success) {
          await refetchCategories();
          handleCloseModal();
        } else {
          // Parse and display API errors
          const errors = parseApiErrors(result);
          if (errors.length > 0) {
            setFormErrors(errors);
          } else {
            setFormErrors([{ field: '_general', message: result.error || 'Failed to update category' }]);
          }
        }
      } else {
        const result = await post('/api/categories', formData);
        if (result.success) {
          await refetchCategories();
          handleCloseModal();
        } else {
          // Parse and display API errors
          const errors = parseApiErrors(result);
          if (errors.length > 0) {
            setFormErrors(errors);
          } else {
            setFormErrors([{ field: '_general', message: result.error || 'Failed to create category' }]);
          }
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const result = await del(`/api/categories/${id}`);
      if (result.success) {
        await refetchCategories();
      } else {
        alert(result.error || 'Failed to delete category');
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d7a3e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <FolderTree className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">Manage product categories</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-40 bg-gray-200 relative">
              {category.image && (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg">{category.name}</h3>
              </div>
              {!category.isActive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Inactive</div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{category.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Slug: {category.slug}</span>
                <span>Order: {category.displayOrder}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No categories yet</h3>
          <p className="text-gray-400 mb-4">Create your first category to get started</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* General Error Alert */}
              {getGeneralError(formErrors) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Error</p>
                    <p className="text-sm">{getGeneralError(formErrors)}</p>
                  </div>
                  <button type="button" onClick={() => setFormErrors(formErrors.filter(e => e.field !== '_general'))} className="text-red-500 hover:text-red-700">×</button>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                    getFieldError(formErrors, 'name') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                  maxLength={100}
                  placeholder="e.g., Fresh Herbs"
                />
                <div className="mt-1 flex justify-between">
                  {getFieldError(formErrors, 'name') ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'name')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Required • Max 100 characters</p>
                  )}
                  <p className="text-xs text-gray-400">{formData.name.length}/100</p>
                </div>
              </div>

              {/* Slug Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent font-mono text-sm ${
                    getFieldError(formErrors, 'slug') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                  maxLength={100}
                  pattern="^[a-z0-9-]+$"
                  placeholder="e.g., fresh-herbs"
                />
                <div className="mt-1 flex justify-between">
                  {getFieldError(formErrors, 'slug') ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'slug')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Lowercase letters, numbers, and hyphens only • Auto-generated from name</p>
                  )}
                  <p className="text-xs text-gray-400">{formData.slug.length}/100</p>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={1000}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent resize-none ${
                    getFieldError(formErrors, 'description') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of this category..."
                />
                <div className="mt-1 flex justify-between">
                  {getFieldError(formErrors, 'description') ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'description')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Optional</p>
                  )}
                  <p className={`text-xs ${formData.description.length > 900 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {formData.description.length}/1000
                  </p>
                </div>
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                  >
                    <option value="">Select icon</option>
                    {iconOptions.map(icon => (<option key={icon} value={icon}>{icon}</option>))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">Displayed on category cards</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                  >
                    <option value="">Select color</option>
                    {colorOptions.map(c => (<option key={c.value} value={c.value}>{c.name}</option>))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">Theme color for this category</p>
                </div>
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                    min="0"
                  />
                  <p className="mt-1 text-xs text-gray-400">Lower numbers appear first</p>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#2d7a3e] focus:ring-[#2d7a3e] rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <p className="ml-6 text-xs text-gray-400">Show on website</p>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <ImageUpload
                  label="Category Image"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="categories"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
