import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminExportRequests } from '@/components/admin/AdminExportRequests';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockRequests = [
  {
    id: '1',
    companyName: 'Fresh Foods Inc',
    contactName: 'John Smith',
    email: 'john@freshfoods.com',
    phone: '+1234567890',
    country: 'USA',
    productInterest: 'Valencia Oranges, Strawberries',
    quantity: '500 tons',
    message: 'Interested in bulk orders',
    status: 'NEW',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    companyName: 'European Imports',
    contactName: 'Marie Dupont',
    email: 'marie@euroimports.fr',
    phone: '+33123456789',
    country: 'France',
    productInterest: 'Grapes',
    quantity: '200 tons',
    message: 'Looking for organic certification',
    status: 'CONTACTED',
    createdAt: '2024-01-10T08:30:00Z',
  },
  {
    id: '3',
    companyName: 'Asia Pacific Trading',
    contactName: 'Wei Chen',
    email: 'wei@aptrade.cn',
    phone: '+8612345678',
    country: 'China',
    productInterest: 'Mixed citrus fruits',
    status: 'COMPLETED',
    createdAt: '2024-01-05T14:00:00Z',
  },
];

describe('AdminExportRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders export requests from initialData', () => {
    render(<AdminExportRequests initialData={mockRequests} />);
    
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Fresh Foods Inc')).toBeInTheDocument();
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
    expect(screen.getByText('Wei Chen')).toBeInTheDocument();
  });

  it('renders all requests with correct status badges', () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Fresh Foods Inc')).toBeInTheDocument();
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
    expect(screen.getByText('Wei Chen')).toBeInTheDocument();
  });

  it('displays correct stats counts', () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    // Check stats - 1 NEW, 1 CONTACTED, 1 COMPLETED
    const statBoxes = screen.getAllByText('1');
    expect(statBoxes.length).toBeGreaterThanOrEqual(3);
  });

  it('shows empty state when no requests', () => {
    render(<AdminExportRequests initialData={[]} />);

    expect(screen.getByText('No requests found')).toBeInTheDocument();
  });

  it('filters requests by search term', async () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search by name, email, company/i);
    await userEvent.type(searchInput, 'Fresh Foods');

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.queryByText('Marie Dupont')).not.toBeInTheDocument();
    expect(screen.queryByText('Wei Chen')).not.toBeInTheDocument();
  });

  it('filters requests by status', async () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    // Get all comboboxes - first one is the status filter
    const comboboxes = screen.getAllByRole('combobox');
    const statusFilter = comboboxes[0]; // First combobox is the main filter
    await userEvent.selectOptions(statusFilter, 'CONTACTED');

    expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
    expect(screen.queryByText('Wei Chen')).not.toBeInTheDocument();
  });

  it('opens detail modal when clicking view button', async () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    const viewButtons = screen.getAllByTitle('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Request Details')).toBeInTheDocument();
    });

    expect(screen.getByText('Interested in bulk orders')).toBeInTheDocument();
  });

  it('handles status change', async () => {
    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    // Mock the status update request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Find the status dropdown for the first request and change it
    const statusSelects = screen.getAllByRole('combobox');
    // First combobox is the filter, status selects start from index 1
    await userEvent.selectOptions(statusSelects[1], 'CONTACTED');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/export-requests/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'CONTACTED' }),
        })
      );
    });
  });

  it('handles request deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<AdminExportRequests initialData={mockRequests} />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [mockRequests[1], mockRequests[2]] }),
    });

    // Find delete buttons by title
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/export-requests/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
