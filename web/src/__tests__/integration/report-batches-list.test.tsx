/**
 * Integration Test: Report Batches List (Story 1.1)
 *
 * Tests the Start Page batch list functionality including:
 * - Viewing batches in a paginated table
 * - Search and filter functionality
 * - Status badge rendering
 * - Loading and error states
 * - Edge cases (empty state, pagination)
 */

import { vi, type Mock, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportBatchesTable } from '@/components/ReportBatchesTable';

// Mock the API client
global.fetch = vi.fn();

// Mock data factory
const createMockBatch = (overrides: Record<string, unknown> = {}) => ({
  id: 'batch-001',
  month: 'January',
  year: 2024,
  status: 'Pending' as const,
  createdDate: '2024-01-15T10:00:00Z',
  createdBy: 'admin@example.com',
  ...overrides,
});

const createMockBatchList = (count: number) => {
  const statuses = ['Pending', 'In Progress', 'Completed', 'Failed'] as const;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `batch-${String(i + 1).padStart(3, '0')}`,
    month: months[i % 12],
    year: 2024 - Math.floor(i / 12),
    status: statuses[i % 4],
    createdDate: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    createdBy: 'admin@example.com',
  }));
};

describe('Report Batches List - Story 1.1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('displays table with all columns when page loads', async () => {
      // Arrange
      const mockBatches = createMockBatchList(5);
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 5 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert - wait for data to load
      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      // Verify all columns are present
      expect(screen.getByText('Batch ID')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Created Date')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('displays pagination controls when there are 10+ batches', async () => {
      // Arrange
      const mockBatches = createMockBatchList(25);
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: /next/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });

    it('navigates to next page when Next button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(25);

      // First page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('batch-001')).toBeInTheDocument();
      });

      // Second page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(10, 20), total: 25 }),
      });

      // Act
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText('batch-011')).toBeInTheDocument();
      });
    });

    it('returns to first page when Previous button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(25);

      // First page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('batch-001')).toBeInTheDocument();
      });

      // Navigate to second page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(10, 20), total: 25 }),
      });

      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText('batch-011')).toBeInTheDocument();
      });

      // Navigate back to first page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      // Act
      await user.click(screen.getByRole('button', { name: /previous/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText('batch-001')).toBeInTheDocument();
      });
    });

    it('displays color-coded status badges', async () => {
      // Arrange
      const mockBatches = [
        createMockBatch({ status: 'Pending', id: 'batch-001' }),
        createMockBatch({ status: 'In Progress', id: 'batch-002' }),
        createMockBatch({ status: 'Completed', id: 'batch-003' }),
        createMockBatch({ status: 'Failed', id: 'batch-004' }),
      ];

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 4 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });

      // Verify all status badges are rendered
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  describe('Search & Filter', () => {
    it('filters batches when searching for year', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(5);

      // Initial load
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 5 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      // Filtered results
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: mockBatches.filter((b) => b.year === 2024),
          total: 5,
        }),
      });

      // Act
      const searchInput = screen.getByRole('searchbox', { name: /search/i });
      await user.type(searchInput, '2024');

      // Assert - wait for debounced search
      await waitFor(
        () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('search=2024'),
            expect.anything(),
          );
        },
        { timeout: 500 },
      );
    });

    it('filters batches when searching for month', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(12);

      // Initial load
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 12 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      // Filtered results
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: mockBatches.filter((b) => b.month === 'January'),
          total: 1,
        }),
      });

      // Act
      const searchInput = screen.getByRole('searchbox', { name: /search/i });
      await user.type(searchInput, 'January');

      // Assert
      await waitFor(
        () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('search=January'),
            expect.anything(),
          );
        },
        { timeout: 500 },
      );
    });

    it('shows no results message when search returns empty', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(5);

      // Initial load
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 5 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      // Empty results
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: [], total: 0 }),
      });

      // Act
      const searchInput = screen.getByRole('searchbox', { name: /search/i });
      await user.type(searchInput, 'NonExistentBatch');

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/no batches found/i)).toBeInTheDocument();
      });
    });

    it('shows all batches when search is cleared', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(5);

      // Initial load
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 5 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      // Search
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: [mockBatches[0]], total: 1 }),
      });

      const searchInput = screen.getByRole('searchbox', { name: /search/i });
      await user.type(searchInput, 'January');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=January'),
          expect.anything(),
        );
      });

      // Clear search
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 5 }),
      });

      // Act
      await user.clear(searchInput);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.not.stringContaining('search='),
          expect.anything(),
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('shows empty state when no batches exist', async () => {
      // Arrange
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: [], total: 0 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /no report batches found\. create your first batch to get started\./i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('does not show pagination controls for exactly 10 batches', async () => {
      // Arrange
      const mockBatches = createMockBatchList(10);
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches, total: 10 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('button', { name: /next/i }),
      ).not.toBeInTheDocument();
    });

    it('shows correct page indicator for 25 batches', async () => {
      // Arrange
      const mockBatches = createMockBatchList(25);
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message when API is unavailable', async () => {
      // Arrange
      (global.fetch as Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/unable to load batches\. please try again later\./i),
        ).toBeInTheDocument();
      });
    });

    it('shows toast notification when API returns error', async () => {
      // Arrange
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['Database connection failed'],
        }),
      });

      // Act
      render(<ReportBatchesTable />);

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /database connection failed/i,
        );
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner while fetching data', async () => {
      // Arrange
      (global.fetch as Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      // Act
      render(<ReportBatchesTable />);

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/loading batches\.\.\./i)).toBeInTheDocument();
    });

    it('shows brief loading indicator during pagination', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockBatches = createMockBatchList(25);

      // First page
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockBatches.slice(0, 10), total: 25 }),
      });

      render(<ReportBatchesTable />);

      await waitFor(() => {
        expect(screen.getByText('batch-001')).toBeInTheDocument();
      });

      // Second page with delay
      (global.fetch as Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  headers: new Headers({ 'content-type': 'application/json' }),
                  json: async () => ({
                    data: mockBatches.slice(10, 20),
                    total: 25,
                  }),
                }),
              50,
            ),
          ),
      );

      // Act
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
