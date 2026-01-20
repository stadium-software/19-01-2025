/**
 * Integration Test: Instrument Form (Epic 4)
 *
 * Tests for Epic 4: Instrument Static Data Management
 * Stories covered: 4.2 (Add), 4.3 (Update)
 *
 * Test Strategy:
 * - Test user-observable form behavior and validation
 * - Mock only the HTTP client (test real components)
 * - Use accessibility-first queries (getByLabelText, getByRole)
 * - Verify user sees correct messages and form states
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AddInstrumentPage from '@/app/instruments/add/page';
import EditInstrumentPage from '@/app/instruments/[id]/edit/page';

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useParams: () => ({ id: 'inst-123' }),
  usePathname: () => '/instruments/add',
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

describe.skip('Instrument Form - Story 4.2: Add New Instrument', () => {
  it('displays form with all required fields when Add Instrument is opened', async () => {
    render(<AddInstrumentPage />);

    expect(screen.getByLabelText(/isin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asset class/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/issuer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maturity date/i)).toBeInTheDocument();
  });

  it('marks ISIN field as required', () => {
    render(<AddInstrumentPage />);

    const isinInput = screen.getByLabelText(/isin/i);
    expect(isinInput).toBeRequired();
  });

  it('shows success message when instrument is added successfully', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({
        id: 'inst-new',
        isin: 'US0378331005',
        name: 'Apple Inc.',
      }),
    );

    render(<AddInstrumentPage />);

    // Fill required fields
    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');
    await user.selectOptions(screen.getByLabelText(/asset class/i), 'Equity');
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD');

    // Submit form
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringMatching(/instrument added successfully/i),
          variant: 'success',
        }),
      );
    });
  });

  it('adds instrument to grid after successful save', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({
        id: 'inst-new',
        isin: 'US0378331005',
        name: 'Apple Inc.',
      }),
    );

    render(<AddInstrumentPage />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');
    await user.selectOptions(screen.getByLabelText(/asset class/i), 'Equity');
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/instruments'),
      );
    });
  });

  it('records username and timestamp in audit trail when instrument is saved', async () => {
    const user = userEvent.setup();
    const saveResponse = {
      id: 'inst-new',
      isin: 'US0378331005',
      name: 'Apple Inc.',
      auditTrail: [
        {
          date: '2024-01-15T10:30:00Z',
          user: 'john.smith',
          action: 'Created',
        },
      ],
    };

    mockFetch.mockResolvedValue(createMockResponse(saveResponse));

    render(<AddInstrumentPage />);

    // Fill and submit
    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');
    await user.selectOptions(screen.getByLabelText(/asset class/i), 'Equity');
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      // Verify the API call includes LastChangedUser header
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments'),
        expect.objectContaining({
          headers: expect.objectContaining({
            LastChangedUser: expect.any(String),
          }),
        }),
      );
    });
  });

  it('shows error when duplicate ISIN is entered', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({ error: 'ISIN already exists' }, false, 409),
    );

    render(<AddInstrumentPage />);

    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');
    await user.selectOptions(screen.getByLabelText(/asset class/i), 'Equity');
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/isin already exists/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for missing required fields', async () => {
    const user = userEvent.setup();
    render(<AddInstrumentPage />);

    // Try to submit without filling required fields
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      // Should show validation errors
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('validates ISIN format (12 alphanumeric characters)', async () => {
    const user = userEvent.setup();
    render(<AddInstrumentPage />);

    const isinInput = screen.getByLabelText(/isin/i);

    // Invalid ISIN - too short
    await user.type(isinInput, 'ABC123');
    await user.tab(); // Trigger blur validation

    await waitFor(() => {
      expect(
        screen.getByText(/isin must be 12 alphanumeric characters/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error message when API fails during save', async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<AddInstrumentPage />);

    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');
    await user.selectOptions(screen.getByLabelText(/asset class/i), 'Equity');
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to add instrument.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('closes form without saving when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<AddInstrumentPage />);

    // Fill some data
    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');

    // Click Cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/instruments'),
      );
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('shows confirmation dialog when canceling with unsaved changes', async () => {
    const user = userEvent.setup();
    render(<AddInstrumentPage />);

    // Fill some data
    await user.type(screen.getByLabelText(/isin/i), 'US0378331005');
    await user.type(screen.getByLabelText(/name/i), 'Apple Inc.');

    // Click Cancel
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText(/unsaved changes will be lost/i),
      ).toBeInTheDocument();
    });
  });

  it('populates Asset Class dropdown from reference data', async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({
        assetClasses: ['Equity', 'Fixed Income', 'Cash', 'Alternative'],
      }),
    );

    render(<AddInstrumentPage />);

    await waitFor(() => {
      const assetClassSelect = screen.getByLabelText(/asset class/i);
      const options = within(assetClassSelect as HTMLElement).getAllByRole(
        'option',
      );

      expect(options.map((o) => o.textContent)).toContain('Equity');
      expect(options.map((o) => o.textContent)).toContain('Fixed Income');
      expect(options.map((o) => o.textContent)).toContain('Cash');
    });
  });

  it('populates Currency dropdown from reference data', async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({
        currencies: ['USD', 'EUR', 'GBP', 'JPY'],
      }),
    );

    render(<AddInstrumentPage />);

    await waitFor(() => {
      const currencySelect = screen.getByLabelText(/currency/i);
      const options = within(currencySelect as HTMLElement).getAllByRole(
        'option',
      );

      expect(options.map((o) => o.textContent)).toContain('USD');
      expect(options.map((o) => o.textContent)).toContain('EUR');
      expect(options.map((o) => o.textContent)).toContain('GBP');
    });
  });
});

describe.skip('Instrument Form - Story 4.3: Update Existing Instrument', () => {
  const mockInstrument = {
    id: 'inst-123',
    isin: 'US0378331005',
    name: 'Apple Inc.',
    assetClass: 'Equity',
    currency: 'USD',
    issuer: 'Apple Inc.',
    maturityDate: null,
    status: 'Complete',
  };

  it('pre-fills form with current instrument values when Edit is opened', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockInstrument));

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('US0378331005')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });
  });

  it('disables ISIN field in edit mode', async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockInstrument));

    render(<EditInstrumentPage />);

    await waitFor(() => {
      const isinInput = screen.getByLabelText(/isin/i);
      expect(isinInput).toBeDisabled();
    });
  });

  it('shows success message when instrument is updated', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockInstrument))
      .mockResolvedValueOnce(
        createMockResponse({ ...mockInstrument, name: 'Apple Inc. - Updated' }),
      );

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    // Update name
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Apple Inc. - Updated');

    // Save
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringMatching(/instrument updated successfully/i),
          variant: 'success',
        }),
      );
    });
  });

  it('records changes in audit trail when instrument is updated', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockInstrument))
      .mockResolvedValueOnce(
        createMockResponse({ ...mockInstrument, name: 'Updated' }),
      );

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    // Make a change
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      // Verify API was called with LastChangedUser header
      const putCall = mockFetch.mock.calls.find(
        (call) => call[1]?.method === 'PUT',
      );
      expect(putCall).toBeDefined();
      expect(putCall![1].headers.LastChangedUser).toBeDefined();
    });
  });

  it('shows validation error when required field is cleared', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(createMockResponse(mockInstrument));

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    // Clear required field
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.tab(); // Trigger validation

    await waitFor(() => {
      expect(screen.getByText(/.*required/i)).toBeInTheDocument();
    });
  });

  it('shows concurrency conflict warning when another user updated the same instrument', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockInstrument))
      .mockResolvedValueOnce(
        createMockResponse({ error: 'Concurrency conflict' }, false, 409),
      );

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    // Make a change
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/another user.*updated.*instrument/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error message when update API fails', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockInstrument))
      .mockRejectedValueOnce(new Error('Network error'));

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to update instrument.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('allows updating all editable fields', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce(createMockResponse(mockInstrument))
      .mockResolvedValueOnce(createMockResponse({ ...mockInstrument }));

    render(<EditInstrumentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Apple Inc.')).toBeInTheDocument();
    });

    // Update multiple fields
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'New Name');

    await user.selectOptions(
      screen.getByLabelText(/asset class/i),
      'Fixed Income',
    );

    await user.clear(screen.getByLabelText(/issuer/i));
    await user.type(screen.getByLabelText(/issuer/i), 'New Issuer');

    // Save
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      const putCall = mockFetch.mock.calls.find(
        (call) => call[1]?.method === 'PUT',
      );
      const body = JSON.parse(putCall![1].body);

      expect(body.name).toBe('New Name');
      expect(body.assetClass).toBe('Fixed Income');
      expect(body.issuer).toBe('New Issuer');
    });
  });
});
