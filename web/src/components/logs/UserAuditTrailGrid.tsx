'use client';

/**
 * User Audit Trail Grid Component (Story 9.6)
 *
 * Displays a grid of user actions with filtering by user and entity.
 * Can fetch data internally or receive data via props.
 */

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getUserAuditTrail } from '@/lib/api/logs';
import type { UserAuditEntry } from '@/types/logs';

interface UserAuditTrailGridProps {
  batchDate: string;
  entries?: UserAuditEntry[];
  loading?: boolean;
  error?: string | null;
}

export function UserAuditTrailGrid({
  batchDate,
  entries: externalEntries,
  loading: externalLoading,
  error: externalError,
}: UserAuditTrailGridProps) {
  // Internal state for self-contained mode
  const [internalEntries, setInternalEntries] = useState<UserAuditEntry[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // Filter state
  const [userFilter, setUserFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  // Determine which state to use
  const isControlled = externalEntries !== undefined;
  const entries = isControlled ? externalEntries : internalEntries;
  const loading = isControlled ? (externalLoading ?? false) : internalLoading;
  const error = isControlled ? (externalError ?? null) : internalError;

  // Internal fetch function
  const loadAuditTrail = useCallback(async () => {
    if (isControlled) return;

    try {
      setInternalLoading(true);
      setInternalError(null);
      const params: { batchDate?: string; user?: string; search?: string } = {
        batchDate,
      };
      if (userFilter) params.user = userFilter;
      if (entityFilter) params.search = entityFilter;

      const data = await getUserAuditTrail(params);
      setInternalEntries(data.entries);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
      setInternalError('Failed to load audit trail');
    } finally {
      setInternalLoading(false);
    }
  }, [batchDate, userFilter, entityFilter, isControlled]);

  // Load data when not controlled
  useEffect(() => {
    if (!isControlled && batchDate) {
      loadAuditTrail();
    }
  }, [isControlled, batchDate, loadAuditTrail]);

  const handleApplyFilters = () => {
    if (!isControlled) {
      loadAuditTrail();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'APPROVE':
        return 'bg-green-100 text-green-700';
      case 'REJECT':
        return 'bg-red-100 text-red-700';
      case 'CREATE':
        return 'bg-blue-100 text-blue-700';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      case 'EXPORT':
        return 'bg-purple-100 text-purple-700';
      case 'VIEW':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters - show when self-contained */}
      {!isControlled && (
        <div className="flex gap-4 items-end">
          <div>
            <Label htmlFor="user-filter">Filter by user</Label>
            <Input
              id="user-filter"
              type="text"
              placeholder="Filter by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="entity-filter">Search by entity</Label>
            <Input
              id="entity-filter"
              type="text"
              placeholder="Search by entity..."
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleApplyFilters} variant="outline">
            Apply
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div role="status" className="flex items-center gap-2 py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading audit trail...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No user actions recorded
        </div>
      )}

      {/* Data table */}
      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Entity</th>
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{entry.user}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getActionBadgeClass(entry.action)}`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">{entry.entity}</td>
                  <td className="py-3 px-4">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="py-3 px-4">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
