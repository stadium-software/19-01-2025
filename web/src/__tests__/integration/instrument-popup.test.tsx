/**
 * Integration Test: Instrument Popup Details (Epic 4)
 *
 * Tests for Epic 4: Instrument Static Data Management
 * Story covered: 4.8 (View Instrument Popup Details)
 *
 * Test Strategy:
 * - Test popup modal behavior and content
 * - Mock only the HTTP client (test real components)
 * - Use accessibility-first queries (getByRole for dialog)
 * - Verify user sees correct instrument details in popup
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InstrumentsPage from '@/app/instruments/page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
  usePathname: () => '/instruments',
}));

// Mock ToastContext
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock fetch globally
const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// Helper to create mock response
const createMockResponse = (data: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
  blob: () => Promise.resolve(new Blob()),
});

const createMockInstruments = () => ({
  instruments: [
    {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    },
    {
      id: 'inst-2',
      isin: 'XS1234567890',
      name: 'Corporate Bond ABC',
      assetClass: 'Fixed Income',
      currency: 'EUR',
      status: 'Complete',
      issuer: 'ABC Corporation',
      maturityDate: '2030-12-31',
    },
  ],
  totalCount: 2,
});

describe.skip('Instrument Popup - Story 4.8: View Instrument Popup Details', () => {
  it('shows info icon when hovering over ISIN', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(createMockInstruments()));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    await user.hover(isinCell!);

    await waitFor(() => {
      const infoIcon = within(isinCell!).getByRole('img', { name: /info/i });
      expect(infoIcon).toBeInTheDocument();
    });
  });

  it('opens popup when info icon is clicked', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    // Click info icon
    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays all required fields in popup', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('Apple Inc.')).toBeInTheDocument(); // Name
      expect(within(dialog).getByText('Equity')).toBeInTheDocument(); // Asset Class
      expect(within(dialog).getByText('USD')).toBeInTheDocument(); // Currency
      expect(within(dialog).getByText('Apple Inc.')).toBeInTheDocument(); // Issuer
      expect(within(dialog).getByText('Complete')).toBeInTheDocument(); // Status
    });
  });

  it('displays maturity date for fixed income instruments', async () => {
    const user = userEvent.setup();
    const bondDetail = {
      id: 'inst-2',
      isin: 'XS1234567890',
      name: 'Corporate Bond ABC',
      assetClass: 'Fixed Income',
      currency: 'EUR',
      status: 'Complete',
      issuer: 'ABC Corporation',
      maturityDate: '2030-12-31',
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(bondDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('XS1234567890')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('XS1234567890').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText(/12\/31\/2030/i)).toBeInTheDocument(); // Maturity Date
    });
  });

  it('includes "View Full Details" button in popup', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByRole('button', { name: /view full details/i }),
      ).toBeInTheDocument();
    });
  });

  it('navigates to instrument detail page when "View Full Details" is clicked', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByRole('button', { name: /view full details/i }),
      ).toBeInTheDocument();
    });

    const viewFullButton = within(screen.getByRole('dialog')).getByRole(
      'button',
      {
        name: /view full details/i,
      },
    );
    await user.click(viewFullButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/inst-1'),
      );
    });
  });

  it('closes popup when clicking outside', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click outside the dialog (on the overlay)
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;
    if (overlay) {
      await user.click(overlay);
    }

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('includes close button in popup', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByRole('button', { name: /close/i }),
      ).toBeInTheDocument();
    });
  });

  it('closes popup when close button is clicked', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const closeButton = within(screen.getByRole('dialog')).getByRole('button', {
      name: /close/i,
    });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows error message in popup when API fails', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockRejectedValueOnce(new Error('Network error'));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByText(/failed to load details/i),
      ).toBeInTheDocument();
    });
  });

  it('includes Edit button if user has permissions', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
      canEdit: true, // User has permission
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByRole('button', { name: /edit/i }),
      ).toBeInTheDocument();
    });
  });

  it('does not show Edit button if user lacks permissions', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
      canEdit: false, // User does not have permission
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).queryByRole('button', { name: /^edit$/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('navigates to edit page when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
      canEdit: true,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(
        within(dialog).getByRole('button', { name: /edit/i }),
      ).toBeInTheDocument();
    });

    const editButton = within(screen.getByRole('dialog')).getByRole('button', {
      name: /edit/i,
    });
    await user.click(editButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/inst-1/edit'),
      );
    });
  });

  it('reuses instrument detail endpoint for popup data', async () => {
    const user = userEvent.setup();
    const instrumentDetail = {
      id: 'inst-1',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      assetClass: 'Equity',
      currency: 'USD',
      status: 'Complete',
      issuer: 'Apple Inc.',
      maturityDate: null,
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse(createMockInstruments()))
      .mockResolvedValueOnce(createMockResponse(instrumentDetail));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(screen.getByText('US0378331005')).toBeInTheDocument();
    });

    const isinCell = screen.getByText('US0378331005').closest('td');
    const infoIcon = within(isinCell!).getByRole('button', {
      name: /info.*details/i,
    });
    await user.click(infoIcon);

    await waitFor(() => {
      // Should call /instruments/{id} endpoint (not a separate popup endpoint)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/inst-1'),
        expect.anything(),
      );
    });
  });
});
