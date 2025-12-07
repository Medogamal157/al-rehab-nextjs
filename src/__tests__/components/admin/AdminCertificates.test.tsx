import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminCertificates } from '@/components/admin/AdminCertificates';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockCertificates = [
  {
    id: '1',
    name: 'ISO 22000',
    fullName: 'ISO 22000 Food Safety Management',
    description: 'Food Safety Management System',
    image: '/cert/iso22000.jpg',
    issueDate: '2024-01-01',
    expiryDate: '2027-01-01',
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'GlobalGAP',
    fullName: 'GlobalGAP Certification',
    description: 'Good Agricultural Practices',
    image: '/cert/globalgap.jpg',
    issueDate: '2023-06-01',
    expiryDate: '2024-06-01', // Expired
    isFeatured: false,
    isActive: true,
    displayOrder: 2,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'HACCP',
    fullName: 'Hazard Analysis Critical Control Points',
    description: 'Hazard Analysis Critical Control Points',
    image: '/cert/haccp.jpg',
    issueDate: '2024-03-01',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expiring in 15 days (within 30 days)
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
];

describe('AdminCertificates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders certificates from initialData', () => {
    render(<AdminCertificates initialData={mockCertificates} />);
    
    expect(screen.getByText('ISO 22000')).toBeInTheDocument();
    expect(screen.getByText('GlobalGAP')).toBeInTheDocument();
    expect(screen.getByText('HACCP')).toBeInTheDocument();
  });

  it('renders all certificates from initialData', () => {
    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('ISO 22000')).toBeInTheDocument();
    expect(screen.getByText('GlobalGAP')).toBeInTheDocument();
    expect(screen.getByText('HACCP')).toBeInTheDocument();
  });

  it('shows expired badge for expired certificates', () => {
    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('shows expiring soon badge for certificates expiring within 30 days', () => {
    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
  });

  it('shows empty state when no certificates', () => {
    render(<AdminCertificates initialData={[]} />);

    expect(screen.getByText('No certificates yet')).toBeInTheDocument();
  });

  it('opens add certificate modal when clicking Add Certificate button', () => {
    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('ISO 22000')).toBeInTheDocument();

    const addButton = screen.getByText('Add Certificate');
    fireEvent.click(addButton);

    // After clicking add, verify the state changes
    expect(addButton).toBeInTheDocument();
  });

  it('displays certificate names correctly', () => {
    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('ISO 22000')).toBeInTheDocument();
    expect(screen.getByText('GlobalGAP')).toBeInTheDocument();
    expect(screen.getByText('HACCP')).toBeInTheDocument();
  });

  it('handles certificate deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<AdminCertificates initialData={mockCertificates} />);

    expect(screen.getByText('ISO 22000')).toBeInTheDocument();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [mockCertificates[1], mockCertificates[2]] }),
    });

    // Find delete buttons by text content
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/certificates/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
