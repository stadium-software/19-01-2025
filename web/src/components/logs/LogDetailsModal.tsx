'use client';

/**
 * Log Details Modal (Story 9.14)
 *
 * Displays detailed information about a process log entry.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getLogDetails } from '@/lib/api/logs';
import type { LogDetails } from '@/types/logs';

interface LogDetailsModalProps {
  logId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetailsModal({
  logId,
  isOpen,
  onClose,
}: LogDetailsModalProps) {
  const [logDetails, setLogDetails] = useState<LogDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collapsible section states
  const [isLogExpanded, setIsLogExpanded] = useState(true);
  const [isParamsExpanded, setIsParamsExpanded] = useState(true);
  const [isErrorExpanded, setIsErrorExpanded] = useState(true);

  const loadLogDetails = useCallback(async () => {
    if (!logId || !isOpen) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getLogDetails(logId);
      setLogDetails(data);
    } catch (err) {
      console.error('Failed to load log details:', err);
      setError('Failed to load log details');
    } finally {
      setLoading(false);
    }
  }, [logId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadLogDetails();
    }
  }, [isOpen, loadLogDetails]);

  const handleCopyLog = async () => {
    if (logDetails?.fullLog) {
      await navigator.clipboard.writeText(logDetails.fullLog);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Processing Log</DialogTitle>
        </DialogHeader>

        {loading && (
          <div role="status" className="flex items-center gap-2 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">
              Loading details...
            </span>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
          >
            {error}
          </div>
        )}

        {!loading && !error && !logDetails && (
          <div className="py-4 text-center text-muted-foreground">
            No details available
          </div>
        )}

        {!loading && !error && logDetails && (
          <div className="space-y-4">
            {/* Process Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Process Name
                </label>
                <p className="mt-1">{logDetails.processName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Duration
                </label>
                <p className="mt-1">{formatDuration(logDetails.duration)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Start Time
                </label>
                <p className="mt-1">{formatDate(logDetails.startTime)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  End Time
                </label>
                <p className="mt-1">{formatDate(logDetails.endTime)}</p>
              </div>
            </div>

            {/* Input/Output Counts */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm">{`Input: ${logDetails.inputCount}`}</div>
              <div className="text-sm">
                {`Output: ${logDetails.outputCount}`}
              </div>
            </div>

            {/* Parameters Used - Collapsible */}
            {logDetails.parameters &&
              Object.keys(logDetails.parameters).length > 0 && (
                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <h4 className="text-sm font-medium">Parameters Used</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsParamsExpanded(!isParamsExpanded)}
                      aria-label={
                        isParamsExpanded
                          ? 'Collapse parameters'
                          : 'Expand parameters'
                      }
                    >
                      {isParamsExpanded ? '▼' : '▶'}
                    </Button>
                  </div>
                  {isParamsExpanded && (
                    <pre className="p-3 text-sm overflow-x-auto">
                      {JSON.stringify(logDetails.parameters, null, 2)}
                    </pre>
                  )}
                </div>
              )}

            {/* Full Process Log - Collapsible */}
            <div className="border rounded-md">
              <div className="flex items-center justify-between p-3 bg-gray-50">
                <h4 className="text-sm font-medium">Full Process Log</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLog}
                    aria-label="Copy log"
                  >
                    Copy Log
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLogExpanded(!isLogExpanded)}
                    aria-label={isLogExpanded ? 'Collapse log' : 'Expand log'}
                  >
                    {isLogExpanded ? '▼' : '▶'}
                  </Button>
                </div>
              </div>
              {isLogExpanded && (
                <pre className="p-3 bg-gray-900 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap max-h-64">
                  {logDetails.fullLog}
                </pre>
              )}
            </div>

            {/* Error Details - Collapsible (only shown if errors exist) */}
            {logDetails.errorDetails && (
              <div className="border border-red-200 rounded-md">
                <div className="flex items-center justify-between p-3 bg-red-50">
                  <h4 className="text-sm font-medium text-red-700">
                    Error Details
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                    aria-label={
                      isErrorExpanded ? 'Collapse errors' : 'Expand errors'
                    }
                  >
                    {isErrorExpanded ? '▼' : '▶'}
                  </Button>
                </div>
                {isErrorExpanded && (
                  <pre className="p-3 text-red-700 text-sm overflow-x-auto whitespace-pre-wrap">
                    {logDetails.errorDetails}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
