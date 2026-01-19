/**
 * Report Batches API Functions
 * API endpoints for Epic 1: Start Page & Report Batch Management
 *
 * Uses the centralized API client for consistent error handling,
 * logging, and audit trail support.
 */

import { apiClient } from './client';
import { MONTHLY_PROCESS_API_URL } from '@/lib/utils/constants';
import type {
  ReportBatch,
  ReportBatchListResponse,
  CreateBatchRequest,
  CreateBatchResponse,
} from '@/types/report-batch';

/**
 * Custom API client for Monthly Process API
 * Uses the different base URL for monthly process endpoints
 */
async function monthlyProcessClient<T>(
  endpoint: string,
  config: Parameters<typeof apiClient>[1] = {},
): Promise<T> {
  const url = `${MONTHLY_PROCESS_API_URL}${endpoint}`;

  const { params, lastChangedUser, isBinaryResponse, ...fetchConfig } = config;

  // Build query string
  let fullUrl = url;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      fullUrl = `${url}?${queryString}`;
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchConfig.headers as Record<string, string>),
  };

  if (lastChangedUser) {
    headers['LastChangedUser'] = lastChangedUser;
  }

  const response = await fetch(fullUrl, {
    ...fetchConfig,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.Messages?.[0] ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  if (isBinaryResponse) {
    return (await response.blob()) as T;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Fetch report batches with pagination and search
 */
export async function getReportBatches(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ReportBatchListResponse> {
  const { page = 1, pageSize = 10, search } = params;

  return monthlyProcessClient<ReportBatchListResponse>('/report-batches', {
    method: 'GET',
    params: {
      page,
      pageSize,
      ...(search && { search }),
    },
  });
}

/**
 * Create a new report batch
 */
export async function createReportBatch(
  data: CreateBatchRequest,
  lastChangedUser?: string,
): Promise<CreateBatchResponse> {
  return monthlyProcessClient<CreateBatchResponse>('/monthly-report-batch', {
    method: 'POST',
    body: JSON.stringify(data),
    lastChangedUser,
  });
}

/**
 * Get a single report batch by ID
 */
export async function getReportBatch(batchId: string): Promise<ReportBatch> {
  return monthlyProcessClient<ReportBatch>(`/report-batches/${batchId}`, {
    method: 'GET',
  });
}

/**
 * Export report batches to CSV
 */
export async function exportReportBatches(params: {
  includeFiltered?: boolean;
  search?: string;
}): Promise<Blob> {
  const { includeFiltered = false, search } = params;

  return monthlyProcessClient<Blob>('/report-batches/export', {
    method: 'GET',
    params: {
      includeFiltered,
      ...(search && { search }),
    },
    isBinaryResponse: true,
  });
}
