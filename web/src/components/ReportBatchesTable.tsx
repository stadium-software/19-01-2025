'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatusBadge } from './StatusBadge';
import { getReportBatches } from '@/lib/api/report-batches';
import type { ReportBatch } from '@/types/report-batch';

interface FetchState {
  data: ReportBatch[];
  total: number;
  loading: boolean;
  error: string | null;
}

interface ReportBatchesTableProps {
  onStateChange?: (state: {
    total: number;
    filtered: number;
    searchTerm: string;
  }) => void;
}

export function ReportBatchesTable({ onStateChange }: ReportBatchesTableProps) {
  const [state, setState] = useState<FetchState>({
    data: [],
    total: 0,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const pageSize = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBatches = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await getReportBatches({
        page,
        pageSize,
        search: debouncedSearch || undefined,
      });

      setState({
        data: result.data,
        total: result.total,
        loading: false,
        error: null,
      });

      // Notify parent of state change for export functionality
      onStateChange?.({
        total: result.total,
        filtered: debouncedSearch ? result.data.length : result.total,
        searchTerm: debouncedSearch,
      });
    } catch (err) {
      // Network errors (TypeError) get a friendly message, API errors keep their message
      const isNetworkError = err instanceof TypeError;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: isNetworkError
          ? 'Unable to load batches. Please try again later.'
          : err instanceof Error
            ? err.message
            : 'Unable to load batches. Please try again later.',
      }));
    }
  }, [page, debouncedSearch, onStateChange]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const totalPages = Math.ceil(state.total / pageSize);
  const showPagination = state.total > pageSize;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div
          role="status"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        />
        <p className="mt-4 text-gray-600">Loading batches...</p>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div role="alert" className="text-red-600">
          {state.error}
        </div>
      </div>
    );
  }

  // Empty state (no batches at all)
  if (state.total === 0 && !debouncedSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600">
          No report batches found. Create your first batch to get started.
        </p>
      </div>
    );
  }

  // Empty search results
  if (state.data.length === 0 && debouncedSearch) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="search"
            role="searchbox"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search batches..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600">No batches found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex items-center gap-4">
        <input
          type="search"
          role="searchbox"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search batches..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Batch ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Month
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.data.map((batch) => (
              <tr key={batch.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={batch.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(batch.createdDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    aria-label={`View details for batch ${batch.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    View Details
                  </button>
                  <button
                    aria-label={`View logs for batch ${batch.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
