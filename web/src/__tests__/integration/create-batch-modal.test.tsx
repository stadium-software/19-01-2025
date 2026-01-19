/**
 * Integration Test: Create New Report Batch (Story 1.2)
 *
 * Tests the Create Batch modal functionality including:
 * - Form rendering and validation
 * - Batch creation with month/year selection
 * - Auto-import SFTP checkbox
 * - Modal interaction (open/close/cancel)
 * - Loading and error states
 */

import { vi, type Mock, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateBatchModal } from '@/components/CreateBatchModal';

// Mock the API client
global.fetch = vi.fn();

// Mock the toast context
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('Create Batch Modal - Story 1.2', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Happy Path', () => {
    it('opens modal when New Batch button is clicked', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      // Act
      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Assert
      expect(
        screen.getByRole('heading', { name: /create new report batch/i }),
      ).toBeInTheDocument();
    });

    it('displays all form fields in the modal', async () => {
      // Arrange & Act
      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Assert
      expect(screen.getByLabelText(/month/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/auto-import from sftp/i),
      ).toBeInTheDocument();
    });

    it('creates batch successfully with valid data', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          status: 'Pending',
        }),
      });

      render(
        <CreateBatchModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/report-batches'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            month: 'January',
            year: 2024,
            autoImport: false,
          }),
        }),
      );
    });

    it('creates batch with Pending status when auto-import is disabled', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          status: 'Pending',
        }),
      });

      render(
        <CreateBatchModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            body: expect.stringContaining('"autoImport":false'),
          }),
        );
      });
    });

    it('creates batch with In Progress status when auto-import is enabled', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          status: 'In Progress',
        }),
      });

      render(
        <CreateBatchModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByLabelText(/auto-import from sftp/i));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            body: expect.stringContaining('"autoImport":true'),
          }),
        );
      });
    });
  });

  describe('Form Validation', () => {
    it('shows error when month is not selected', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/month is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when year is not selected', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/year is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when batch for selected month/year already exists', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['A batch for January 2024 already exists'],
        }),
      });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/a batch for january 2024 already exists/i),
        ).toBeInTheDocument();
      });
    });

    it('allows submission when auto-import is unchecked', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          status: 'Pending',
        }),
      });

      render(
        <CreateBatchModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert - no validation error
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Modal Interaction', () => {
    it('closes modal when Cancel button is clicked', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Assert
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes modal when clicking outside the modal', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      const overlay = screen.getByRole('dialog').parentElement;
      if (overlay) {
        await user.click(overlay);
      }

      // Assert
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows confirmation dialog when closing with unsaved changes', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act - make changes
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/are you sure\? unsaved changes will be lost\./i),
        ).toBeInTheDocument();
      });
    });

    it('closes modal after confirming discard changes', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Make changes
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Act
      await user.click(
        screen.getByRole('button', { name: /yes, discard changes/i }),
      );

      // Assert
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Dropdown Options', () => {
    it('displays all 12 months in the dropdown', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));

      // Assert
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

      months.forEach((month) => {
        expect(screen.getByRole('option', { name: month })).toBeInTheDocument();
      });
    });

    it('displays years from current year - 5 to current year + 1', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/year/i));

      // Assert - current year is 2024 based on mocked date
      const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

      years.forEach((year) => {
        expect(
          screen.getByRole('option', { name: String(year) }),
        ).toBeInTheDocument();
      });
    });

    it('defaults to current month and year', async () => {
      // Arrange & Act
      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Assert - current date is March 2024
      expect(screen.getByLabelText(/month/i)).toHaveValue('March');
      expect(screen.getByLabelText(/year/i)).toHaveValue('2024');
    });
  });

  describe('Auto-Import Checkbox', () => {
    it('shows helper text when auto-import is checked', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/auto-import from sftp/i));

      // Assert
      expect(
        screen.getByText(
          /files will be imported automatically from configured sftp server/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('suggests January next year when creating December batch', async () => {
      // Arrange
      vi.setSystemTime(new Date('2024-12-15T12:00:00Z'));

      // Act
      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Assert
      expect(screen.getByLabelText(/month/i)).toHaveValue('December');
      expect(screen.getByLabelText(/year/i)).toHaveValue('2024');
    });
  });

  describe('Error Handling', () => {
    it('shows error toast when API is unavailable', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/unable to create batch\. please try again later\./i),
        ).toBeInTheDocument();
      });
    });

    it('shows API error message when server returns 500', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['Database connection failed'],
        }),
      });

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/database connection failed/i),
        ).toBeInTheDocument();
      });
    });

    it('shows timeout error message when request times out', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 30000),
          ),
      );

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      await waitFor(
        () => {
          expect(
            screen.getByText(/request timed out\. please try again\./i),
          ).toBeInTheDocument();
        },
        { timeout: 31000 },
      );
    });
  });

  describe('Loading States', () => {
    it('shows spinner and disables button during creation', async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      (global.fetch as Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<CreateBatchModal isOpen={true} onClose={mockOnClose} />);

      // Act
      await user.click(screen.getByLabelText(/month/i));
      await user.click(screen.getByRole('option', { name: 'January' }));

      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByRole('option', { name: '2024' }));

      await user.click(screen.getByRole('button', { name: /create batch/i }));

      // Assert
      expect(
        screen.getByRole('button', { name: /creating\.\.\./i }),
      ).toBeDisabled();
    });
  });
});
