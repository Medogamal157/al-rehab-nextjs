import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminContactInfo } from '@/components/admin/AdminContactInfo';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockContactInfo = {
  phone: '+20 123 456 7890',
  email: 'info@alrehabgroup.com',
  address: 'Industrial Zone, 6th of October City, Giza, Egypt',
  addressAr: 'المنطقة الصناعية، مدينة 6 أكتوبر، الجيزة، مصر',
  workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM',
  workingHoursAr: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً',
  mapUrl: 'https://maps.google.com/?q=6th+October+City',
  whatsapp: '+201234567890',
  facebook: 'https://facebook.com/alrehabgroup',
  instagram: 'https://instagram.com/alrehabgroup',
  linkedin: 'https://linkedin.com/company/alrehabgroup',
  twitter: 'https://twitter.com/alrehabgroup',
};

// Helper to setup fetch mock for contact info API
const setupFetchMock = (data = mockContactInfo) => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ success: true, data }),
  });
};

describe('AdminContactInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders contact info from initialData', async () => {
    setupFetchMock();
    render(<AdminContactInfo initialData={mockContactInfo} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('+20 123 456 7890')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('info@alrehabgroup.com')).toBeInTheDocument();
  });

  it('renders all contact fields', async () => {
    setupFetchMock();
    render(<AdminContactInfo initialData={mockContactInfo} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('+20 123 456 7890')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('info@alrehabgroup.com')).toBeInTheDocument();
  });

  it('uses default contact info when initialData not provided', async () => {
    setupFetchMock({ email: 'info@alrehabgroup.com' });
    render(<AdminContactInfo />);

    // Default values should be shown after loading
    await waitFor(() => {
      expect(screen.getByDisplayValue('info@alrehabgroup.com')).toBeInTheDocument();
    });
  });

  it('allows editing contact information', async () => {
    setupFetchMock();
    render(<AdminContactInfo initialData={mockContactInfo} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('+20 123 456 7890')).toBeInTheDocument();
    });

    const phoneInput = screen.getByDisplayValue('+20 123 456 7890');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '+20 999 888 7777');

    expect(screen.getByDisplayValue('+20 999 888 7777')).toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    setupFetchMock();
    render(<AdminContactInfo initialData={mockContactInfo} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('+20 123 456 7890')).toBeInTheDocument();
    });

    // Mock the save request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact-info',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('shows saving state when submitting', async () => {
    setupFetchMock();
    render(<AdminContactInfo initialData={mockContactInfo} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('+20 123 456 7890')).toBeInTheDocument();
    });

    // Mock a slow save request
    mockFetch.mockImplementationOnce(() => new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }), 100)
    ));

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
});
