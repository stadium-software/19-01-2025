'use client';

/**
 * Monthly Process Logs Page (Story 9.8, 9.9, 9.10)
 *
 * Displays monthly process logs and approval logs with filtering, search, and export.
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
import { getMonthlyProcessLogs, exportMonthlyLogs } from '@/lib/api/logs';
import { getApprovalLogs } from '@/lib/api/approvals';
import type { MonthlyProcessLog, ProcessStatus } from '@/types/logs';
import type { ApprovalLogItem } from '@/types/approval';

export default function MonthlyProcessLogsPage() {
  const { showToast } = useToast();

  // Process Logs state
  const [processLogs, setProcessLogs] = useState<MonthlyProcessLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<MonthlyProcessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Approval Logs state
  const [approvalLogs, setApprovalLogs] = useState<ApprovalLogItem[]>([]);

  // Filters
  const [reportDate, setReportDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: { startDate?: string; status?: ProcessStatus } = {};
      if (reportDate) params.startDate = reportDate;
      if (statusFilter && statusFilter !== 'all')
        params.status = statusFilter as ProcessStatus;

      const [processData, approvalData] = await Promise.all([
        getMonthlyProcessLogs(params),
        getApprovalLogs(),
      ]);

      setProcessLogs(processData.logs);
      setFilteredLogs(processData.logs);
      setApprovalLogs(approvalData.logs);
    } catch (err) {
      console.error('Failed to load monthly logs:', err);
      setError('Failed to load monthly logs');
    } finally {
      setLoading(false);
    }
  }, [reportDate, statusFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Filter logs based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLogs(processLogs);
    } else {
      const filtered = processLogs.filter((log) =>
        log.processName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredLogs(filtered);
    }
  }, [searchTerm, processLogs]);

  const handleApplyFilters = () => {
    loadLogs();
  };

  const handleSearch = () => {
    // Trigger search - effect handles filtering
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await exportMonthlyLogs(reportDate || 'current');

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly-logs-${reportDate || 'current'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        variant: 'success',
        title: 'Monthly logs exported successfully',
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        <h1 className="text-2xl font-bold">Monthly Process Logs</h1>
        <Button
          onClick={handleExport}
          disabled={exporting || filteredLogs.length === 0}
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
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <Label htmlFor="report-date">Report Date</Label>
              <Input
                id="report-date"
                type="month"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="mt-1 w-36">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleApplyFilters} variant="outline">
              Apply
            </Button>
            <div className="flex-1" />
            <div className="flex gap-2">
              <div>
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                : 'No logs found'}
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
                    <th className="text-left py-3 px-4">Records</th>
                    <th className="text-left py-3 px-4">Error Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
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
                      <td className="py-3 px-4">{log.recordsProcessed}</td>
                      <td className="py-3 px-4">{log.errorCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Logs Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading && approvalLogs.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No approval logs found
            </div>
          )}

          {approvalLogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Batch Date</th>
                    <th className="text-left py-3 px-4">Level</th>
                    <th className="text-left py-3 px-4">Action</th>
                    <th className="text-left py-3 px-4">Approver</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalLogs.map((log, index) => (
                    <tr
                      key={`${log.batchDate}-${log.level}-${index}`}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{log.batchDate}</td>
                      <td className="py-3 px-4">Level {log.level}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.action === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.approver}</td>
                      <td className="py-3 px-4">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Named export for testing
export { MonthlyProcessLogsPage };
