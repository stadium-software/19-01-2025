'use client';

/**
 * Calculation Logs Page (Story 9.11)
 *
 * Displays calculation logs with step-by-step details.
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCalculationLogs } from '@/lib/api/logs';
import type {
  CalculationLog,
  CalculationStep,
  ProcessStatus,
} from '@/types/logs';

export default function CalculationLogsPage() {
  const [logs, setLogs] = useState<CalculationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected calculation for step details
  const [selectedCalc, setSelectedCalc] = useState<CalculationLog | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCalculationLogs();
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to load calculation logs:', err);
      setError('Failed to load calculation logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
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

  const handleRowClick = (log: CalculationLog) => {
    if (selectedCalc?.id === log.id) {
      setSelectedCalc(null);
    } else {
      setSelectedCalc(log);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calculation Logs</h1>
      </div>

      {/* Calculation Logs Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Logs</CardTitle>
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

          {!loading && !error && logs.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No calculation logs found
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Calculation Name</th>
                    <th className="text-left py-3 px-4">Start Time</th>
                    <th className="text-left py-3 px-4">End Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Records Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <>
                      <tr
                        key={log.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(log)}
                      >
                        <td className="py-3 px-4">{log.calculationName}</td>
                        <td className="py-3 px-4">
                          {formatTime(log.startTime)}
                        </td>
                        <td className="py-3 px-4">{formatTime(log.endTime)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(log.status)}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{log.recordsProcessed}</td>
                      </tr>
                      {selectedCalc?.id === log.id &&
                        log.steps &&
                        log.steps.length > 0 && (
                          <tr key={`${log.id}-steps`}>
                            <td colSpan={5} className="p-0">
                              <StepDetailsTable steps={log.steps} />
                            </td>
                          </tr>
                        )}
                    </>
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

// Step details table component
function StepDetailsTable({ steps }: { steps: CalculationStep[] }) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes === 0) {
      return `${seconds}s`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="bg-gray-50 p-4 border-t">
      <h4 className="text-sm font-medium mb-2">Calculation Steps</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Step</th>
            <th className="text-left py-2 px-3">Name</th>
            <th className="text-left py-2 px-3">Start Time</th>
            <th className="text-left py-2 px-3">End Time</th>
            <th className="text-left py-2 px-3">Duration</th>
            <th className="text-left py-2 px-3">Records</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.stepNumber} className="border-b">
              <td className="py-2 px-3">{step.stepNumber}</td>
              <td className="py-2 px-3">{step.stepName}</td>
              <td className="py-2 px-3">{formatTime(step.startTime)}</td>
              <td className="py-2 px-3">{formatTime(step.endTime)}</td>
              <td className="py-2 px-3">{formatDuration(step.duration)}</td>
              <td className="py-2 px-3">{step.recordsProcessed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Named export for testing
export { CalculationLogsPage };
