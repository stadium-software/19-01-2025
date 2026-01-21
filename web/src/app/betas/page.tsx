'use client';

/**
 * Instrument Betas Grid Page - Epic 5 Story 5.10
 *
 * Displays a searchable, sortable grid of instrument betas with
 * benchmark filtering, missing count indicator, and export functionality.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getBetas, exportBetas } from '@/lib/api/betas';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { Beta, BetaListParams } from '@/types/beta';
import { formatBeta, formatDate } from '@/types/beta';
import { ArrowUpDown, Download, Search, Plus, Edit } from 'lucide-react';

interface SortConfig {
  key: string;
  order: 'asc' | 'desc';
}

export default function InstrumentBetasPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [betas, setBetas] = useState<Beta[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [benchmarkFilter, setBenchmarkFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedBeta, setSelectedBeta] = useState<Beta | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch betas
  const fetchBetas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: BetaListParams = {
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
        benchmark: benchmarkFilter || undefined,
      };

      const result = await getBetas(params);
      setBetas(result.betas);
      setTotalCount(result.totalCount);
      setMissingCount(result.missingCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load betas. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortConfig, benchmarkFilter]);

  useEffect(() => {
    fetchBetas();
  }, [fetchBetas]);

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
      const blob = await exportBetas({
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
        benchmark: benchmarkFilter || undefined,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `betas-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to export betas.',
        variant: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle filter apply
  const handleApplyFilter = () => {
    fetchBetas();
  };

  // Handle row click - show popup
  const handleRowClick = (beta: Beta) => {
    setSelectedBeta(beta);
  };

  // Client-side filtering for search
  const filteredBetas = useMemo(() => {
    if (!debouncedSearch) return betas;

    const searchLower = debouncedSearch.toLowerCase();
    return betas.filter(
      (b) =>
        b.isin.toLowerCase().includes(searchLower) ||
        b.instrumentName.toLowerCase().includes(searchLower) ||
        b.benchmark.toLowerCase().includes(searchLower),
    );
  }, [betas, debouncedSearch]);

  // Client-side sorting
  const sortedBetas = useMemo(() => {
    if (!sortConfig) return filteredBetas;

    return [...filteredBetas].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Beta];
      const bValue = b[sortConfig.key as keyof Beta];

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
  }, [filteredBetas, sortConfig]);

  const columns = [
    { key: 'isin', label: 'ISIN', sortable: true },
    { key: 'instrumentName', label: 'Name', sortable: true },
    { key: 'beta', label: 'Beta', sortable: true },
    { key: 'benchmark', label: 'Benchmark', sortable: true },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true },
  ];

  // Loading state
  if (loading && betas.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div
            role="progressbar"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <p className="mt-4 text-gray-600">Loading betas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && betas.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            Failed to load betas. Please try again.
          </div>
          <Button onClick={fetchBetas} className="mt-4">
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
          <p className="text-gray-600">No beta data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instrument Betas</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage instrument beta values by benchmark
        </p>
      </div>

      <div className="space-y-4">
        {/* Missing Count Alert */}
        {missingCount > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              <strong>{missingCount}</strong> instruments missing beta data
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              role="searchbox"
              aria-label="Search betas by ISIN"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ISIN or name..."
              className="pl-10"
            />
          </div>

          {/* Benchmark Filter */}
          <div className="flex items-end gap-2">
            <div>
              <Label htmlFor="benchmark">Benchmark</Label>
              <Input
                id="benchmark"
                type="text"
                value={benchmarkFilter}
                onChange={(e) => setBenchmarkFilter(e.target.value)}
                placeholder="Filter by benchmark..."
                className="w-48"
              />
            </div>
            <Button variant="outline" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" onClick={() => router.push('/betas/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Beta
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
        {sortedBetas.length === 0 && debouncedSearch && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">No beta data found</p>
          </div>
        )}

        {/* Grid */}
        {sortedBetas.length > 0 && (
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
                {sortedBetas.map((beta) => (
                  <TableRow
                    key={beta.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(beta)}
                  >
                    <TableCell>{beta.isin}</TableCell>
                    <TableCell>{beta.instrumentName}</TableCell>
                    <TableCell>{formatBeta(beta.beta)}</TableCell>
                    <TableCell>{beta.benchmark}</TableCell>
                    <TableCell>{formatDate(beta.effectiveDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && betas.length > 0 && (
          <div className="flex justify-center py-4">
            <div
              role="progressbar"
              aria-label="Loading more"
              className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
            />
          </div>
        )}
      </div>

      {/* Beta Detail Popup */}
      <Dialog
        open={!!selectedBeta}
        onOpenChange={(open) => !open && setSelectedBeta(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBeta?.isin} - {selectedBeta?.instrumentName}
            </DialogTitle>
          </DialogHeader>

          {selectedBeta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ISIN</p>
                  <p className="font-medium">{selectedBeta.isin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instrument Name</p>
                  <p className="font-medium">{selectedBeta.instrumentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Beta</p>
                  <p className="font-medium">{formatBeta(selectedBeta.beta)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Benchmark</p>
                  <p className="font-medium">{selectedBeta.benchmark}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="font-medium">
                    {formatDate(selectedBeta.effectiveDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/betas/${selectedBeta.id}/edit`)}
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
