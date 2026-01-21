/**
 * Instrument Beta Types
 * Types for Epic 5: Market Data Maintenance - Betas
 */

/**
 * Individual instrument beta record
 */
export interface Beta {
  id: string;
  isin: string;
  instrumentName: string;
  beta: number;
  benchmark: string;
  effectiveDate: string;
  createdAt?: string;
  updatedAt?: string;
  lastChangedBy?: string;
}

/**
 * API response for beta list
 */
export interface BetaListResponse {
  betas: Beta[];
  totalCount: number;
  missingCount: number;
  hasMore?: boolean;
}

/**
 * API request parameters for listing betas
 */
export interface BetaListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isin?: string;
  benchmark?: string;
}

/**
 * Create/Update beta request
 */
export interface BetaRequest {
  isin: string;
  benchmark: string;
  beta: number;
  effectiveDate: string;
}

/**
 * Available benchmarks for dropdown
 */
export interface BenchmarkListResponse {
  benchmarks: string[];
}

/**
 * Format beta value with decimal precision
 */
export function formatBeta(beta: number): string {
  return beta.toFixed(2);
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

/**
 * Validate beta is within typical range (-3 to 3)
 */
export function validateBetaRange(beta: number): boolean {
  return beta >= -3 && beta <= 3;
}
