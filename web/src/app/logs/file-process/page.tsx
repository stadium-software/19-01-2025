'use client';

/**
 * File Process Logs Page (Story 9.1, 9.2)
 *
 * Displays a list of all file processing logs with filtering, details view and download.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/contexts/ToastContext';
import { getFileProcessLogs, downloadProcessedFile } from '@/lib/api/logs';
import type {
  FileProcessLog,
  LogFilterParams,
  FileType,
  ProcessStatus,
} from '@/types/logs';
import { LogDetailsModal } from '@/components/logs/LogDetailsModal';

export default function FileProcessLogsPage() {
  const { showToast } = useToast();

  const [logs, setLogs] = useState<FileProcessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [batchDate, setBatchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Details modal
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  // Download state
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null,
  );

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: LogFilterParams = {};
      if (batchDate) params.batchDate = batchDate;
      if (statusFilter && statusFilter !== 'all')
        params.status = statusFilter as ProcessStatus;
      if (fileTypeFilter && fileTypeFilter !== 'all')
        params.fileType = fileTypeFilter as FileType;
      if (searchTerm) params.search = searchTerm;

      const data = await getFileProcessLogs(params);
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to load file logs:', err);
      setError('Failed to load file logs');
    } finally {
      setLoading(false);
    }
  }, [batchDate, statusFilter, fileTypeFilter, searchTerm]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleRowClick = (log: FileProcessLog) => {
    setSelectedLogId(log.id);
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloadingFileId(fileId);
    try {
      const blob = await downloadProcessedFile(fileId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        variant: 'success',
        title: 'File downloaded successfully',
      });
    } catch (err) {
      console.error('Failed to download file:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Download failed. Please try again.';
      showToast({
        variant: 'error',
        title: errorMessage,
      });
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleApplyFilters = () => {
    loadLogs();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status: ProcessStatus) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Process Logs</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="mt-1">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-type-filter">File Type</Label>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger id="file-type-filter" className="mt-1">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="BLOOMBERG">Bloomberg</SelectItem>
                  <SelectItem value="CUSTODIAN">Custodian</SelectItem>
                  <SelectItem value="NAV">NAV</SelectItem>
                  <SelectItem value="TRANSACTION">Transaction</SelectItem>
                  <SelectItem value="HOLDING">Holding</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Logs Table */}
      <Card>
        <CardContent className="pt-6">
          {loading && (
            <div role="status" className="flex items-center gap-2 py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading logs...
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

          {!loading && !error && logs.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No file logs found
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">File Name</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Upload Date</th>
                    <th className="text-left py-3 px-4">Processed Date</th>
                    <th className="text-left py-3 px-4">Records Count</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(log)}
                    >
                      <td className="py-3 px-4">{log.fileName}</td>
                      <td className="py-3 px-4">{log.fileType}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(log.uploadDate)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(log.processedDate)}
                      </td>
                      <td className="py-3 px-4">{log.recordsCount}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={downloadingFileId === log.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(log.id, log.fileName);
                          }}
                        >
                          {downloadingFileId === log.id
                            ? 'Downloading...'
                            : 'Download'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLogId && (
        <LogDetailsModal
          logId={selectedLogId}
          isOpen={!!selectedLogId}
          onClose={() => setSelectedLogId(null)}
        />
      )}
    </div>
  );
}

// Named export for testing
export { FileProcessLogsPage };
