/**
 * Other File Types
 * Types for Epic 3: Other Files Import Dashboard
 */

import type {
  FileStatus,
  FileError,
  ErrorSummary,
  ErrorSeverity,
} from './portfolio-file';

// Re-export common types for convenience
export type { FileStatus, FileError, ErrorSummary, ErrorSeverity };

/**
 * Bloomberg file type categories
 */
export type BloombergFileType =
  | 'SecurityMaster'
  | 'Prices'
  | 'CreditRatings'
  | 'Analytics';

/**
 * Custodian file type categories
 */
export type CustodianFileType =
  | 'HoldingsReconciliation'
  | 'TransactionReconciliation'
  | 'CashReconciliation';

/**
 * Additional data file type categories
 */
export type AdditionalFileType =
  | 'FXRates'
  | 'CustomBenchmarks'
  | 'MarketCommentary';

/**
 * All other file types combined
 */
export type OtherFileType =
  | BloombergFileType
  | CustodianFileType
  | AdditionalFileType;

/**
 * File category
 */
export type FileCategory = 'bloomberg' | 'custodian' | 'additional';

/**
 * Human-readable labels for Bloomberg file types
 */
export const BLOOMBERG_FILE_LABELS: Record<BloombergFileType, string> = {
  SecurityMaster: 'Security Master',
  Prices: 'Prices',
  CreditRatings: 'Credit Ratings',
  Analytics: 'Analytics',
};

/**
 * Human-readable labels for Custodian file types
 */
export const CUSTODIAN_FILE_LABELS: Record<CustodianFileType, string> = {
  HoldingsReconciliation: 'Holdings Reconciliation',
  TransactionReconciliation: 'Transaction Reconciliation',
  CashReconciliation: 'Cash Reconciliation',
};

/**
 * Human-readable labels for Additional file types
 */
export const ADDITIONAL_FILE_LABELS: Record<AdditionalFileType, string> = {
  FXRates: 'FX Rates',
  CustomBenchmarks: 'Custom Benchmarks',
  MarketCommentary: 'Market Commentary',
};

/**
 * Individual other file information
 */
export interface OtherFile {
  fileType: OtherFileType;
  status: FileStatus;
  fileName?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  errorCount?: number;
  progress?: number;
}

/**
 * API response for Bloomberg files
 */
export interface BloombergFilesResponse {
  files: OtherFile[];
}

/**
 * API response for Custodian files
 */
export interface CustodianFilesResponse {
  files: OtherFile[];
}

/**
 * API response for Additional files
 */
export interface AdditionalFilesResponse {
  files: OtherFile[];
}

/**
 * API response for file errors (reuses portfolio file types)
 */
export interface OtherFileErrorsResponse {
  summary: ErrorSummary;
  errors: FileError[];
  hasMore: boolean;
}

/**
 * Upload other file response
 */
export interface UploadOtherFileResponse {
  success: boolean;
  message: string;
  fileId?: string;
  status: FileStatus;
}

/**
 * Cancel import response
 */
export interface CancelOtherFileImportResponse {
  success: boolean;
  message: string;
  fileStatus: FileStatus;
}
