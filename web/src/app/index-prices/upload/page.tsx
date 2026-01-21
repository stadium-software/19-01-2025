'use client';

/**
 * Upload Index Prices Page - Epic 5 Story 5.4
 *
 * File upload interface for bulk importing index prices from CSV/Excel files.
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadIndexPricesFile } from '@/lib/api/index-prices';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import type { IndexPriceUploadResponse } from '@/types/index-price';

const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
];

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

export default function IndexPriceUploadPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] =
    useState<IndexPriceUploadResponse | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Validate file type
  const validateFile = (file: File): boolean => {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const isValidExtension = ACCEPTED_EXTENSIONS.includes(extension);
    const isValidType =
      ACCEPTED_FILE_TYPES.includes(file.type) ||
      file.type === '' || // Some browsers don't set type for CSV
      extension === '.csv';

    if (!isValidExtension || !isValidType) {
      setFileError(
        'Invalid file format. Please upload .xlsx, .xls, or .csv files.',
      );
      return false;
    }

    setFileError(null);
    return true;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        setSelectedFile(null);
      }
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadIndexPricesFile(
        selectedFile,
        'currentUser', // TODO: Get actual username from auth context
      );

      setUploadResult(result);

      if (result.success) {
        showToast({
          title: 'Success',
          message: `${result.addedCount || 0} prices added, ${result.updatedCount || 0} updated`,
          variant: 'success',
        });
      }
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof Error
            ? err.message
            : 'Upload failed. Please try again.',
        variant: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  // Navigate to view prices
  const handleViewPrices = () => {
    router.push('/index-prices');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Upload Index Prices
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Import index prices from a file
        </p>
      </div>

      <div className="space-y-6">
        {/* File Format Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">
            Expected File Format
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            Your file should contain the following columns:
          </p>
          <ul className="text-sm text-blue-800 list-disc list-inside">
            <li>
              <strong>IndexCode</strong> - The index identifier (e.g., SPX)
            </li>
            <li>
              <strong>Date</strong> - Price date (YYYY-MM-DD format)
            </li>
            <li>
              <strong>Price</strong> - The price value
            </li>
            <li>
              <strong>Currency</strong> - Currency code (e.g., USD)
            </li>
          </ul>
        </div>

        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="fileInput">Select File</Label>
          <div className="flex gap-2">
            <Input
              id="fileInput"
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="flex-1"
              aria-label="Select file"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          {fileError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {fileError}
            </p>
          )}
        </div>

        {/* Selected File Display */}
        {selectedFile && !fileError && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !fileError && !uploadResult && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div
                  role="progressbar"
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div
            className={`p-4 rounded-md ${
              uploadResult.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    uploadResult.success ? 'text-green-900' : 'text-yellow-900'
                  }`}
                >
                  {uploadResult.message}
                </h3>

                <div className="mt-2 text-sm space-y-1">
                  {(uploadResult.addedCount ?? 0) > 0 && (
                    <p>{uploadResult.addedCount} prices added</p>
                  )}
                  {(uploadResult.updatedCount ?? 0) > 0 && (
                    <p>{uploadResult.updatedCount} prices updated</p>
                  )}
                  {(uploadResult.errorCount ?? 0) > 0 && (
                    <p className="text-red-600">
                      {uploadResult.errorCount} errors found
                    </p>
                  )}
                </div>

                {/* Error Details */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-red-900 mb-2">
                      Error Details:
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>
                          <strong>Row {error.row}</strong>: {error.field} -{' '}
                          {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* View Prices Button */}
            {uploadResult.success && (
              <div className="mt-4">
                <Button variant="outline" onClick={handleViewPrices}>
                  View Prices
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Cancel / Back Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => router.push('/index-prices')}
          >
            {uploadResult ? 'Back to Index Prices' : 'Cancel'}
          </Button>
        </div>
      </div>
    </div>
  );
}
