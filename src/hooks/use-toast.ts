'use client';

import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    const message = title || description || '';
    const options = description && title ? { description } : {};

    switch (variant) {
      case 'destructive':
        sonnerToast.error(message, options);
        break;
      case 'success':
        sonnerToast.success(message, options);
        break;
      default:
        sonnerToast(message, options);
    }
  };

  return { toast };
}

// Also export a standalone toast function for convenience
export function toast(options: ToastOptions) {
  const { title, description, variant = 'default' } = options;
  const message = title || description || '';
  const toastOptions = description && title ? { description } : {};

  switch (variant) {
    case 'destructive':
      sonnerToast.error(message, toastOptions);
      break;
    case 'success':
      sonnerToast.success(message, toastOptions);
      break;
    default:
      sonnerToast(message, toastOptions);
  }
}
