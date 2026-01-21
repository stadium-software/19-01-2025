/**
 * Index Price Types
 * Types for Epic 5: Market Data Maintenance - Index Prices
 */

/**
 * Individual index price record
 */
export interface IndexPrice {
  id: string;
  indexCode: string;
  indexName: string;
  date: string;
  price: number;
  currency: string;
  previousPrice?: number;
  changePercent?: number;
  createdAt?: string;
  updatedAt?: string;
  lastChangedBy?: string;
}

/**
 * API response for index price list
 */
export interface IndexPriceListResponse {
  prices: IndexPrice[];
  totalCount: number;
  hasMore?: boolean;
}

/**
 * API request parameters for listing index prices
 */
export interface IndexPriceListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  indexCode?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Create/Update index price request
 */
export interface IndexPriceRequest {
  indexCode: string;
  date: string;
  price: number;
  currency: string;
}

/**
 * Index price history entry
 */
export interface IndexPriceHistoryEntry {
  id: string;
  indexCode: string;
  indexName: string;
  date: string;
  price: number;
  changePercent: number;
  user: string;
}

/**
 * API response for price history
 */
export interface IndexPriceHistoryResponse {
  history: IndexPriceHistoryEntry[];
  totalCount: number;
  hasMore?: boolean;
}

/**
 * Upload index prices file response
 */
export interface IndexPriceUploadResponse {
  success: boolean;
  message: string;
  addedCount?: number;
  updatedCount?: number;
  errorCount?: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

/**
 * Available indexes for dropdown
 */
export interface IndexListResponse {
  indexes: string[];
}

/**
 * Format price with decimal places
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format change percentage with sign
 */
export function formatChangePercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
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
