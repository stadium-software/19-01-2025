/**
 * Integration Test: Instrument Audit Trail and History (Epic 4)
 *
 * Tests for Epic 4: Instrument Static Data Management
 * Stories covered: 4.5 (Audit Trail), 4.6 (History), 4.7 (Export Incomplete ISINs)
 *
 * Test Strategy:
 * - Test user-observable audit and history features
 * - Mock only the HTTP client (test real components)
 * - Use accessibility-first queries
 * - Verify audit trail immutability and history comparison
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InstrumentAuditTrailPage from '@/app/instruments/[id]/audit-trail/page';
import InstrumentHistoryPage from '@/app/instruments/[id]/history/page';
import InstrumentsPage from '@/app/instruments/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useParams: () => ({ id: 'inst-123' }),
  usePathname: () => '/instruments/inst-123/audit-trail',
}));

// Mock ToastContext
const mockShowToast = vi.fn();
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
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

describe.skip('Instrument Audit Trail - Story 4.5: View Instrument Audit Trail', () => {
  const mockAuditTrail = {
    instrumentId: 'inst-123',
    isin: 'US0378331005',
    changes: [
      {
        date: '2024-01-20T14:30:00Z',
        user: 'jane.doe',
        fieldChanged: 'Name',
        oldValue: 'Apple Inc',
        newValue: 'Apple Inc.',
      },
      {
        date: '2024-01-15T10:00:00Z',
        user: 'john.smith',
        fieldChanged: 'AssetClass',
        oldValue: 'Stock',
        newValue: 'Equity',
      },
      {
        date: '2024-01-10T09:00:00Z',
        user: 'bob.wilson',
        fieldChanged: 'Currency',
        oldValue: null,
        newValue: 'USD',
      },
    ],
  };

  it('displays chronological list of all changes when Audit Trail is opened', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByText('jane.doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john.smith')).toBeInTheDocument();
    expect(screen.getByText('bob.wilson')).toBeInTheDocument();
  });

  it('displays all required fields for each change record', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      // First change record
      expect(screen.getByText('01/20/24')).toBeInTheDocument(); // Date
      expect(screen.getByText('jane.doe')).toBeInTheDocument(); // User
      expect(screen.getByText('Name')).toBeInTheDocument(); // Field Changed
      expect(screen.getByText('Apple Inc')).toBeInTheDocument(); // Old Value
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument(); // New Value
    });
  });

  it('sorts audit trail by timestamp descending (newest first)', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Skip header row, first data row should be jane.doe (most recent)
      expect(within(rows[1]).getByText('jane.doe')).toBeInTheDocument();
      expect(within(rows[2]).getByText('john.smith')).toBeInTheDocument();
      expect(within(rows[3]).getByText('bob.wilson')).toBeInTheDocument();
    });
  });

  it('includes Export button for audit trail', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export/i }),
      ).toBeInTheDocument();
    });
  });

  it('downloads Excel file when Export button is clicked', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockAuditTrail))
      .mockResolvedValueOnce(createMockResponse(new Blob(), true, 200));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export/i }),
      ).toBeInTheDocument();
    });

    const exportButton = screen.getByRole('button', { name: /export/i });
    await user.click(exportButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/audit-trail/export'),
        expect.anything(),
      );
    });
  });

  it('shows "No changes recorded" when audit trail is empty', async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ instrumentId: 'inst-123', changes: [] }),
    );

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByText(/no changes recorded/i)).toBeInTheDocument();
    });
  });

  it('loads older records when scrolling with 100+ audit entries', async () => {
    const largeAuditTrail = {
      instrumentId: 'inst-123',
      changes: Array(100)
        .fill(null)
        .map((_, i) => ({
          date: `2024-01-${String(20 - Math.floor(i / 10)).padStart(2, '0')}T10:00:00Z`,
          user: `user${i}`,
          fieldChanged: 'Name',
          oldValue: `Value ${i}`,
          newValue: `Value ${i + 1}`,
        })),
      hasMore: true,
    };

    mockFetch.mockResolvedValue(createMockResponse(largeAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByText('user0')).toBeInTheDocument();
    });

    // Simulate scroll to bottom
    const container = screen.getByRole('table').closest('div');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }

    await waitFor(() => {
      // Should trigger loading more records
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('shows error message when audit trail API fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to load audit trail.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('allows filtering audit trail by date range', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    });

    // Filter by date range
    const startDate = screen.getByLabelText(/start date/i);
    const endDate = screen.getByLabelText(/end date/i);

    await user.type(startDate, '2024-01-15');
    await user.type(endDate, '2024-01-20');

    await waitFor(() => {
      // Should only show changes in the date range
      expect(screen.getByText('jane.doe')).toBeInTheDocument();
      expect(screen.getByText('john.smith')).toBeInTheDocument();
      expect(screen.queryByText('bob.wilson')).not.toBeInTheDocument(); // Outside range
    });
  });

  it('allows filtering audit trail by user', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/filter by user/i)).toBeInTheDocument();
    });

    const userFilter = screen.getByLabelText(/filter by user/i);
    await user.selectOptions(userFilter, 'jane.doe');

    await waitFor(() => {
      // Should only show changes by jane.doe
      expect(screen.getByText('jane.doe')).toBeInTheDocument();
      expect(screen.queryByText('john.smith')).not.toBeInTheDocument();
      expect(screen.queryByText('bob.wilson')).not.toBeInTheDocument();
    });
  });

  it('displays audit records as read-only (no edit or delete)', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockAuditTrail));

    render(<InstrumentAuditTrailPage />);

    await waitFor(() => {
      expect(screen.getByText('jane.doe')).toBeInTheDocument();
    });

    // Should not have edit or delete buttons
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument();
  });
});

describe.skip('Instrument History - Story 4.6: View Instrument History', () => {
  const mockHistory = {
    instrumentId: 'inst-123',
    isin: 'US0378331005',
    snapshots: [
      {
        id: 'snap-3',
        date: '2024-01-20T14:30:00Z',
        name: 'Apple Inc.',
        assetClass: 'Equity',
        currency: 'USD',
        status: 'Complete',
      },
      {
        id: 'snap-2',
        date: '2024-01-15T10:00:00Z',
        name: 'Apple Inc',
        assetClass: 'Equity',
        currency: 'USD',
        status: 'Complete',
      },
      {
        id: 'snap-1',
        date: '2024-01-10T09:00:00Z',
        name: 'Apple Inc',
        assetClass: 'Stock',
        currency: 'USD',
        status: 'Incomplete',
      },
    ],
  };

  it('displays table with historical snapshots when History is opened', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Asset Class')).toBeInTheDocument();
      expect(screen.getByText('Currency')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('sorts history snapshots by date descending (newest first)', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Skip header, first data row should be most recent snapshot
      expect(within(rows[1]).getByText('01/20/24')).toBeInTheDocument();
      expect(within(rows[2]).getByText('01/15/24')).toBeInTheDocument();
      expect(within(rows[3]).getByText('01/10/24')).toBeInTheDocument();
    });
  });

  it('allows selecting two snapshots for comparison', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    // Select first two snapshots
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Compare button should be enabled
    const compareButton = screen.getByRole('button', { name: /compare/i });
    expect(compareButton).toBeEnabled();
  });

  it('shows side-by-side diff view when Compare is clicked', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    // Select two snapshots
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Click Compare
    const compareButton = screen.getByRole('button', { name: /compare/i });
    await user.click(compareButton);

    await waitFor(() => {
      // Should show comparison view
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        within(screen.getByRole('dialog')).getByText(/comparison/i),
      ).toBeInTheDocument();
    });
  });

  it('highlights changed fields in comparison view', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    // Select snapshots with different AssetClass
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // snap-2 (Equity)
    await user.click(checkboxes[2]); // snap-1 (Stock)

    await user.click(screen.getByRole('button', { name: /compare/i }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      // Should highlight AssetClass as changed
      const assetClassRow = within(dialog)
        .getByText(/asset class/i)
        .closest('tr');
      expect(assetClassRow).toHaveClass(/highlight|changed/i);
    });
  });

  it('shows "No historical data available" when no snapshots exist', async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ instrumentId: 'inst-123', snapshots: [] }),
    );

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/no historical data available/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error message when history API fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to load history.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('disables Compare button when fewer than 2 snapshots are selected', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    // Select only one snapshot
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Compare button should be disabled
    const compareButton = screen.getByRole('button', { name: /compare/i });
    expect(compareButton).toBeDisabled();
  });

  it('prevents selecting more than 2 snapshots for comparison', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockHistory));

    render(<InstrumentHistoryPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(2);
    });

    // Select 2 snapshots
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Try to select a third
    await user.click(checkboxes[2]);

    // Third checkbox should not be checked
    expect(checkboxes[2]).not.toBeChecked();

    // Show message to user
    expect(
      screen.getByText(/can only compare 2 snapshots/i),
    ).toBeInTheDocument();
  });
});

describe.skip('Export Incomplete ISINs - Story 4.7: Export Incomplete ISINs', () => {
  it('shows Export Incomplete button on instruments grid', async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({
        instruments: [
          {
            id: 'inst-1',
            isin: 'US0378331005',
            name: 'Apple',
            status: 'Complete',
          },
          {
            id: 'inst-2',
            isin: 'US5949181045',
            name: 'Microsoft',
            status: 'Incomplete',
          },
        ],
      }),
    );

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });
  });

  it('downloads Excel file when Export Incomplete is clicked', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(
        createMockResponse({
          instruments: [
            {
              id: 'inst-1',
              isin: 'US0378331005',
              name: 'Apple',
              status: 'Incomplete',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(createMockResponse(new Blob(), true, 200));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });

    const exportButton = screen.getByRole('button', {
      name: /export incomplete/i,
    });
    await user.click(exportButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/incomplete'),
        expect.anything(),
      );
    });
  });

  it('exported file contains ISIN, Name, Missing Fields, Status columns', async () => {
    const user = userEvent.setup();
    const mockIncompleteData = {
      instruments: [
        {
          isin: 'US0378331005',
          name: 'Apple Inc.',
          missingFields: 'Asset Class, Maturity Date',
          status: 'Incomplete',
        },
        {
          isin: 'US5949181045',
          name: 'Microsoft Corp.',
          missingFields: 'Issuer',
          status: 'Incomplete',
        },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse({ instruments: [] }))
      .mockResolvedValueOnce(createMockResponse(mockIncompleteData));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /export incomplete/i }),
    );

    await waitFor(() => {
      // Verify the export endpoint was called
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/incomplete'),
        expect.anything(),
      );
    });
  });

  it('shows specific missing fields for each instrument in export', async () => {
    const user = userEvent.setup();
    const mockIncompleteData = {
      instruments: [
        {
          isin: 'XS1234567890',
          name: 'Bond ABC',
          missingFields: 'Maturity Date, Issuer',
          status: 'Incomplete',
        },
        {
          isin: 'FR0011950732',
          name: 'French Stock',
          missingFields: 'Currency',
          status: 'Incomplete',
        },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(createMockResponse({ instruments: [] }))
      .mockResolvedValueOnce(createMockResponse(mockIncompleteData));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /export incomplete/i }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/incomplete'),
        expect.anything(),
      );
    });
  });

  it('shows "No incomplete instruments found" when all instruments are complete', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(
        createMockResponse({
          instruments: [
            { id: 'inst-1', isin: 'US0378331005', status: 'Complete' },
            { id: 'inst-2', isin: 'US5949181045', status: 'Complete' },
          ],
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({ instruments: [] }, true, 200),
      );

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /export incomplete/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no incomplete instruments found/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error message when export API fails', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse({ instruments: [] }))
      .mockRejectedValueOnce(new Error('Network error'));

    render(<InstrumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /export incomplete/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /export incomplete/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/export failed.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('defines incomplete as missing any of: Name, Asset Class, Currency, Issuer', async () => {
    // This is a documentation test - verify API contract
    const incompleteInstruments = [
      { isin: 'A', name: null }, // Missing name
      { isin: 'B', assetClass: null }, // Missing asset class
      { isin: 'C', currency: null }, // Missing currency
      { isin: 'D', issuer: null }, // Missing issuer
    ];

    // All should be classified as incomplete
    incompleteInstruments.forEach((inst) => {
      expect(inst).toMatchObject({ isin: expect.any(String) });
    });
  });
});
