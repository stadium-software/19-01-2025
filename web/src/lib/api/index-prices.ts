/**
 * Index Prices API Functions
 * API endpoints for Epic 5: Market Data Maintenance - Index Prices
 *
 * Uses the centralized API client for consistent error handling,
 * logging, and audit trail support.
 */

import { get, post, put, apiClient } from './client';
import type {
  IndexPriceListResponse,
  IndexPriceListParams,
  IndexPrice,
  IndexPriceRequest,
  IndexPriceHistoryResponse,
  IndexPriceUploadResponse,
  IndexListResponse,
} from '@/types/index-price';

const BASE_PATH = '/v1/index-prices';

/**
 * Get list of index prices with optional filtering, sorting, and pagination
 */
export async function getIndexPrices(
  params?: IndexPriceListParams,
): Promise<IndexPriceListResponse> {
  return get<IndexPriceListResponse>(BASE_PATH, {
    page: params?.page,
    pageSize: params?.pageSize,
    search: params?.search,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
    indexCode: params?.indexCode,
    startDate: params?.startDate,
    endDate: params?.endDate,
  });
}

/**
 * Get a single index price by ID
 */
export async function getIndexPrice(id: string): Promise<IndexPrice> {
  return get<IndexPrice>(`${BASE_PATH}/${id}`);
}

/**
 * Create a new index price
 */
export async function createIndexPrice(
  data: IndexPriceRequest,
  lastChangedUser?: string,
): Promise<IndexPrice> {
  return post<IndexPrice>(BASE_PATH, data, lastChangedUser);
}

/**
 * Update an existing index price
 */
export async function updateIndexPrice(
  id: string,
  data: Partial<IndexPriceRequest>,
  lastChangedUser?: string,
): Promise<IndexPrice> {
  return put<IndexPrice>(`${BASE_PATH}/${id}`, data, lastChangedUser);
}

/**
 * Get price history for an index
 */
export async function getIndexPriceHistory(
  indexCode: string,
  params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  },
): Promise<IndexPriceHistoryResponse> {
  return get<IndexPriceHistoryResponse>(`${BASE_PATH}/${indexCode}/history`, {
    page: params?.page,
    pageSize: params?.pageSize,
    startDate: params?.startDate,
    endDate: params?.endDate,
  });
}

/**
 * Upload index prices from file (CSV/Excel)
 */
export async function uploadIndexPricesFile(
  file: File,
  lastChangedUser?: string,
): Promise<IndexPriceUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (lastChangedUser) {
    headers['LastChangedUser'] = lastChangedUser;
  }

  return apiClient<IndexPriceUploadResponse>(`${BASE_PATH}/upload`, {
    method: 'POST',
    body: formData,
    headers,
  });
}

/**
 * Export index prices to Excel
 */
export async function exportIndexPrices(
  params?: IndexPriceListParams,
): Promise<Blob> {
  return apiClient<Blob>(`${BASE_PATH}/export`, {
    method: 'GET',
    params: {
      search: params?.search,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      indexCode: params?.indexCode,
      startDate: params?.startDate,
      endDate: params?.endDate,
      format: 'excel',
    },
    isBinaryResponse: true,
  });
}

/**
 * Export price history to Excel
 */
export async function exportIndexPriceHistory(
  indexCode: string,
  params?: { startDate?: string; endDate?: string },
): Promise<Blob> {
  return apiClient<Blob>(`${BASE_PATH}/${indexCode}/history/export`, {
    method: 'GET',
    params: {
      startDate: params?.startDate,
      endDate: params?.endDate,
      format: 'excel',
    },
    isBinaryResponse: true,
  });
}

/**
 * Get list of available indexes for dropdown
 */
export async function getIndexList(): Promise<IndexListResponse> {
  return get<IndexListResponse>('/v1/indexes');
}
