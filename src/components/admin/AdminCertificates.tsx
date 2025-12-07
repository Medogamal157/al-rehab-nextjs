'use client';

import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Award, X, Save, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageUpload } from './ImageUpload';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { parseApiErrors, getFieldError, getGeneralError, FieldError } from '@/lib/form-validation';

export interface Certificate {
  id: string;
  name: string;
  fullName?: string;
  description?: string;
  image?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  createdAt: string;
}

interface AdminCertificatesProps {
  initialData?: Certificate[];
}

export function AdminCertificates({ initialData = [] }: AdminCertificatesProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Certificate>>({
    name: '',
    fullName: '',
    description: '',
    image: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    isFeatured: false,
    isActive: true,
    displayOrder: 0,
  });

  // Refetch function for after mutations
  const refetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCertificates(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Failed to refetch certificates:', err);
    }
  };

  const handleOpenModal = (certificate?: Certificate) => {
    setFormErrors([]); // Clear errors when opening modal
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        name: certificate.name,
        fullName: certificate.fullName || '',
        description: certificate.description || '',
        image: certificate.image || '',
        issuer: certificate.issuer || '',
        issueDate: certificate.issueDate ? certificate.issueDate.split('T')[0] : '',
        expiryDate: certificate.expiryDate ? certificate.expiryDate.split('T')[0] : '',
        isFeatured: certificate.isFeatured || false,
        isActive: certificate.isActive !== false,
        displayOrder: certificate.displayOrder || 0,
      });
    } else {
      setEditingCertificate(null);
      setFormData({
        name: '',
        fullName: '',
        description: '',
        image: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        isFeatured: false,
        isActive: true,
        displayOrder: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setFormErrors([]);
    setFormData({
      name: '',
      fullName: '',
      description: '',
      image: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
    });
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: FieldError[] = [];

    if (!formData.name?.trim()) {
      errors.push({ field: 'name', message: 'Short name is required' });
    } else if (formData.name.length > 100) {
      errors.push({ field: 'name', message: 'Short name must be 100 characters or less' });
    }

    if (formData.fullName && formData.fullName.length > 300) {
      errors.push({ field: 'fullName', message: 'Full name must be 300 characters or less' });
    }

    if (formData.description && formData.description.length > 5000) {
      errors.push({ field: 'description', message: 'Description must be 5000 characters or less' });
    }

    if (formData.issuer && formData.issuer.length > 200) {
      errors.push({ field: 'issuer', message: 'Issuer must be 200 characters or less' });
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
      if (editingCertificate) {
        // Update existing certificate
        const response = await fetch(`/api/certificates/${editingCertificate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });

        const data = await response.json();
        
        if (!response.ok) {
          const errors = parseApiErrors(data);
          if (errors.length > 0) {
            setFormErrors(errors);
            return;
          }
          throw new Error(data.error || 'Failed to update certificate');
        }

        toast({
          title: 'Success',
          description: 'Certificate updated successfully',
        });
      } else {
        // Create new certificate
        const response = await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });

        const data = await response.json();
        
        if (!response.ok) {
          const errors = parseApiErrors(data);
          if (errors.length > 0) {
            setFormErrors(errors);
            return;
          }
          throw new Error(data.error || 'Failed to create certificate');
        }

        toast({
          title: 'Success',
          description: 'Certificate created successfully',
        });
      }

      // Refresh certificates list
      await refetchCertificates();
      handleCloseModal();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save certificate',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete certificate');
      }

      toast({
        title: 'Success',
        description: 'Certificate deleted successfully',
      });

      // Refresh certificates list
      await refetchCertificates();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete certificate',
        variant: 'destructive',
      });
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expiryDate) <= thirtyDaysFromNow && !isExpired(expiryDate);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d7a3e]" />
          <p className="text-gray-500">Loading certificates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <Award className="w-16 h-16 text-gray-300" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2d7a3e] text-white rounded-lg hover:bg-[#1d5a2e] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Certificates</h1>
            <p className="text-sm text-gray-500">Manage quality and compliance certificates</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-gray-200 relative">
              {certificate.image && (
                <Image
                  src={certificate.image}
                  alt={certificate.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              {/* Featured Badge */}
              {certificate.isFeatured && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-amber-500 text-white">
                  Featured
                </div>
              )}
              {/* Status Badge */}
              {certificate.expiryDate && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium ${
                  isExpired(certificate.expiryDate)
                    ? 'bg-red-500 text-white'
                    : isExpiringSoon(certificate.expiryDate)
                      ? 'bg-amber-500 text-white'
                      : 'bg-green-500 text-white'
                }`}>
                  {isExpired(certificate.expiryDate)
                    ? 'Expired'
                  : isExpiringSoon(certificate.expiryDate)
                    ? 'Expiring Soon'
                    : 'Active'}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg text-gray-900 mb-1">{certificate.name}</h3>
              {certificate.fullName && <p className="text-sm text-gray-500 mb-2">{certificate.fullName}</p>}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {certificate.description || 'No description'}
              </p>
              <div className="text-xs text-gray-500 space-y-1 mb-4">
                {certificate.issuer && (
                  <div>
                    <span className="font-medium">Issuer:</span> {certificate.issuer}
                  </div>
                )}
                {(certificate.issueDate || certificate.expiryDate) && (
                  <div>
                    <span className="font-medium">Valid:</span>{' '}
                    {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A'} -{' '}
                    {certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : 'N/A'}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(certificate)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(certificate.id)}
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

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No certificates yet</h3>
          <p className="text-gray-400 mb-4">Add your first certificate to get started</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Certificate
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl text-gray-900">
                {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* General error alert */}
              {getGeneralError(formErrors) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{getGeneralError(formErrors)}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., ISO 22000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                      getFieldError(formErrors, 'name') ? 'border-red-500 bg-red-50' : ''
                    }`}
                    required
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Max 100 characters</span>
                    <span className={`text-xs ${(formData.name?.length || 0) > 80 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {formData.name?.length || 0}/100
                    </span>
                  </div>
                  {getFieldError(formErrors, 'name') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'name')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g., ISO 22000:2018 Food Safety"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                      getFieldError(formErrors, 'fullName') ? 'border-red-500 bg-red-50' : ''
                    }`}
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Max 300 characters</span>
                    <span className={`text-xs ${(formData.fullName?.length || 0) > 250 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {formData.fullName?.length || 0}/300
                    </span>
                  </div>
                  {getFieldError(formErrors, 'fullName') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError(formErrors, 'fullName')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer
                </label>
                <input
                  type="text"
                  value={formData.issuer || ''}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., ISO, GLOBALG.A.P."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                    getFieldError(formErrors, 'issuer') ? 'border-red-500 bg-red-50' : ''
                  }`}
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Max 200 characters</span>
                  <span className={`text-xs ${(formData.issuer?.length || 0) > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {formData.issuer?.length || 0}/200
                  </span>
                </div>
                {getFieldError(formErrors, 'issuer') && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError(formErrors, 'issuer')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                    getFieldError(formErrors, 'description') ? 'border-red-500 bg-red-50' : ''
                  }`}
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Max 5000 characters</span>
                  <span className={`text-xs ${(formData.description?.length || 0) > 4500 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {formData.description?.length || 0}/5000
                  </span>
                </div>
                {getFieldError(formErrors, 'description') && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError(formErrors, 'description')}
                  </p>
                )}
              </div>

              <ImageUpload
                value={formData.image || ''}
                onChange={(value) => setFormData({ ...formData, image: value })}
                label="Certificate Image"
                folder="certificates"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate || ''}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder || 0}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#2d7a3e] border-gray-300 rounded focus:ring-[#2d7a3e]"
                  />
                  <span className="text-sm text-gray-700">Featured on Home Page</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#2d7a3e] border-gray-300 rounded focus:ring-[#2d7a3e]"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
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
                      {editingCertificate ? 'Update' : 'Create'}
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
