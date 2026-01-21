'use client';

/**
 * Index Price History Page - Epic 5 Story 5.5
 *
 * Displays historical prices for a specific index with date filtering,
 * chart visualization, and export functionality.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  getIndexPriceHistory,
  exportIndexPriceHistory,
} from '@/lib/api/index-prices';
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
import type { IndexPriceHistoryEntry } from '@/types/index-price';
import {
  formatPrice,
  formatChangePercent,
  formatDate,
} from '@/types/index-price';
import { Download, ArrowLeft } from 'lucide-react';

export default function IndexPriceHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const indexCode = params.indexCode as string;

  // State
  const [history, setHistory] = useState<IndexPriceHistoryEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [indexName, setIndexName] = useState<string>('');

  // Date range filter
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6); // Default to last 6 months
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Fetch history
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getIndexPriceHistory(indexCode, {
        startDate,
        endDate,
      });

      setHistory(result.history);
      setTotalCount(result.totalCount);

      // Set index name from first result
      if (result.history.length > 0) {
        setIndexName(result.history[0].indexName);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load history. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [indexCode, startDate, endDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle filter apply
  const handleApplyFilter = () => {
    fetchHistory();
  };

  // Handle export
  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportIndexPriceHistory(indexCode, {
        startDate,
        endDate,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${indexCode}-history-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to export. Please try again.',
      );
    } finally {
      setExporting(false);
    }
  };

  // Sort history by date descending
  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [history]);

  // Filter by date range client-side (in addition to server-side)
  const filteredHistory = useMemo(() => {
    return sortedHistory.filter((entry) => {
      const entryDate = new Date(entry.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return entryDate >= start && entryDate <= end;
    });
  }, [sortedHistory, startDate, endDate]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div
            role="progressbar"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && history.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            Failed to load history. Please try again.
          </div>
          <Button onClick={fetchHistory} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalCount === 0 && !loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/index-prices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Index Prices
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600">
            No historical data found for {indexCode}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/index-prices')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Index Prices
        </Button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {indexName || indexCode} History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Historical prices for {indexCode}
        </p>
      </div>

      <div className="space-y-4">
        {/* Filters and Actions */}
        <div className="flex flex-wrap items-end gap-4">
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

          {/* Export Button */}
          <div className="ml-auto">
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

        {/* Price Chart Placeholder */}
        <div
          role="img"
          aria-label="Price history chart"
          className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border"
        >
          <p className="text-gray-500">Price history chart visualization</p>
        </div>

        {/* History Table */}
        {filteredHistory.length > 0 ? (
          <div className="border rounded-lg overflow-auto max-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{formatPrice(entry.price)}</TableCell>
                    <TableCell
                      className={
                        entry.changePercent >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {formatChangePercent(entry.changePercent)}
                    </TableCell>
                    <TableCell>{entry.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">
              No historical data for selected date range
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
