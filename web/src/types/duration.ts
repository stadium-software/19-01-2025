/**
 * Instrument Duration Types
 * Types for Epic 5: Market Data Maintenance - Durations
 */

/**
 * Individual instrument duration record
 */
export interface Duration {
  id: string;
  isin: string;
  instrumentName: string;
  duration: number;
  ytm: number;
  effectiveDate: string;
  createdAt?: string;
  updatedAt?: string;
  lastChangedBy?: string;
}

/**
 * API response for duration list
 */
export interface DurationListResponse {
  durations: Duration[];
  totalCount: number;
  missingCount: number;
  hasMore?: boolean;
}

/**
 * API request parameters for listing durations
 */
export interface DurationListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isin?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Create/Update duration request
 */
export interface DurationRequest {
  isin: string;
  effectiveDate: string;
  duration: number;
  ytm: number;
}

/**
 * Format duration with decimal places
 */
export function formatDuration(duration: number): string {
  return duration.toFixed(2);
}

/**
 * Format YTM percentage
 */
export function formatYtm(ytm: number): string {
  return ytm.toFixed(2);
}

/**
 * Format date to MM/DD/YY
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}
