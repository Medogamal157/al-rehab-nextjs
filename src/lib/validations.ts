import { z } from 'zod';

// Category schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(1000).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// Product schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  englishName: z.string().max(200).optional(),
  botanicalName: z.string().max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  season: z.string().max(100).optional(),
  harvestSeason: z.string().max(100).optional(),
  packing: z.string().max(200).optional(),
  weight: z.string().max(100).optional(),
  origin: z.string().max(100).optional(),
  shelfLife: z.string().max(100).optional(),
  storageTemp: z.string().max(100).optional(),
  availableForms: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional(),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

// Product Image schema
export const productImageSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  url: z.string().min(1, 'URL is required').max(500),
  alt: z.string().max(200).optional(),
  isMain: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// Certificate schemas
export const certificateCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  fullName: z.string().max(300).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().max(5000).optional(),
  image: z.string().optional(), // Allow base64 images (can be very long)
  issuer: z.string().max(200).optional(),
  issueDate: z.string().optional().nullable(), // Allow empty string or null
  expiryDate: z.string().optional().nullable(), // Allow empty string or null
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export const certificateUpdateSchema = certificateCreateSchema.partial();

// Export Request schemas
export const exportRequestCreateSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  contactName: z.string().min(1, 'Contact name is required').max(200),
  email: z.string().email('Invalid email address').max(200),
  phone: z.string().max(50).optional(),
  country: z.string().min(1, 'Country is required').max(100),
  productInterest: z.string().max(2000).optional(),
  quantity: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
});

export const exportRequestUpdateSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'CONTACTED', 'QUOTED', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().max(5000).optional(),
  assignedTo: z.string().max(200).optional(),
});

// Business Hours schema for each day
export const businessHourSchema = z.object({
  dayOfWeek: z.string(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isClosed: z.boolean().default(false),
});

// Helper for optional string that can be null or empty
const optionalString = z.string().max(500).optional().nullable().or(z.literal(''));
const optionalUrl = z.string().max(500).optional().nullable().or(z.literal('')).transform(val => {
  // Allow empty strings and null
  if (!val || val === '') return val;
  // If it's a valid URL or looks like a domain, accept it
  return val;
});

// Contact Info schemas
export const contactInfoSchema = z.object({
  key: z.string().min(1).max(50),
  companyName: z.string().max(200).optional().nullable(),
  address: z.string().max(1000).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  phoneAlt: z.string().max(50).optional().nullable().or(z.literal('')),
  email: z.string().email().max(200).optional().nullable().or(z.literal('')),
  emailSales: z.string().email().max(200).optional().nullable().or(z.literal('')),
  website: optionalUrl,
  facebook: optionalString,
  twitter: optionalString,
  linkedin: optionalString,
  instagram: optionalString,
  youtube: optionalString,
  whatsapp: z.string().max(50).optional().nullable(),
  workingHours: z.union([z.array(businessHourSchema), z.record(z.string(), z.any())]).optional().nullable(),
  customerServiceNote: z.string().max(500).optional().nullable(),
  mapEmbed: z.string().max(5000).optional().nullable(),
  isActive: z.boolean().default(true),
});

// User/Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Site Setting schema
export const siteSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
  type: z.enum(['string', 'json', 'boolean', 'number']).default('string'),
  group: z.string().max(50).optional(),
});

// Helper function to generate slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
