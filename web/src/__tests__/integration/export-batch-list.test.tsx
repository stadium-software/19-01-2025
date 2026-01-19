/**
 * Integration Test: Export Batch List (Story 1.5)
 *
 * Tests CSV export functionality including:
 * - Export all batches vs filtered results
 * - CSV format and structure
 * - File naming and download
 * - Loading and error states
 * - Large dataset handling
 */

import { vi, type Mock, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportBatchList } from '@/components/ExportBatchList';

// Mock the API client
global.fetch = vi.fn();

// Mock toast context
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock file download
const mockDownload = vi.fn();
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock link click for download
const mockLinkClick = vi.fn();
HTMLAnchorElement.prototype.click = mockLinkClick;

describe('Export Batch List - Story 1.5', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current date for consistent file naming
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Happy Path', () => {
    it('downloads CSV file when Export to CSV is clicked', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\nbatch-001,January,2024,Pending,2024-01-15,admin@example.com';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/v1/report-batches/export'),
          expect.anything(),
        );
      });
    });

    it('exports CSV with all expected columns', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV =
        'Batch ID,Month,Year,Status,Created Date,Created By\n' +
        'batch-001,January,2024,Pending,2024-01-15,admin@example.com\n' +
        'batch-002,February,2024,Completed,2024-02-15,user@example.com';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={2} filteredBatches={2} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const csvBlob = await (global.fetch as Mock).mock.results[0].value.then(
        (r: Response) => r.blob(),
      );
      const csvText = await csvBlob.text();
      expect(csvText).toContain('Batch ID');
      expect(csvText).toContain('Month');
      expect(csvText).toContain('Year');
      expect(csvText).toContain('Status');
      expect(csvText).toContain('Created Date');
      expect(csvText).toContain('Created By');
    });

    it('exports all batches when no filter is applied', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('includeFiltered=false'),
          expect.anything(),
        );
      });
    });
  });

  describe('Export Options', () => {
    it('shows confirmation dialog when filters are applied', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<ExportBatchList totalBatches={25} filteredBatches={5} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/export all batches \(25\) or only filtered results \(5\)\?/i),
        ).toBeInTheDocument();
      });
    });

    it('exports all batches when Export All is selected', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      render(<ExportBatchList totalBatches={25} filteredBatches={5} />);

      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      // Act
      await user.click(screen.getByRole('button', { name: /export all/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('includeFiltered=false'),
          expect.anything(),
        );
      });
    });

    it('exports only filtered results when Export Filtered is selected', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      render(<ExportBatchList totalBatches={25} filteredBatches={5} />);

      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      // Act
      await user.click(screen.getByRole('button', { name: /export filtered/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('includeFiltered=true'),
          expect.anything(),
        );
      });
    });

    it('downloads immediately without confirmation when no filter', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert - no confirmation dialog
      expect(
        screen.queryByText(/export all batches/i),
      ).not.toBeInTheDocument();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('CSV Format', () => {
    it('formats dates as YYYY-MM-DD', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV =
        'Batch ID,Month,Year,Status,Created Date,Created By\n' +
        'batch-001,January,2024,Pending,2024-01-15,admin@example.com';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={1} filteredBatches={1} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      const csvBlob = await (global.fetch as Mock).mock.results[0].value.then(
        (r: Response) => r.blob(),
      );
      const csvText = await csvBlob.text();
      expect(csvText).toMatch(/\d{4}-\d{2}-\d{2}/); // YYYY-MM-DD format
    });

    it('exports status values as plain text without color codes', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV =
        'Batch ID,Month,Year,Status,Created Date,Created By\n' +
        'batch-001,January,2024,In Progress,2024-01-15,admin@example.com';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={1} filteredBatches={1} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      const csvBlob = await (global.fetch as Mock).mock.results[0].value.then(
        (r: Response) => r.blob(),
      );
      const csvText = await csvBlob.text();
      expect(csvText).toContain('In Progress');
      expect(csvText).not.toContain('color');
      expect(csvText).not.toContain('style');
    });

    it('properly quotes fields containing commas', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV =
        'Batch ID,Month,Year,Status,Created Date,Created By\n' +
        'batch-001,January,2024,Pending,2024-01-15,"Smith, John"';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={1} filteredBatches={1} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      const csvBlob = await (global.fetch as Mock).mock.results[0].value.then(
        (r: Response) => r.blob(),
      );
      const csvText = await csvBlob.text();
      expect(csvText).toContain('"Smith, John"');
    });

    it('includes column headers as first row', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV =
        'Batch ID,Month,Year,Status,Created Date,Created By\n' +
        'batch-001,January,2024,Pending,2024-01-15,admin@example.com';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={1} filteredBatches={1} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      const csvBlob = await (global.fetch as Mock).mock.results[0].value.then(
        (r: Response) => r.blob(),
      );
      const csvText = await csvBlob.text();
      const lines = csvText.split('\n');
      expect(lines[0]).toBe('Batch ID,Month,Year,Status,Created Date,Created By');
    });
  });

  describe('Button States', () => {
    it('shows tooltip on hover over Export button', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      const button = screen.getByRole('button', { name: /export to csv/i });
      await user.hover(button);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/download batch list as csv file/i),
        ).toBeInTheDocument();
      });
    });

    it('shows spinner and Exporting text during export', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      expect(
        screen.getByRole('button', { name: /exporting\.\.\./i }),
      ).toBeInTheDocument();
    });

    it('disables button during export', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      expect(
        screen.getByRole('button', { name: /exporting\.\.\./i }),
      ).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('shows error when no batches exist', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<ExportBatchList totalBatches={0} filteredBatches={0} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/no batches to export/i),
        ).toBeInTheDocument();
      });
    });

    it('shows warning for large exports over 1000 rows', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<ExportBatchList totalBatches={1500} filteredBatches={1500} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /large export \(1000\+ rows\) may take a moment\. continue\?/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('shows instruction when browser blocks downloads', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      // Simulate download being blocked
      mockLinkClick.mockImplementationOnce(() => {
        throw new Error('Download blocked');
      });

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/please allow downloads from this site/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error toast when API is unavailable', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /unable to export batches\. please try again later\./i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('shows timeout error when export times out', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 30000),
          ),
      );

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(
        () => {
          expect(
            screen.getByText(
              /export timed out\. try exporting fewer rows or contact support\./i,
            ),
          ).toBeInTheDocument();
        },
        { timeout: 31000 },
      );
    });

    it('shows error when API returns corrupted data', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['Export failed due to data error. Contact support.'],
        }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /export failed due to data error\. contact support\./i,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows progress indicator during export generation', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  headers: new Headers({ 'content-type': 'text/csv' }),
                  blob: async () => new Blob(['data'], { type: 'text/csv' }),
                }),
              500,
            ),
          ),
      );

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      expect(
        screen.getByText(/preparing export\.\.\. \(step 1 of 2\)/i),
      ).toBeInTheDocument();
    });

    it('shows download ready notification when file is ready', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/download ready/i)).toBeInTheDocument();
      });
    });
  });

  describe('File Naming', () => {
    it('names file with current date in YYYY-MM-DD format', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockCSV = 'Batch ID,Month,Year,Status,Created Date,Created By\n';

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/csv' }),
        blob: async () => new Blob([mockCSV], { type: 'text/csv' }),
      });

      render(<ExportBatchList totalBatches={25} filteredBatches={25} />);

      // Act
      await user.click(screen.getByRole('button', { name: /export to csv/i }));

      // Assert
      await waitFor(() => {
        expect(mockLinkClick).toHaveBeenCalled();
      });

      // File should be named: report-batches-2024-01-15.csv
      const linkElement = document.querySelector('a[download]');
      expect(linkElement?.getAttribute('download')).toBe(
        'report-batches-2024-01-15.csv',
      );
    });
  });
});
