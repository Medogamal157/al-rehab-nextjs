'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductImage {
  url: string;
  isMain: boolean;
  id?: string;
}

interface MultiImageUploadProps {
  value: ProductImage[];
  onChange: (value: ProductImage[]) => void;
  label?: string;
  folder?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  value,
  onChange,
  label = 'Product Images',
  folder = 'products',
  maxImages = 5,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max images
    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newImages: ProductImage[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          setError('Only JPEG, PNG, WebP, and GIF images are allowed');
          continue;
        }

        // Upload file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        // Handle response format: { success: true, data: { url: "..." } }
        const imageUrl = result.data?.url || result.url;
        if (!imageUrl) {
          throw new Error('No URL returned from upload');
        }
        
        newImages.push({
          url: imageUrl,
          isMain: value.length === 0 && newImages.length === 0, // First image is main
        });
      }

      onChange([...value, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeImage = (imageUrl: string) => {
    const newImages = value.filter(img => img.url !== imageUrl);
    const removedImage = value.find(img => img.url === imageUrl);
    
    // If removed image was main and there are still images, make first one main
    if (removedImage?.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    onChange(newImages);
  };

  const setMainImage = (imageUrl: string) => {
    const newImages = value.map((img) => ({
      ...img,
      isMain: img.url === imageUrl,
    }));
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Image Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {value.filter(img => img.url).map((image, index) => (
          <div
            key={image.url || index}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${
              image.isMain ? 'border-[#c4a24c]' : 'border-gray-200'
            }`}
          >
            {image.url ? (
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setMainImage(image.url)}
                className={`p-2 rounded-full ${
                  image.isMain 
                    ? 'bg-[#c4a24c] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#c4a24c] hover:text-white'
                } transition-colors`}
                title={image.isMain ? 'Main image' : 'Set as main image'}
              >
                <Star className="w-4 h-4" fill={image.isMain ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => removeImage(image.url)}
                className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main badge */}
            {image.isMain && (
              <div className="absolute top-1 left-1 bg-[#c4a24c] text-white text-xs px-2 py-0.5 rounded">
                Main
              </div>
            )}
          </div>
        ))}

        {/* Add Image Button */}
        {value.filter(img => img.url).length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#2d7a3e] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#2d7a3e] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Hint */}
      <p className="text-xs text-gray-500 mt-1">
        {value.filter(img => img.url).length}/{maxImages} images • Click star to set main image • Supports JPEG, PNG, WebP, GIF
      </p>
    </div>
  );
}
