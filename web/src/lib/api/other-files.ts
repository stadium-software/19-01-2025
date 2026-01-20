/**
 * Other Files API Functions
 * API endpoints for Epic 3: Other Files Import Dashboard
 *
 * Uses the same Monthly Process API base URL as portfolio files.
 */

import { MONTHLY_PROCESS_API_URL } from '@/lib/utils/constants';
import type {
  BloombergFilesResponse,
  CustodianFilesResponse,
  AdditionalFilesResponse,
  OtherFileErrorsResponse,
  UploadOtherFileResponse,
  CancelOtherFileImportResponse,
  OtherFileType,
  FileCategory,
  ErrorSeverity,
} from '@/types/other-file';

/**
 * Custom API client for Monthly Process API
 * Uses the different base URL for monthly process endpoints
 */
async function monthlyProcessClient<T>(
  endpoint: string,
  config: {
    method?: string;
    params?: Record<string, string | number | boolean | undefined>;
    body?: BodyInit;
    lastChangedUser?: string;
    isBinaryResponse?: boolean;
    headers?: Record<string, string>;
  } = {},
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
 * Get Bloomberg files for a batch
 */
export async function getBloombergFiles(
  batchId: string,
): Promise<BloombergFilesResponse> {
  return monthlyProcessClient<BloombergFilesResponse>(
    `/report-batches/${batchId}/other-files`,
    {
      method: 'GET',
      params: {
        category: 'bloomberg',
      },
    },
  );
}

/**
 * Get Custodian files for a batch
 */
export async function getCustodianFiles(
  batchId: string,
): Promise<CustodianFilesResponse> {
  return monthlyProcessClient<CustodianFilesResponse>(
    `/report-batches/${batchId}/other-files`,
    {
      method: 'GET',
      params: {
        category: 'custodian',
      },
    },
  );
}

/**
 * Get Additional files for a batch
 */
export async function getAdditionalFiles(
  batchId: string,
): Promise<AdditionalFilesResponse> {
  return monthlyProcessClient<AdditionalFilesResponse>(
    `/report-batches/${batchId}/other-files`,
    {
      method: 'GET',
      params: {
        category: 'additional',
      },
    },
  );
}

/**
 * Get file errors for a specific other file
 */
export async function getOtherFileErrors(
  batchId: string,
  fileType: OtherFileType,
  category: FileCategory,
  options?: {
    page?: number;
    pageSize?: number;
    severity?: ErrorSeverity;
  },
): Promise<OtherFileErrorsResponse> {
  return monthlyProcessClient<OtherFileErrorsResponse>(
    `/report-batches/${batchId}/other-files/${fileType}/errors`,
    {
      method: 'GET',
      params: {
        category,
        page: options?.page,
        pageSize: options?.pageSize,
        severity: options?.severity,
      },
    },
  );
}

/**
 * Cancel an in-progress other file import
 */
export async function cancelOtherFileImport(
  batchId: string,
  fileType: OtherFileType,
  category: FileCategory,
  lastChangedUser?: string,
): Promise<CancelOtherFileImportResponse> {
  return monthlyProcessClient<CancelOtherFileImportResponse>(
    `/report-batches/${batchId}/other-files/${fileType}/cancel`,
    {
      method: 'POST',
      params: {
        category,
      },
      lastChangedUser,
    },
  );
}

/**
 * Upload an other file
 */
export async function uploadOtherFile(
  batchId: string,
  fileType: OtherFileType,
  category: FileCategory,
  file: File,
  options?: {
    isReimport?: boolean;
    lastChangedUser?: string;
  },
): Promise<UploadOtherFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.isReimport) {
    formData.append('isReimport', 'true');
  }

  const url = `${MONTHLY_PROCESS_API_URL}/report-batches/${batchId}/other-files/${fileType}?category=${category}`;

  const headers: Record<string, string> = {};
  if (options?.lastChangedUser) {
    headers['LastChangedUser'] = options.lastChangedUser;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.Messages?.[0] ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Export file errors to CSV
 */
export async function exportOtherFileErrors(
  batchId: string,
  fileType: OtherFileType,
  category: FileCategory,
  options?: {
    severity?: ErrorSeverity;
  },
): Promise<Blob> {
  return monthlyProcessClient<Blob>(
    `/report-batches/${batchId}/other-files/${fileType}/errors/export`,
    {
      method: 'GET',
      params: {
        category,
        severity: options?.severity,
        format: 'csv',
      },
      isBinaryResponse: true,
    },
  );
}
