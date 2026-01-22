'use client';

/**
 * Calculation Errors Page (Story 9.12)
 *
 * Displays calculation errors with filtering and stack trace details.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCalculationErrors } from '@/lib/api/logs';
import type { CalculationError } from '@/types/logs';

export default function CalculationErrorsPage() {
  const [errors, setErrors] = useState<CalculationError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [calculationNameFilter, setCalculationNameFilter] = useState('');

  // Selected error for stack trace details
  const [selectedError, setSelectedError] = useState<CalculationError | null>(
    null,
  );

  const loadErrors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: { calculationType?: string } = {};
      if (calculationNameFilter) params.calculationType = calculationNameFilter;

      const data = await getCalculationErrors(params);
      setErrors(data.errors);
    } catch (err) {
      console.error('Failed to load errors:', err);
      setError('Failed to load errors');
    } finally {
      setLoading(false);
    }
  }, [calculationNameFilter]);

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  const handleApplyFilters = () => {
    loadErrors();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleRowClick = (errorItem: CalculationError) => {
    if (selectedError?.id === errorItem.id) {
      setSelectedError(null);
    } else {
      setSelectedError(errorItem);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calculation Errors</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="calculation-name">Calculation Name</Label>
              <Input
                id="calculation-name"
                type="text"
                placeholder="Filter by calculation name..."
                value={calculationNameFilter}
                onChange={(e) => setCalculationNameFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleApplyFilters} variant="outline">
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Errors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Errors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div role="status" className="flex items-center gap-2 py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading errors...
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

          {!loading && !error && errors.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No calculation errors found - all calculations successful
            </div>
          )}

          {!loading && !error && errors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Calculation Name</th>
                    <th className="text-left py-3 px-4">Error Type</th>
                    <th className="text-left py-3 px-4">Error Message</th>
                    <th className="text-left py-3 px-4">Affected Record</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((errorItem) => (
                    <>
                      <tr
                        key={errorItem.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(errorItem)}
                      >
                        <td className="py-3 px-4">
                          {errorItem.calculationName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                            {errorItem.errorType}
                          </span>
                        </td>
                        <td className="py-3 px-4">{errorItem.errorMessage}</td>
                        <td className="py-3 px-4">
                          {errorItem.affectedRecord}
                        </td>
                        <td className="py-3 px-4">
                          {formatTimestamp(errorItem.timestamp)}
                        </td>
                      </tr>
                      {selectedError?.id === errorItem.id &&
                        errorItem.stackTrace && (
                          <tr key={`${errorItem.id}-stack`}>
                            <td colSpan={5} className="p-0">
                              <StackTraceDetails
                                stackTrace={errorItem.stackTrace}
                                context={errorItem.context}
                              />
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

// Stack trace details component
function StackTraceDetails({
  stackTrace,
  context,
}: {
  stackTrace: string;
  context?: Record<string, unknown>;
}) {
  return (
    <div className="bg-gray-50 p-4 border-t">
      <h4 className="text-sm font-medium mb-2">Stack Trace</h4>
      <pre className="p-3 bg-gray-900 text-green-400 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
        {stackTrace}
      </pre>
      {context && Object.keys(context).length > 0 && (
        <>
          <h4 className="text-sm font-medium mt-4 mb-2">Context</h4>
          <pre className="p-3 bg-gray-100 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(context, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

// Named export for testing
export { CalculationErrorsPage };
