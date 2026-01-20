/**
 * Integration Test: Instrument File Upload (Epic 4)
 *
 * Tests for Epic 4: Instrument Static Data Management
 * Story covered: 4.4 (Upload Instruments File)
 *
 * Test Strategy:
 * - Test file upload workflow and validation
 * - Mock only the HTTP client (test real components)
 * - Use accessibility-first queries
 * - Verify user sees correct feedback and results
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InstrumentUploadPage from '@/app/instruments/upload/page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
  usePathname: () => '/instruments/upload',
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

// Helper to create mock file
const createMockFile = (name: string, size: number, type: string) => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe.skip('Instrument File Upload - Story 4.4: Upload Instruments File', () => {
  it('shows Upload File button', () => {
    render(<InstrumentUploadPage />);

    expect(
      screen.getByRole('button', { name: /upload file/i }),
    ).toBeInTheDocument();
  });

  it('displays file name and size after valid file is selected', async () => {
    const user = userEvent.setup();
    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024 * 100,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const fileInput = screen.getByLabelText(/select file/i);

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('instruments.xlsx')).toBeInTheDocument();
      expect(screen.getByText(/100.*KB/i)).toBeInTheDocument();
    });
  });

  it('shows upload summary after successful file processing', async () => {
    const user = userEvent.setup();
    const uploadResponse = {
      success: true,
      summary: {
        instrumentsAdded: 25,
        instrumentsUpdated: 10,
        totalProcessed: 35,
        errors: 0,
      },
    };

    mockFetch.mockResolvedValue(createMockResponse(uploadResponse));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const fileInput = screen.getByLabelText(/select file/i);
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('instruments.xlsx')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/25 instruments added/i)).toBeInTheDocument();
      expect(screen.getByText(/10.*updated/i)).toBeInTheDocument();
    });
  });

  it('refreshes grid to show new instruments after upload completes', async () => {
    const user = userEvent.setup();
    const uploadResponse = {
      success: true,
      summary: {
        instrumentsAdded: 5,
        instrumentsUpdated: 2,
        totalProcessed: 7,
        errors: 0,
      },
    };

    mockFetch.mockResolvedValue(createMockResponse(uploadResponse));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/5 instruments added/i)).toBeInTheDocument();
    });

    // Verify user can see a link or button to view the grid
    expect(
      screen.getByRole('button', { name: /view instruments/i }),
    ).toBeInTheDocument();
  });

  it('shows validation errors for invalid ISINs in uploaded file', async () => {
    const user = userEvent.setup();
    const uploadResponse = {
      success: false,
      summary: {
        instrumentsAdded: 0,
        instrumentsUpdated: 0,
        totalProcessed: 0,
        errors: 3,
      },
      validationErrors: [
        {
          row: 5,
          column: 'ISIN',
          message: 'Invalid ISIN format',
          value: 'ABC123',
        },
        {
          row: 10,
          column: 'ISIN',
          message: 'ISIN must be 12 characters',
          value: 'US037833',
        },
        { row: 15, column: 'Name', message: 'Name is required', value: '' },
      ],
    };

    mockFetch.mockResolvedValue(createMockResponse(uploadResponse));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/3.*errors/i)).toBeInTheDocument();
    });

    // Shows list of invalid rows
    expect(screen.getByText(/row 5/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid isin format/i)).toBeInTheDocument();
    expect(screen.getByText(/ABC123/i)).toBeInTheDocument();

    expect(screen.getByText(/row 10/i)).toBeInTheDocument();
    expect(screen.getByText(/isin must be 12 characters/i)).toBeInTheDocument();
  });

  it('updates duplicate ISINs instead of adding them', async () => {
    const user = userEvent.setup();
    const uploadResponse = {
      success: true,
      summary: {
        instrumentsAdded: 10,
        instrumentsUpdated: 5, // 5 were duplicates
        totalProcessed: 15,
        errors: 0,
      },
      duplicates: [
        { isin: 'US0378331005', action: 'Updated' },
        { isin: 'US5949181045', action: 'Updated' },
      ],
    };

    mockFetch.mockResolvedValue(createMockResponse(uploadResponse));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/10 instruments added/i)).toBeInTheDocument();
      expect(screen.getByText(/5.*updated/i)).toBeInTheDocument();
    });
  });

  it('rejects non-Excel/CSV files with error message', async () => {
    const user = userEvent.setup();
    render(<InstrumentUploadPage />);

    const file = createMockFile('instruments.txt', 1024, 'text/plain');
    const fileInput = screen.getByLabelText(/select file/i);

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid file format.*please upload.*xlsx.*csv/i),
      ).toBeInTheDocument();
    });

    // Upload button should be disabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeDisabled();
  });

  it('rejects files larger than 5MB', async () => {
    const user = userEvent.setup();
    render(<InstrumentUploadPage />);

    const largeFile = createMockFile(
      'instruments.xlsx',
      6 * 1024 * 1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const fileInput = screen.getByLabelText(/select file/i);

    await user.upload(fileInput, largeFile);

    await waitFor(() => {
      expect(screen.getByText(/file size exceeds.*5.*MB/i)).toBeInTheDocument();
    });

    // Upload button should be disabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeDisabled();
  });

  it('shows error message when upload API fails', async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/upload failed.*please try again/i),
      ).toBeInTheDocument();
    });
  });

  it('shows progress indicator during file upload', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  it('allows selecting a different file after validation error', async () => {
    const user = userEvent.setup();
    render(<InstrumentUploadPage />);

    // Upload invalid file
    const invalidFile = createMockFile('instruments.txt', 1024, 'text/plain');
    await user.upload(screen.getByLabelText(/select file/i), invalidFile);

    await waitFor(() => {
      expect(screen.getByText(/invalid file format/i)).toBeInTheDocument();
    });

    // Upload valid file
    const validFile = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), validFile);

    await waitFor(() => {
      expect(
        screen.queryByText(/invalid file format/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText('instruments.xlsx')).toBeInTheDocument();
    });

    // Upload button should be enabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeEnabled();
  });

  it('accepts CSV files as valid format', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({
        success: true,
        summary: {
          instrumentsAdded: 5,
          instrumentsUpdated: 0,
          totalProcessed: 5,
          errors: 0,
        },
      }),
    );

    render(<InstrumentUploadPage />);

    const csvFile = createMockFile('instruments.csv', 1024, 'text/csv');
    await user.upload(screen.getByLabelText(/select file/i), csvFile);

    await waitFor(() => {
      expect(screen.getByText('instruments.csv')).toBeInTheDocument();
    });

    // Should not show error
    expect(screen.queryByText(/invalid file format/i)).not.toBeInTheDocument();

    // Upload button should be enabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeEnabled();
  });

  it('accepts Excel files as valid format', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({
        success: true,
        summary: {
          instrumentsAdded: 5,
          instrumentsUpdated: 0,
          totalProcessed: 5,
          errors: 0,
        },
      }),
    );

    render(<InstrumentUploadPage />);

    const excelFile = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), excelFile);

    await waitFor(() => {
      expect(screen.getByText('instruments.xlsx')).toBeInTheDocument();
    });

    // Should not show error
    expect(screen.queryByText(/invalid file format/i)).not.toBeInTheDocument();

    // Upload button should be enabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeEnabled();
  });

  it('displays detailed error summary for rows with errors', async () => {
    const user = userEvent.setup();
    const uploadResponse = {
      success: false,
      summary: {
        instrumentsAdded: 2,
        instrumentsUpdated: 0,
        totalProcessed: 2,
        errors: 3,
      },
      validationErrors: [
        {
          row: 5,
          column: 'ISIN',
          message: 'Invalid ISIN format',
          value: 'ABC123',
        },
        {
          row: 10,
          column: 'Currency',
          message: 'Invalid currency code',
          value: 'XXX',
        },
        {
          row: 15,
          column: 'AssetClass',
          message: 'Unknown asset class',
          value: 'Unknown',
        },
      ],
    };

    mockFetch.mockResolvedValue(createMockResponse(uploadResponse));

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      // Should show table with errors
      const errorTable = screen.getByRole('table', {
        name: /validation errors/i,
      });
      expect(errorTable).toBeInTheDocument();

      // Check columns exist
      expect(within(errorTable).getByText(/row/i)).toBeInTheDocument();
      expect(within(errorTable).getByText(/column/i)).toBeInTheDocument();
      expect(within(errorTable).getByText(/error/i)).toBeInTheDocument();
      expect(within(errorTable).getByText(/value/i)).toBeInTheDocument();

      // Check error details
      expect(within(errorTable).getByText('5')).toBeInTheDocument();
      expect(within(errorTable).getByText('ISIN')).toBeInTheDocument();
      expect(
        within(errorTable).getByText(/invalid isin format/i),
      ).toBeInTheDocument();
      expect(within(errorTable).getByText('ABC123')).toBeInTheDocument();
    });
  });

  it('sends file via multipart/form-data POST request', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      createMockResponse({
        success: true,
        summary: {
          instrumentsAdded: 5,
          instrumentsUpdated: 0,
          totalProcessed: 5,
          errors: 0,
        },
      }),
    );

    render(<InstrumentUploadPage />);

    const file = createMockFile(
      'instruments.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await user.upload(screen.getByLabelText(/select file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instruments/upload'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      );
    });
  });
});
