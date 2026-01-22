'use client';

/**
 * Weekly Process Logs Page (Story 9.5, 9.6, 9.7)
 *
 * Displays weekly process logs and user audit trail with filtering and export.
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
import {
  getWeeklyProcessLogs,
  getUserAuditTrail,
  exportWeeklyLogs,
  getBatchDates,
} from '@/lib/api/logs';
import type {
  WeeklyProcessLog,
  UserAuditEntry,
  ProcessStatus,
} from '@/types/logs';
import { UserAuditTrailGrid } from '@/components/logs/UserAuditTrailGrid';
import { LogDetailsModal } from '@/components/logs/LogDetailsModal';

export default function WeeklyProcessLogsPage() {
  const { showToast } = useToast();

  // Process Logs state
  const [processLogs, setProcessLogs] = useState<WeeklyProcessLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WeeklyProcessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Audit Trail state
  const [auditEntries, setAuditEntries] = useState<UserAuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Batch dates
  const [batchDates, setBatchDates] = useState<string[]>([]);
  const [selectedBatchDate, setSelectedBatchDate] = useState<string>('');

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Log details modal state
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  // Load batch dates on mount
  useEffect(() => {
    const loadBatchDates = async () => {
      try {
        const data = await getBatchDates();
        setBatchDates(data.dates);
        if (data.dates.length > 0) {
          setSelectedBatchDate(data.dates[0]);
        }
      } catch (err) {
        console.error('Failed to load batch dates:', err);
      }
    };
    loadBatchDates();
  }, []);

  const loadProcessLogs = useCallback(async () => {
    if (!selectedBatchDate) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getWeeklyProcessLogs(
        selectedBatchDate,
        undefined,
        statusFilter,
      );
      setProcessLogs(data.logs);
      setFilteredLogs(data.logs);
    } catch (err) {
      console.error('Failed to load weekly logs:', err);
      setError('Failed to load weekly logs');
    } finally {
      setLoading(false);
    }
  }, [selectedBatchDate, statusFilter]);

  // Filter logs based on search term (client-side)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLogs(processLogs);
      setSearchError(null);
    } else {
      const filtered = processLogs.filter((log) =>
        log.processName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredLogs(filtered);
    }
  }, [searchTerm, processLogs]);

  // Server-side search handler (triggered by Enter key)
  const handleServerSearch = async () => {
    if (!selectedBatchDate || !searchTerm) return;

    try {
      setLoading(true);
      setSearchError(null);
      const data = await getWeeklyProcessLogs(
        selectedBatchDate,
        searchTerm,
        statusFilter,
      );
      setFilteredLogs(data.logs);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleServerSearch();
    }
  };

  const loadAuditTrail = useCallback(async () => {
    if (!selectedBatchDate) return;

    try {
      setAuditLoading(true);
      setAuditError(null);
      const data = await getUserAuditTrail({ batchDate: selectedBatchDate });
      setAuditEntries(data.entries);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
      setAuditError('Failed to load audit trail');
    } finally {
      setAuditLoading(false);
    }
  }, [selectedBatchDate]);

  useEffect(() => {
    loadProcessLogs();
    loadAuditTrail();
  }, [loadProcessLogs, loadAuditTrail]);

  const handleExport = async () => {
    if (!selectedBatchDate) return;

    setExporting(true);
    setExportError(null);
    try {
      const blob = await exportWeeklyLogs(selectedBatchDate);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weekly-logs-${selectedBatchDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        variant: 'success',
        title: 'Weekly logs exported successfully',
      });
    } catch (err) {
      console.error('Failed to export logs:', err);
      setExportError('Export failed');
      showToast({
        variant: 'error',
        title: 'Export failed. Please try again.',
      });
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
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
        <h1 className="text-2xl font-bold">Weekly Process Logs</h1>
        <Button
          onClick={handleExport}
          disabled={exporting || processLogs.length === 0}
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

      {/* Batch Date Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <Label htmlFor="report-batch-date">Report Batch Date</Label>
              <Select
                value={selectedBatchDate}
                onValueChange={setSelectedBatchDate}
              >
                <SelectTrigger id="report-batch-date" className="mt-1 w-48">
                  <SelectValue placeholder="Select batch date" />
                </SelectTrigger>
                <SelectContent>
                  {batchDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="mt-1 w-36">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <div>
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-64"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {searchError && (
        <div
          role="alert"
          className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
        >
          {searchError}
        </div>
      )}

      {/* Process Logs Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Process Logs</CardTitle>
        </CardHeader>
        <CardContent>
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

          {!loading && !error && filteredLogs.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              {searchTerm
                ? `No results found for '${searchTerm}'`
                : statusFilter !== 'all'
                  ? `No logs found with status '${statusFilter}'`
                  : 'No logs found for this date'}
            </div>
          )}

          {!loading && !error && filteredLogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Process Name</th>
                    <th className="text-left py-3 px-4">Start Time</th>
                    <th className="text-left py-3 px-4">End Time</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Error Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedLogId(log.id)}
                    >
                      <td className="py-3 px-4">{log.processName}</td>
                      <td className="py-3 px-4">{formatTime(log.startTime)}</td>
                      <td className="py-3 px-4">{formatTime(log.endTime)}</td>
                      <td className="py-3 px-4">
                        {formatDuration(log.duration)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.errorCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Audit Trail Grid */}
      <Card>
        <CardHeader>
          <CardTitle>User Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <UserAuditTrailGrid
            batchDate={selectedBatchDate}
            entries={auditEntries}
            loading={auditLoading}
            error={auditError}
          />
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
export { WeeklyProcessLogsPage };
