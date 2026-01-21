'use client';

/**
 * Instrument Detail Popup
 * Epic 4, Story 4.8: View Popup Details
 *
 * Displays detailed instrument information in a modal dialog.
 */

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Instrument } from '@/types/instrument';

interface InstrumentDetailPopupProps {
  instrument: Instrument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string | null;
}

export function InstrumentDetailPopup({
  instrument,
  open,
  onOpenChange,
  error,
}: InstrumentDetailPopupProps) {
  const router = useRouter();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewFullDetails = () => {
    if (instrument) {
      onOpenChange(false);
      router.push(`/instruments/${instrument.id}/edit`);
    }
  };

  // Handle error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            Failed to load details
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle no instrument
  if (!instrument) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Instrument Details</DialogTitle>
          </DialogHeader>
          <div className="text-gray-500 py-4">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{instrument.name}</span>
            <Badge
              variant={
                instrument.status === 'Complete' ? 'default' : 'destructive'
              }
            >
              {instrument.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>ISIN: {instrument.isin}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Asset Class</p>
              <p className="text-sm text-gray-900">{instrument.assetClass}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Currency</p>
              <p className="text-sm text-gray-900">{instrument.currency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Issuer</p>
              <p className="text-sm text-gray-900">
                {instrument.issuer || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Maturity Date</p>
              <p className="text-sm text-gray-900">
                {formatDate(instrument.maturityDate)}
              </p>
            </div>
          </div>

          {instrument.lastChangedBy && (
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Last modified by {instrument.lastChangedBy}
                {instrument.updatedAt &&
                  ` on ${formatDate(instrument.updatedAt)}`}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleViewFullDetails}>View Full Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
