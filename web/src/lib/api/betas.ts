/**
 * Instrument Betas API Functions
 * API endpoints for Epic 5: Market Data Maintenance - Betas
 *
 * Uses the centralized API client for consistent error handling,
 * logging, and audit trail support.
 */

import { get, post, put, apiClient } from './client';
import type {
  BetaListResponse,
  BetaListParams,
  Beta,
  BetaRequest,
  BenchmarkListResponse,
} from '@/types/beta';

const BASE_PATH = '/v1/instrument-betas';

/**
 * Get list of instrument betas with optional filtering, sorting, and pagination
 */
export async function getBetas(
  params?: BetaListParams,
): Promise<BetaListResponse> {
  return get<BetaListResponse>(BASE_PATH, {
    page: params?.page,
    pageSize: params?.pageSize,
    search: params?.search,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
    isin: params?.isin,
    benchmark: params?.benchmark,
  });
}

/**
 * Get a single beta by ID
 */
export async function getBeta(id: string): Promise<Beta> {
  return get<Beta>(`${BASE_PATH}/${id}`);
}

/**
 * Create a new instrument beta
 */
export async function createBeta(
  data: BetaRequest,
  lastChangedUser?: string,
): Promise<Beta> {
  return post<Beta>(BASE_PATH, data, lastChangedUser);
}

/**
 * Update an existing instrument beta
 */
export async function updateBeta(
  id: string,
  data: Partial<BetaRequest>,
  lastChangedUser?: string,
): Promise<Beta> {
  return put<Beta>(`${BASE_PATH}/${id}`, data, lastChangedUser);
}

/**
 * Export betas to Excel
 */
export async function exportBetas(params?: BetaListParams): Promise<Blob> {
  return apiClient<Blob>(`${BASE_PATH}/export`, {
    method: 'GET',
    params: {
      search: params?.search,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      isin: params?.isin,
      benchmark: params?.benchmark,
      format: 'excel',
    },
    isBinaryResponse: true,
  });
}

/**
 * Get list of instruments for ISIN dropdown
 */
export async function getInstrumentsForBeta(): Promise<{
  instruments: Array<{ isin: string; name: string }>;
}> {
  return get<{ instruments: Array<{ isin: string; name: string }> }>(
    '/v1/instruments/lookup',
  );
}

/**
 * Get list of available benchmarks for dropdown
 */
export async function getBenchmarks(): Promise<BenchmarkListResponse> {
  return get<BenchmarkListResponse>('/v1/benchmarks');
}
