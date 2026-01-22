'use client';

/**
 * File Faults Page (Story 9.3, 9.4)
 *
 * Displays a list of file processing faults with filtering and export functionality.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/contexts/ToastContext';
import { getFileFaults, exportFileFaults } from '@/lib/api/logs';
import type { FileFault, LogFilterParams } from '@/types/logs';

export default function FileFaultsPage() {
  const { showToast } = useToast();

  const [faults, setFaults] = useState<FileFault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [batchDate, setBatchDate] = useState('');
  const [fileNameFilter, setFileNameFilter] = useState('');

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Details modal
  const [selectedFault, setSelectedFault] = useState<FileFault | null>(null);

  const loadFaults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: LogFilterParams = {};
      if (batchDate) params.batchDate = batchDate;
      if (fileNameFilter) params.search = fileNameFilter;

      const data = await getFileFaults(params);
      setFaults(data.faults);
    } catch (err) {
      console.error('Failed to load faults:', err);
      setError('Failed to load faults');
    } finally {
      setLoading(false);
    }
  }, [batchDate, fileNameFilter]);

  useEffect(() => {
    loadFaults();
  }, [loadFaults]);

  const handleApplyFilters = () => {
    loadFaults();
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const params: LogFilterParams = {};
      if (batchDate) params.batchDate = batchDate;
      if (fileNameFilter) params.search = fileNameFilter;

      const blob = await exportFileFaults(params);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `file-faults-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        variant: 'success',
        title: 'File faults exported successfully',
      });
    } catch (err) {
      console.error('Failed to export faults:', err);
      setExportError('Export failed');
      showToast({
        variant: 'error',
        title: 'Export failed. Please try again.',
      });
    } finally {
      setExporting(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityBadgeClass = (severity: 'ERROR' | 'WARNING') => {
    return severity === 'ERROR'
      ? 'bg-red-100 text-red-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Faults</h1>
        <Button
          onClick={handleExport}
          disabled={exporting || faults.length === 0}
        >
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </div>

      {exportError && (
        <div
          role="alert"
          className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
        >
          {exportError}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="batch-date">Batch Date</Label>
              <Input
                id="batch-date"
                type="date"
                value={batchDate}
                onChange={(e) => setBatchDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="file-name-filter">File Name</Label>
              <Input
                id="file-name-filter"
                type="text"
                placeholder="Filter by file name..."
                value={fileNameFilter}
                onChange={(e) => setFileNameFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleApplyFilters} variant="outline">
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faults Table */}
      <Card>
        <CardContent className="pt-6">
          {loading && (
            <div role="status" className="flex items-center gap-2 py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading faults...
              </span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
            >
              {error}
            </div>
          )}

          {!loading && !error && faults.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No faults found - all files processed successfully
            </div>
          )}

          {!loading && !error && faults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">File Name</th>
                    <th className="text-left py-3 px-4">Row Number</th>
                    <th className="text-left py-3 px-4">Column</th>
                    <th className="text-left py-3 px-4">Error Message</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                    <th className="text-left py-3 px-4">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {faults.map((fault) => (
                    <tr
                      key={fault.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedFault(fault)}
                    >
                      <td className="py-3 px-4">{fault.fileName}</td>
                      <td className="py-3 px-4">{fault.rowNumber}</td>
                      <td className="py-3 px-4">{fault.column}</td>
                      <td className="py-3 px-4">{fault.errorMessage}</td>
                      <td className="py-3 px-4">
                        {formatTimestamp(fault.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeClass(fault.severity)}`}
                        >
                          {fault.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fault Details Modal */}
      <Dialog
        open={selectedFault !== null}
        onOpenChange={(open) => !open && setSelectedFault(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
          </DialogHeader>
          {selectedFault && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    File Name
                  </label>
                  <p className="mt-1">{selectedFault.fileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Row {selectedFault.rowNumber}
                  </label>
                  <p className="mt-1">Column: {selectedFault.column}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Error Message
                </label>
                <p className="mt-1 p-3 bg-red-50 text-red-700 rounded-md">
                  {selectedFault.errorMessage}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Timestamp
                </label>
                <p className="mt-1">
                  {formatTimestamp(selectedFault.timestamp)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Severity
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeClass(selectedFault.severity)}`}
                  >
                    {selectedFault.severity}
                  </span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Named export for testing
export { FileFaultsPage };
