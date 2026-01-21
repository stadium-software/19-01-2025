'use client';

/**
 * Index Prices Grid Page - Epic 5 Story 5.1, 5.6
 *
 * Displays a searchable, sortable grid of index prices with date range filtering,
 * export functionality, and popup details view.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getIndexPrices, exportIndexPrices } from '@/lib/api/index-prices';
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
import type { IndexPrice, IndexPriceListParams } from '@/types/index-price';
import {
  formatPrice,
  formatChangePercent,
  formatDate,
} from '@/types/index-price';
import {
  ArrowUpDown,
  Download,
  Search,
  Plus,
  Upload,
  History,
  Edit,
} from 'lucide-react';

interface SortConfig {
  key: string;
  order: 'asc' | 'desc';
}

export default function IndexPricesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [prices, setPrices] = useState<IndexPrice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<IndexPrice | null>(null);
  const [popupError, setPopupError] = useState<string | null>(null);

  // Date range filter state with default last 30 days
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch prices
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: IndexPriceListParams = {
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
        startDate,
        endDate,
      };

      const result = await getIndexPrices(params);
      setPrices(result.prices);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load index prices. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortConfig, startDate, endDate]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

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
      const blob = await exportIndexPrices({
        search: debouncedSearch || undefined,
        sortBy: sortConfig?.key,
        sortOrder: sortConfig?.order,
        startDate,
        endDate,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `index-prices-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'Failed to export index prices.',
        variant: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle row click - show popup
  const handleRowClick = (price: IndexPrice) => {
    setPopupError(null);
    setSelectedPrice(price);
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    fetchPrices();
  };

  // Client-side filtering for search
  const filteredPrices = useMemo(() => {
    if (!debouncedSearch) return prices;

    const searchLower = debouncedSearch.toLowerCase();
    return prices.filter(
      (price) =>
        price.indexCode.toLowerCase().includes(searchLower) ||
        price.indexName.toLowerCase().includes(searchLower),
    );
  }, [prices, debouncedSearch]);

  // Client-side sorting
  const sortedPrices = useMemo(() => {
    if (!sortConfig) return filteredPrices;

    return [...filteredPrices].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof IndexPrice];
      const bValue = b[sortConfig.key as keyof IndexPrice];

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
  }, [filteredPrices, sortConfig]);

  const columns = [
    { key: 'indexCode', label: 'Index Code', sortable: true },
    { key: 'indexName', label: 'Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'currency', label: 'Currency', sortable: true },
  ];

  // Loading state
  if (loading && prices.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div
            role="progressbar"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <p className="mt-4 text-gray-600">Loading index prices...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && prices.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            Failed to load index prices. Please try again.
          </div>
          <Button onClick={fetchPrices} className="mt-4">
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
          <p className="text-gray-600">No index prices found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Index Prices</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage index prices
        </p>
      </div>

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              role="searchbox"
              aria-label="Search index prices"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by index code or name..."
              className="pl-10"
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex items-end gap-2">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={() => router.push('/index-prices/add')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Price
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/index-prices/upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export to Excel'}
            </Button>
          </div>
        </div>

        {/* Empty search results */}
        {sortedPrices.length === 0 && debouncedSearch && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">No index prices found</p>
          </div>
        )}

        {/* Grid */}
        {sortedPrices.length > 0 && (
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
                {sortedPrices.map((price) => (
                  <TableRow
                    key={price.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(price)}
                  >
                    <TableCell>{price.indexCode}</TableCell>
                    <TableCell>{price.indexName}</TableCell>
                    <TableCell>{formatDate(price.date)}</TableCell>
                    <TableCell>{formatPrice(price.price)}</TableCell>
                    <TableCell>{price.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && prices.length > 0 && (
          <div className="flex justify-center py-4">
            <div
              role="progressbar"
              aria-label="Loading more"
              className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
            />
          </div>
        )}
      </div>

      {/* Price Detail Popup - Story 5.6 */}
      <Dialog
        open={!!selectedPrice}
        onOpenChange={(open) => !open && setSelectedPrice(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPrice?.indexCode} - {selectedPrice?.indexName}
            </DialogTitle>
          </DialogHeader>

          {popupError ? (
            <div className="text-red-600">{popupError}</div>
          ) : selectedPrice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Index Code</p>
                  <p className="font-medium">{selectedPrice.indexCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Index Name</p>
                  <p className="font-medium">{selectedPrice.indexName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="font-medium">
                    {formatPrice(selectedPrice.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previous Price</p>
                  <p className="font-medium">
                    {selectedPrice.previousPrice
                      ? formatPrice(selectedPrice.previousPrice)
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Change</p>
                  <p
                    className={`font-medium ${
                      selectedPrice.changePercent &&
                      selectedPrice.changePercent >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {selectedPrice.changePercent !== undefined
                      ? formatChangePercent(selectedPrice.changePercent)
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="font-medium">{selectedPrice.currency}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/index-prices/${selectedPrice.indexCode}/history`,
                    )
                  }
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/index-prices/${selectedPrice.id}/edit`)
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
