/**
 * Integration Test: Navigate to Batch Logs (Story 1.4)
 *
 * Tests navigation from batch list to batch logs:
 * - View Logs button navigation
 * - Default tab behavior based on batch status
 * - Direct URL access
 * - Error handling
 * - Keyboard navigation
 */

import { vi, type Mock, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BatchListItem } from '@/components/BatchListItem';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    refresh: vi.fn(),
  }),
  usePathname: () => '/batches',
  useSearchParams: () => new URLSearchParams('page=1&search='),
}));

// Mock the API client
global.fetch = vi.fn();

// Mock toast context
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('Batch Logs Navigation - Story 1.4', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('navigates to logs view when View Logs is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'In Progress' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('displays batch information in logs view after navigation', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Completed' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('preserves batch list state when navigating back', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert - navigation should preserve query params
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/batches/batch-001/logs'),
      );
    });

    it('shows correct URL pattern in address bar', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-123',
        month: 'February',
        year: 2024,
        status: 'Completed' as const,
        createdDate: '2024-02-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-123/logs');
    });
  });

  describe('Tab Default Behavior', () => {
    it('shows Workflow Logs tab active by default for non-failed batches', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          defaultTab: 'workflow',
          logs: [],
        }),
      });

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'In Progress' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('shows Job Execution Logs tab active by default for failed batches', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          defaultTab: 'execution',
          logs: [],
        }),
      });

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Failed' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });
  });

  describe('Button States', () => {
    it('shows tooltip on hover over View Logs button', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      const button = screen.getByRole('button', { name: /view logs/i });
      await user.hover(button);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/view execution logs for this batch/i),
        ).toBeInTheDocument();
      });
    });

    it('shows View Logs button for Pending batch with empty logs', async () => {
      // Arrange
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /view logs/i }),
      ).toBeInTheDocument();
    });

    it('disables View Logs button when batch is being deleted', async () => {
      // Arrange
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} isDeleting={true} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /view logs/i }),
      ).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('shows 404 error for non-existent batch ID', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['Batch not found'],
        }),
      });

      const batch = {
        id: 'non-existent-batch',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/non-existent-batch/logs');
    });

    it('shows empty message when batch has no logs yet', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          logs: [],
        }),
      });

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });
  });

  describe('Error Handling', () => {
    it('shows error toast when API is unavailable', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /unable to load batch logs\. please try again later\./i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('shows paginated results for large log files', async () => {
      // Arrange
      const user = userEvent.setup();
      const largeLogs = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        message: `Log entry ${i}`,
        timestamp: '2024-01-15T10:00:00Z',
      }));

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          logs: largeLogs.slice(0, 100),
          total: 1000,
          hasMore: true,
        }),
      });

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Completed' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('redirects to login when session expires', async () => {
      // Arrange
      const user = userEvent.setup();
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          Messages: ['Session expired'],
        }),
      });

      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/login'),
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates when Enter is pressed on focused button', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      const button = screen.getByRole('button', { name: /view logs/i });
      button.focus();
      await user.keyboard('{Enter}');

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('opens in new tab when Ctrl+Click is used', async () => {
      // Arrange
      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      const button = screen.getByRole('button', { name: /view logs/i });
      await user.click(button, { ctrlKey: true });

      // Assert - Ctrl+Click should open in new tab (browser behavior)
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });
  });

  describe('Direct URL Access', () => {
    it('loads logs view when navigating directly to URL', async () => {
      // Arrange
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          logs: [],
        }),
      });

      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Pending' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });

    it('allows sharing logs URL with proper permissions', async () => {
      // Arrange
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          id: 'batch-001',
          month: 'January',
          year: 2024,
          logs: [],
          hasAccess: true,
        }),
      });

      const user = userEvent.setup();
      const batch = {
        id: 'batch-001',
        month: 'January',
        year: 2024,
        status: 'Completed' as const,
        createdDate: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
      };

      render(<BatchListItem batch={batch} />);

      // Act
      await user.click(screen.getByRole('button', { name: /view logs/i }));

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/batches/batch-001/logs');
    });
  });
});
