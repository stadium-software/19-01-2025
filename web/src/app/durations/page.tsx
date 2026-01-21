'use client';

/**
 * Instrument Durations Grid Page - Epic 5 Story 5.7
 *
 * Displays a searchable, sortable grid of instrument durations with
 * missing count indicator and export functionality.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getDurations, exportDurations } from '@/lib/api/durations';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Duration, DurationListParams } from '@/types/duration';
import { formatDuration, formatYtm, formatDate } from '@/types/duration';
import { ArrowUpDown, Download, Search, Plus, Edit } from 'lucide-react';

interface SortConfig {
  key: string;
  order: 'asc' | 'desc';
}

export default function InstrumentDurationsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [durations, setDurations] = useState<Duration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(
    null,
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch durations
  const fetchDurations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: DurationListParams = {
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
      };

      const result = await getDurations(params);
      setDurations(result.durations);
      setTotalCount(result.totalCount);
      setMissingCount(result.missingCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load durations. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortConfig]);

  useEffect(() => {
    fetchDurations();
  }, [fetchDurations]);

  // Handle sort
  const handleSort = useCallback((columnKey: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnKey) {
        return { key: columnKey, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { key: columnKey, order: 'asc' };
    });
  }, []);

  // Handle export
  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportDurations({
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `durations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'Failed to export durations.',
        variant: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle row click - show popup
  const handleRowClick = (duration: Duration) => {
    setSelectedDuration(duration);
  };

  // Client-side filtering for search
  const filteredDurations = useMemo(() => {
    if (!debouncedSearch) return durations;

    const searchLower = debouncedSearch.toLowerCase();
    return durations.filter(
      (d) =>
        d.isin.toLowerCase().includes(searchLower) ||
        d.instrumentName.toLowerCase().includes(searchLower),
    );
  }, [durations, debouncedSearch]);

  // Client-side sorting
  const sortedDurations = useMemo(() => {
    if (!sortConfig) return filteredDurations;

    return [...filteredDurations].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Duration];
      const bValue = b[sortConfig.key as keyof Duration];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison: number;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.order === 'asc' ? comparison : -comparison;
    });
  }, [filteredDurations, sortConfig]);

  const columns = [
    { key: 'isin', label: 'ISIN', sortable: true },
    { key: 'instrumentName', label: 'Name', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true },
    { key: 'ytm', label: 'YTM', sortable: true },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true },
  ];

  // Loading state
  if (loading && durations.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div
            role="progressbar"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <p className="mt-4 text-gray-600">Loading durations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && durations.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            Failed to load durations. Please try again.
          </div>
          <Button onClick={fetchDurations} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalCount === 0 && !debouncedSearch && !loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600">No duration data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Instrument Durations
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage instrument durations and YTM values
        </p>
      </div>

      <div className="space-y-4">
        {/* Missing Count Alert */}
        {missingCount > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              <strong>{missingCount}</strong> instruments missing duration data
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              role="searchbox"
              aria-label="Search durations by ISIN"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ISIN or name..."
              className="pl-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={() => router.push('/durations/add')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Duration
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Empty search results */}
        {sortedDurations.length === 0 && debouncedSearch && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">No duration data found</p>
          </div>
        )}

        {/* Grid */}
        {sortedDurations.length > 0 && (
          <div
            role="grid"
            className="border rounded-lg overflow-auto max-h-[600px]"
          >
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      role="columnheader"
                      className={
                        column.sortable ? 'cursor-pointer select-none' : ''
                      }
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && (
                          <ArrowUpDown
                            className={`h-4 w-4 ${
                              sortConfig?.key === column.key
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDurations.map((duration) => (
                  <TableRow
                    key={duration.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(duration)}
                  >
                    <TableCell>{duration.isin}</TableCell>
                    <TableCell>{duration.instrumentName}</TableCell>
                    <TableCell>{formatDuration(duration.duration)}</TableCell>
                    <TableCell>{formatYtm(duration.ytm)}</TableCell>
                    <TableCell>{formatDate(duration.effectiveDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && durations.length > 0 && (
          <div className="flex justify-center py-4">
            <div
              role="progressbar"
              aria-label="Loading more"
              className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
            />
          </div>
        )}
      </div>

      {/* Duration Detail Popup */}
      <Dialog
        open={!!selectedDuration}
        onOpenChange={(open) => !open && setSelectedDuration(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDuration?.isin} - {selectedDuration?.instrumentName}
            </DialogTitle>
          </DialogHeader>

          {selectedDuration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ISIN</p>
                  <p className="font-medium">{selectedDuration.isin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instrument Name</p>
                  <p className="font-medium">
                    {selectedDuration.instrumentName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">
                    {formatDuration(selectedDuration.duration)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">YTM</p>
                  <p className="font-medium">
                    {formatYtm(selectedDuration.ytm)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="font-medium">
                    {formatDate(selectedDuration.effectiveDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/durations/${selectedDuration.id}/edit`)
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
