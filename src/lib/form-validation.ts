// Client-side form validation helpers and error parsing

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

// Parse API error response into field-specific errors
export function parseApiErrors(error: unknown): FieldError[] {
  const errors: FieldError[] = [];

  if (!error) return errors;

  // Handle Zod validation errors from API
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    
    // Check for details.message (Zod error JSON string)
    if (errorObj.details && typeof errorObj.details === 'object') {
      const details = errorObj.details as Record<string, unknown>;
      
      // Parse Zod error message JSON
      if (details.message && typeof details.message === 'string') {
        try {
          const zodErrors = JSON.parse(details.message);
          if (Array.isArray(zodErrors)) {
            for (const zodError of zodErrors) {
              if (zodError.path && zodError.message) {
                errors.push({
                  field: Array.isArray(zodError.path) ? zodError.path.join('.') : String(zodError.path),
                  message: zodError.message,
                });
              }
            }
          }
        } catch {
          // Not valid JSON, use as-is
        }
      }
    }

    // Check for direct error message
    if (errorObj.error && typeof errorObj.error === 'string') {
      // Check for field-specific patterns
      const fieldPatterns = [
        { pattern: /slug/i, field: 'slug' },
        { pattern: /name/i, field: 'name' },
        { pattern: /email/i, field: 'email' },
        { pattern: /image/i, field: 'image' },
        { pattern: /category/i, field: 'categoryId' },
      ];

      let matched = false;
      for (const { pattern, field } of fieldPatterns) {
        if (pattern.test(errorObj.error as string)) {
          errors.push({ field, message: errorObj.error as string });
          matched = true;
          break;
        }
      }

      if (!matched) {
        errors.push({ field: '_general', message: errorObj.error as string });
      }
    }
  }

  // Handle string error
  if (typeof error === 'string') {
    errors.push({ field: '_general', message: error });
  }

  return errors;
}

// Get error message for a specific field
export function getFieldError(errors: FieldError[], fieldName: string): string | undefined {
  return errors.find(e => e.field === fieldName)?.message;
}

// Get general (non-field-specific) errors
export function getGeneralError(errors: FieldError[]): string | undefined {
  return errors.find(e => e.field === '_general')?.message;
}

// Validation rules for common fields
export const VALIDATION_RULES = {
  // Category fields
  categoryName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  categorySlug: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-z0-9-]+$/,
    patternMessage: 'Only lowercase letters, numbers, and hyphens allowed',
  },
  categoryDescription: {
    maxLength: 1000,
  },

  // Product fields
  productName: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  productSlug: {
    required: true,
    minLength: 1,
    maxLength: 200,
    pattern: /^[a-z0-9-]+$/,
    patternMessage: 'Only lowercase letters, numbers, and hyphens allowed',
  },
  productDescription: {
    maxLength: 5000,
  },

  // Certificate fields
  certificateName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  certificateDescription: {
    maxLength: 2000,
  },

  // Common fields
  displayOrder: {
    min: 0,
  },
} as const;

// Validate a single field
export function validateField(value: string | number | undefined, rules: ValidationRule): string | null {
  const strValue = String(value ?? '');

  if (rules.required && !strValue.trim()) {
    return 'This field is required';
  }

  if (rules.minLength && strValue.length < rules.minLength) {
    return `Must be at least ${rules.minLength} character${rules.minLength > 1 ? 's' : ''}`;
  }

  if (rules.maxLength && strValue.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`;
  }

  if (rules.pattern && strValue && !rules.pattern.test(strValue)) {
    return rules.patternMessage || 'Invalid format';
  }

  return null;
}

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
