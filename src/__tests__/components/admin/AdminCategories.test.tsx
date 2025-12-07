import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminCategories } from '@/components/admin/AdminCategories';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useApi hook
vi.mock('@/hooks/useApi', () => ({
  useApi: () => ({
    loading: false,
    error: null,
    get: vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/api/categories')) {
        return {
          success: true,
          data: mockCategories,
        };
      }
      return { success: false, error: 'Not found' };
    }),
    post: vi.fn().mockResolvedValue({ success: true, data: {} }),
    put: vi.fn().mockResolvedValue({ success: true, data: {} }),
    del: vi.fn().mockResolvedValue({ success: true }),
  }),
  generateSlug: (name: string) => name.toLowerCase().replace(/\s+/g, '-'),
}));

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Citrus Fruits',
    nameAr: 'فواكه حمضية',
    slug: 'citrus-fruits',
    description: 'Fresh citrus fruits',
    descriptionAr: 'فواكه حمضية طازجة',
    icon: 'Citrus',
    color: 'orange-500',
    image: '/categories/citrus.jpg',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    _count: { products: 5 },
  },
  {
    id: 'cat-2',
    name: 'Berries',
    nameAr: 'التوت',
    slug: 'berries',
    description: 'Fresh berries',
    descriptionAr: 'توت طازج',
    icon: 'Cherry',
    color: 'red-500',
    image: '/categories/berries.jpg',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    _count: { products: 3 },
  },
];

describe('AdminCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders categories from initialData', () => {
    render(<AdminCategories initialData={mockCategories} />);

    expect(screen.getByText('Citrus Fruits')).toBeInTheDocument();
    expect(screen.getByText('Berries')).toBeInTheDocument();
  });

  it('opens add category modal when clicking Add Category button', async () => {
    render(<AdminCategories initialData={mockCategories} />);

    expect(screen.getByText('Citrus Fruits')).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      // Modal opens with form fields - look for the modal header
      expect(screen.getByText('Add Category', { selector: 'h2' })).toBeInTheDocument();
    });
  });

  it('shows Edit Category header when editing a category', async () => {
    render(<AdminCategories initialData={mockCategories} />);

    expect(screen.getByText('Citrus Fruits')).toBeInTheDocument();

    // Click the Edit button on a category
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      // Modal opens with Edit Category header
      expect(screen.getByText('Edit Category')).toBeInTheDocument();
    });
  });

  it('displays category descriptions', () => {
    render(<AdminCategories initialData={mockCategories} />);

    expect(screen.getByText('Citrus Fruits')).toBeInTheDocument();

    // Check for descriptions or other category info
    expect(screen.getByText('Fresh citrus fruits')).toBeInTheDocument();
    expect(screen.getByText('Fresh berries')).toBeInTheDocument();
  });
});
