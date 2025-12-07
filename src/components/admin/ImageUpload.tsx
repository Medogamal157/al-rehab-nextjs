'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  required?: boolean;
  folder?: 'products' | 'categories' | 'certificates' | 'general';
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = 'Image', 
  required = false,
  folder = 'general',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Check file type - only allow images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Upload to server
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        setPreview(result.data.url);
        onChange(result.data.url);
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative mb-3">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            type="button"
            onClick={handleRemove}
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 bg-white text-red-500 hover:bg-red-50 border-red-200"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      {!preview && (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full h-32 border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            isUploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-[#2d7a3e] hover:bg-[#2d7a3e]/5 text-gray-500 hover:text-[#2d7a3e]'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-[#2d7a3e]" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <p className="text-sm">Click to upload image</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP, GIF up to 5MB</p>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* URL Input */}
      <div className="mt-3">
        <label className="block text-xs text-gray-500 mb-1">Or paste image URL:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
          />
          {value && (
            <Button
              type="button"
              onClick={handleRemove}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-500 hover:bg-red-50"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
