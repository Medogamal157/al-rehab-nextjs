'use client';

import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      };

      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage = result.error || `HTTP error! status: ${response.status}`;
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }

      setData(result.data || null);
      options?.onSuccess?.(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [options]);

  const get = useCallback((url: string) => request(url, 'GET'), [request]);
  const post = useCallback((url: string, body: unknown) => request(url, 'POST', body), [request]);
  const put = useCallback((url: string, body: unknown) => request(url, 'PUT', body), [request]);
  const del = useCallback((url: string) => request(url, 'DELETE'), [request]);

  return {
    data,
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    setData,
    setError,
  };
}

// Helper hook for fetching data on mount
export function useFetch<T>(url: string, deps: unknown[] = []) {
  const api = useApi<T>();
  
  const refetch = useCallback(() => {
    api.get(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { ...api, refetch };
}

// Types for API entities
export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products?: ApiProduct[];
}

export interface ApiProduct {
  id: string;
  name: string;
  englishName?: string;
  botanicalName?: string;
  slug: string;
  description?: string;
  categoryId: string;
  category?: ApiCategory;
  season?: string;
  harvestSeason?: string;
  packing?: string;
  weight?: string;
  origin?: string;
  shelfLife?: string;
  storageTemp?: string;
  availableForms: string[];
  specifications?: Record<string, string>;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  images?: ApiProductImage[];
}

export interface ApiProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
  createdAt: string;
}

export interface ApiCertificate {
  id: string;
  name: string;
  fullName?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiExportRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  productInterest?: string;
  quantity?: string;
  message?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'QUOTED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

export interface ApiContactInfo {
  id: string;
  key: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  phoneAlt?: string;
  fax?: string;
  email?: string;
  emailSales?: string;
  emailSupport?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
  workingHours?: string;
  latitude?: number;
  longitude?: number;
  mapEmbed?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Generate slug helper
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
