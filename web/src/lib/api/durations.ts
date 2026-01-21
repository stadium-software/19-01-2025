/**
 * Instrument Durations API Functions
 * API endpoints for Epic 5: Market Data Maintenance - Durations
 *
 * Uses the centralized API client for consistent error handling,
 * logging, and audit trail support.
 */

import { get, post, put, apiClient } from './client';
import type {
  DurationListResponse,
  DurationListParams,
  Duration,
  DurationRequest,
} from '@/types/duration';

const BASE_PATH = '/v1/instrument-durations';

/**
 * Get list of instrument durations with optional filtering, sorting, and pagination
 */
export async function getDurations(
  params?: DurationListParams,
): Promise<DurationListResponse> {
  return get<DurationListResponse>(BASE_PATH, {
    page: params?.page,
    pageSize: params?.pageSize,
    search: params?.search,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
    isin: params?.isin,
    startDate: params?.startDate,
    endDate: params?.endDate,
  });
}

/**
 * Get a single duration by ID
 */
export async function getDuration(id: string): Promise<Duration> {
  return get<Duration>(`${BASE_PATH}/${id}`);
}

/**
 * Create a new instrument duration
 */
export async function createDuration(
  data: DurationRequest,
  lastChangedUser?: string,
): Promise<Duration> {
  return post<Duration>(BASE_PATH, data, lastChangedUser);
}

/**
 * Update an existing instrument duration
 */
export async function updateDuration(
  id: string,
  data: Partial<DurationRequest>,
  lastChangedUser?: string,
): Promise<Duration> {
  return put<Duration>(`${BASE_PATH}/${id}`, data, lastChangedUser);
}

/**
 * Export durations to Excel
 */
export async function exportDurations(
  params?: DurationListParams,
): Promise<Blob> {
  return apiClient<Blob>(`${BASE_PATH}/export`, {
    method: 'GET',
    params: {
      search: params?.search,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      isin: params?.isin,
      startDate: params?.startDate,
      endDate: params?.endDate,
      format: 'excel',
    },
    isBinaryResponse: true,
  });
}

/**
 * Get list of instruments for ISIN dropdown
 */
export async function getInstrumentsForDuration(): Promise<{
  instruments: Array<{ isin: string; name: string }>;
}> {
  return get<{ instruments: Array<{ isin: string; name: string }> }>(
    '/v1/instruments/lookup',
  );
}
