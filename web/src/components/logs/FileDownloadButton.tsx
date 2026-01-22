'use client';

/**
 * File Download Button (Story 9.2)
 *
 * A button component for downloading processed files with progress indicator
 * and error handling.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadProcessedFile } from '@/lib/api/logs';

interface FileDownloadButtonProps {
  fileId: string;
  fileName: string;
  onDownloadComplete?: () => void;
}

export function FileDownloadButton({
  fileId,
  fileName,
  onDownloadComplete,
}: FileDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const blob = await downloadProcessedFile(fileId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onDownloadComplete?.();
    } catch (err) {
      console.error('Failed to download file:', err);
      // Show specific messages for known error types, generic message otherwise
      let errorMessage = 'Download failed. Please try again.';
      if (err instanceof Error) {
        if (
          err.message.includes('not found') ||
          err.message.includes('archived')
        ) {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={downloading}
        onClick={handleDownload}
      >
        {downloading ? 'Downloading...' : 'Download'}
      </Button>
      {downloading && (
        <div
          role="progressbar"
          aria-label="Downloading file"
          className="h-1 w-full bg-gray-200 rounded overflow-hidden"
        >
          <div className="h-full bg-primary animate-pulse w-2/3" />
        </div>
      )}
      {error && (
        <span className="text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
