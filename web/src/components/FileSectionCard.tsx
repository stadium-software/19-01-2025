'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileStatusBadge } from '@/components/FileStatusBadge';
import type { OtherFile } from '@/types/other-file';

interface FileSectionCardProps {
  title: string;
  isOptional?: boolean;
  files: OtherFile[];
  fileLabels: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  onUpload: (fileType: string) => void;
  onReimport: (fileType: string) => void;
  onViewErrors: (fileType: string, fileName: string) => void;
  onCancel: (fileType: string, fileName: string) => void;
}

function truncateFileName(fileName: string, maxLength = 30): string {
  if (fileName.length <= maxLength) return fileName;
  const ext = fileName.split('.').pop() || '';
  const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length - 4);
  return `${truncatedName}...${ext}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}

function formatUploader(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  }
  return name;
}

function allFilesSuccess(files: OtherFile[]): boolean {
  return files.length > 0 && files.every((f) => f.status === 'Success');
}

function getSectionStatusIcon(
  files: OtherFile[],
): { icon: string; ariaLabel: string } | null {
  if (allFilesSuccess(files)) {
    return { icon: '✓', ariaLabel: 'success' };
  }
  return null;
}

export function FileSectionCard({
  title,
  isOptional = false,
  files,
  fileLabels,
  isLoading,
  error,
  onUpload,
  onReimport,
  onViewErrors,
  onCancel,
}: FileSectionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sectionStatus = getSectionStatusIcon(files);

  const renderActions = (file: OtherFile) => {
    switch (file.status) {
      case 'Pending':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpload(file.fileType)}
          >
            Upload
          </Button>
        );
      case 'Success':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReimport(file.fileType)}
          >
            Re-import
          </Button>
        );
      case 'Warning':
      case 'Failed':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewErrors(file.fileType, file.fileName || '')}
            >
              View Errors
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReimport(file.fileType)}
            >
              Re-import
            </Button>
          </div>
        );
      case 'Processing':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel(file.fileType, file.fileName || '')}
          >
            Cancel
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Loading {title.toLowerCase()}...
          </p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-2">
            {sectionStatus && (
              <span
                role="img"
                aria-label={sectionStatus.ariaLabel}
                className="text-green-600"
              >
                {sectionStatus.icon}
              </span>
            )}
            {isOptional && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      role="img"
                      aria-label="info"
                      className="text-blue-500"
                    >
                      ℹ️
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>These files are optional</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CardTitle className="flex items-center gap-2">
              <h2>
                {title}
                {isOptional && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (Optional)
                  </span>
                )}
              </h2>
            </CardTitle>
            <span className="ml-auto text-muted-foreground">
              {isCollapsed ? '▶' : '▼'}
            </span>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">File Type</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.fileType}>
                    <TableCell className="font-medium">
                      {fileLabels[file.fileType] || file.fileType}
                    </TableCell>
                    <TableCell>
                      {file.fileName ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {truncateFileName(file.fileName)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{file.fileName}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {file.uploadedAt ? (
                        <span>
                          {formatDate(file.uploadedAt)}
                          {file.uploadedBy && (
                            <span className="text-muted-foreground">
                              {' '}
                              by {formatUploader(file.uploadedBy)}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <FileStatusBadge
                        status={file.status}
                        progress={file.progress}
                      />
                    </TableCell>
                    <TableCell>{renderActions(file)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
