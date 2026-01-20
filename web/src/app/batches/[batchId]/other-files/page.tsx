'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { FileSectionCard } from '@/components/FileSectionCard';
import { OtherFileErrorModal } from '@/components/OtherFileErrorModal';
import { useToast } from '@/contexts/ToastContext';
import {
  getBloombergFiles,
  getCustodianFiles,
  getAdditionalFiles,
  uploadOtherFile,
  cancelOtherFileImport,
} from '@/lib/api/other-files';
import {
  BLOOMBERG_FILE_LABELS,
  CUSTODIAN_FILE_LABELS,
  ADDITIONAL_FILE_LABELS,
  type OtherFile,
  type OtherFileType,
  type FileCategory,
} from '@/types/other-file';

export default function OtherFilesDashboard() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const batchId = params.batchId as string;

  // State for each section
  const [bloombergFiles, setBloombergFiles] = useState<OtherFile[]>([]);
  const [custodianFiles, setCustodianFiles] = useState<OtherFile[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<OtherFile[]>([]);

  // Loading states for each section
  const [bloombergLoading, setBloombergLoading] = useState(true);
  const [custodianLoading, setCustodianLoading] = useState(true);
  const [additionalLoading, setAdditionalLoading] = useState(true);

  // Error states for each section
  const [bloombergError, setBloombergError] = useState<string | null>(null);
  const [custodianError, setCustodianError] = useState<string | null>(null);
  const [additionalError, setAdditionalError] = useState<string | null>(null);

  // Modal states
  const [errorModalState, setErrorModalState] = useState<{
    isOpen: boolean;
    fileType: OtherFileType;
    category: FileCategory;
    fileName: string;
    fileTypeLabel: string;
  } | null>(null);

  const [proceedWarningState, setProceedWarningState] = useState<{
    isOpen: boolean;
    message: string;
  } | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    fileType: OtherFileType;
    category: FileCategory;
    isReimport: boolean;
  } | null>(null);

  // Load Bloomberg files
  const loadBloombergFiles = useCallback(async () => {
    setBloombergLoading(true);
    try {
      const response = await getBloombergFiles(batchId);
      setBloombergFiles(response.files);
      setBloombergError(null);
    } catch {
      setBloombergError(
        'Unable to load Bloomberg files. Please try again later.',
      );
    } finally {
      setBloombergLoading(false);
    }
  }, [batchId]);

  // Load Custodian files
  const loadCustodianFiles = useCallback(async () => {
    setCustodianLoading(true);
    try {
      const response = await getCustodianFiles(batchId);
      setCustodianFiles(response.files);
      setCustodianError(null);
    } catch {
      setCustodianError(
        'Unable to load Custodian files. Please try again later.',
      );
    } finally {
      setCustodianLoading(false);
    }
  }, [batchId]);

  // Load Additional files
  const loadAdditionalFiles = useCallback(async () => {
    setAdditionalLoading(true);
    try {
      const response = await getAdditionalFiles(batchId);
      setAdditionalFiles(response.files);
      setAdditionalError(null);
    } catch {
      setAdditionalError(
        'Unable to load Additional files. Please try again later.',
      );
    } finally {
      setAdditionalLoading(false);
    }
  }, [batchId]);

  // Initial load - all sections in parallel
  useEffect(() => {
    loadBloombergFiles();
    loadCustodianFiles();
    loadAdditionalFiles();
  }, [loadBloombergFiles, loadCustodianFiles, loadAdditionalFiles]);

  const isLoading = bloombergLoading || custodianLoading || additionalLoading;

  // Helper functions for validation
  const hasProcessingFiles = (): boolean => {
    const allFiles = [...bloombergFiles, ...custodianFiles, ...additionalFiles];
    return allFiles.some((f) => f.status === 'Processing');
  };

  const hasPendingBloomberg = (): boolean => {
    return bloombergFiles.every((f) => f.status === 'Pending');
  };

  const hasFailedCustodian = (): boolean => {
    return custodianFiles.some((f) => f.status === 'Failed');
  };

  // Upload handlers
  const handleUpload = (
    fileType: OtherFileType,
    category: FileCategory,
    isReimport: boolean,
  ) => {
    setUploadTarget({ fileType, category, isReimport });
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;

    try {
      await uploadOtherFile(
        batchId,
        uploadTarget.fileType,
        uploadTarget.category,
        file,
        { isReimport: uploadTarget.isReimport },
      );
      showToast({
        title: 'Upload Complete',
        message: 'File uploaded successfully',
        variant: 'success',
      });
      // Refresh the appropriate section
      if (uploadTarget.category === 'bloomberg') {
        loadBloombergFiles();
      } else if (uploadTarget.category === 'custodian') {
        loadCustodianFiles();
      } else {
        loadAdditionalFiles();
      }
    } catch (err) {
      showToast({
        title: 'Upload Failed',
        message: err instanceof Error ? err.message : 'Failed to upload file',
        variant: 'error',
      });
    } finally {
      setUploadTarget(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // View errors handler
  const handleViewErrors = (
    fileType: OtherFileType,
    category: FileCategory,
    fileName: string,
    fileTypeLabel: string,
  ) => {
    setErrorModalState({
      isOpen: true,
      fileType,
      category,
      fileName,
      fileTypeLabel,
    });
  };

  // Cancel handler
  const handleCancel = async (
    fileType: OtherFileType,
    category: FileCategory,
  ) => {
    try {
      await cancelOtherFileImport(batchId, fileType, category);
      showToast({
        title: 'Import Cancelled',
        message: 'File import has been cancelled',
        variant: 'info',
      });
      // Refresh the appropriate section
      if (category === 'bloomberg') {
        loadBloombergFiles();
      } else if (category === 'custodian') {
        loadCustodianFiles();
      } else {
        loadAdditionalFiles();
      }
    } catch (err) {
      showToast({
        title: 'Cancel Failed',
        message: err instanceof Error ? err.message : 'Failed to cancel import',
        variant: 'error',
      });
    }
  };

  // Proceed to Data Confirmation
  const handleProceedToDataConfirmation = () => {
    if (hasProcessingFiles()) {
      setProceedWarningState({
        isOpen: true,
        message:
          'Files are still processing. Proceeding will leave this page. Processing will continue in background.',
      });
      return;
    }

    if (hasPendingBloomberg()) {
      setProceedWarningState({
        isOpen: true,
        message:
          'Bloomberg files not uploaded. Data quality may be affected. Continue?',
      });
      return;
    }

    if (hasFailedCustodian()) {
      setProceedWarningState({
        isOpen: true,
        message:
          'Custodian reconciliation failed. Review errors before proceeding.',
      });
      return;
    }

    navigateToDataConfirmation();
  };

  const navigateToDataConfirmation = () => {
    router.push(`/batches/${batchId}/data-confirmation`);
  };

  // Get file labels for a category
  const getFileLabels = (category: FileCategory): Record<string, string> => {
    switch (category) {
      case 'bloomberg':
        return BLOOMBERG_FILE_LABELS;
      case 'custodian':
        return CUSTODIAN_FILE_LABELS;
      case 'additional':
        return ADDITIONAL_FILE_LABELS;
    }
  };

  // Show loading state with proper text
  if (bloombergLoading && custodianLoading && additionalLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <p className="text-muted-foreground">Loading Bloomberg files...</p>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Other Files Import Dashboard</h1>
          <p className="text-muted-foreground">Batch: {batchId}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/batches/${batchId}/portfolio-files`)}
        >
          ← Back to Portfolio Files
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleProceedToDataConfirmation}
                disabled={isLoading}
              >
                Proceed to Data Confirmation →
              </Button>
            </TooltipTrigger>
            <TooltipContent>Continue to data verification phase</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Bloomberg Files Section */}
      <FileSectionCard
        title="Bloomberg Files"
        files={bloombergFiles}
        fileLabels={getFileLabels('bloomberg')}
        isLoading={bloombergLoading}
        error={bloombergError}
        onUpload={(fileType) =>
          handleUpload(fileType as OtherFileType, 'bloomberg', false)
        }
        onReimport={(fileType) =>
          handleUpload(fileType as OtherFileType, 'bloomberg', true)
        }
        onViewErrors={(fileType, fileName) =>
          handleViewErrors(
            fileType as OtherFileType,
            'bloomberg',
            fileName,
            BLOOMBERG_FILE_LABELS[
              fileType as keyof typeof BLOOMBERG_FILE_LABELS
            ] || fileType,
          )
        }
        onCancel={(fileType) =>
          handleCancel(fileType as OtherFileType, 'bloomberg')
        }
      />

      {/* Custodian Files Section */}
      <FileSectionCard
        title="Custodian Files"
        files={custodianFiles}
        fileLabels={getFileLabels('custodian')}
        isLoading={custodianLoading}
        error={custodianError}
        onUpload={(fileType) =>
          handleUpload(fileType as OtherFileType, 'custodian', false)
        }
        onReimport={(fileType) =>
          handleUpload(fileType as OtherFileType, 'custodian', true)
        }
        onViewErrors={(fileType, fileName) =>
          handleViewErrors(
            fileType as OtherFileType,
            'custodian',
            fileName,
            CUSTODIAN_FILE_LABELS[
              fileType as keyof typeof CUSTODIAN_FILE_LABELS
            ] || fileType,
          )
        }
        onCancel={(fileType) =>
          handleCancel(fileType as OtherFileType, 'custodian')
        }
      />

      {/* Additional Data Files Section */}
      <FileSectionCard
        title="Additional Data Files"
        isOptional={true}
        files={additionalFiles}
        fileLabels={getFileLabels('additional')}
        isLoading={additionalLoading}
        error={additionalError}
        onUpload={(fileType) =>
          handleUpload(fileType as OtherFileType, 'additional', false)
        }
        onReimport={(fileType) =>
          handleUpload(fileType as OtherFileType, 'additional', true)
        }
        onViewErrors={(fileType, fileName) =>
          handleViewErrors(
            fileType as OtherFileType,
            'additional',
            fileName,
            ADDITIONAL_FILE_LABELS[
              fileType as keyof typeof ADDITIONAL_FILE_LABELS
            ] || fileType,
          )
        }
        onCancel={(fileType) =>
          handleCancel(fileType as OtherFileType, 'additional')
        }
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelected}
      />

      {/* Error modal */}
      {errorModalState && (
        <OtherFileErrorModal
          isOpen={errorModalState.isOpen}
          onClose={() => setErrorModalState(null)}
          batchId={batchId}
          fileType={errorModalState.fileType}
          category={errorModalState.category}
          fileName={errorModalState.fileName}
          fileTypeLabel={errorModalState.fileTypeLabel}
        />
      )}

      {/* Proceed warning dialog */}
      <Dialog
        open={proceedWarningState?.isOpen ?? false}
        onOpenChange={(open) => !open && setProceedWarningState(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>
              {proceedWarningState?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProceedWarningState(null)}
            >
              Cancel
            </Button>
            <Button onClick={navigateToDataConfirmation}>Proceed Anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Re-export for tests
export { OtherFilesDashboard };
