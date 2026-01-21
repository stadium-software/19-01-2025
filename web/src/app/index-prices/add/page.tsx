'use client';

/**
 * Add Index Price Page - Epic 5 Story 5.2
 *
 * Form for adding a new index price with validation and audit trail.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createIndexPrice, getIndexList } from '@/lib/api/index-prices';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface FormErrors {
  indexCode?: string;
  date?: string;
  price?: string;
  currency?: string;
}

export default function AddIndexPricePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form state
  const [indexCode, setIndexCode] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [indexes, setIndexes] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Load available indexes on mount
  useEffect(() => {
    const loadIndexes = async () => {
      try {
        const result = await getIndexList();
        setIndexes(result.indexes || []);
      } catch {
        // Silently handle error - indexes can be typed manually
      }
    };
    loadIndexes();
  }, []);

  // Track form changes
  useEffect(() => {
    if (indexCode || date || price || currency) {
      setIsDirty(true);
    }
  }, [indexCode, date, price, currency]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!indexCode.trim()) {
      newErrors.indexCode = 'Index code is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (!price) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    if (!currency.trim()) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await createIndexPrice(
        {
          indexCode: indexCode.trim(),
          date,
          price: parseFloat(price),
          currency: currency.trim(),
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Price added successfully',
        variant: 'success',
      });

      router.push('/index-prices');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to add price. Please try again.';

      if (errorMessage.toLowerCase().includes('already exists')) {
        setApiError('Price already exists for this date');
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      router.push('/index-prices');
    }
  };

  // Confirm cancel
  const confirmCancel = () => {
    setShowConfirmDialog(false);
    router.push('/index-prices');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Index Price</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new index price entry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* Index Code */}
        <div className="space-y-2">
          <Label htmlFor="indexCode">
            Index Code <span className="text-red-500">*</span>
          </Label>
          {indexes.length > 0 ? (
            <Select value={indexCode} onValueChange={setIndexCode} required>
              <SelectTrigger id="indexCode" aria-required="true">
                <SelectValue placeholder="Select index..." />
              </SelectTrigger>
              <SelectContent>
                {indexes.map((idx) => (
                  <SelectItem key={idx} value={idx}>
                    {idx}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="indexCode"
              type="text"
              value={indexCode}
              onChange={(e) => setIndexCode(e.target.value)}
              placeholder="Enter index code (e.g., SPX)"
              required
              aria-required="true"
              aria-invalid={!!errors.indexCode}
            />
          )}
          {errors.indexCode && (
            <p className="text-sm text-red-600">{errors.indexCode}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            aria-required="true"
            aria-invalid={!!errors.date}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
            aria-required="true"
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">
            Currency <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="Enter currency (e.g., USD)"
            required
            aria-required="true"
            aria-invalid={!!errors.currency}
          />
          {errors.currency && (
            <p className="text-sm text-red-600">{errors.currency}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              Unsaved changes will be lost. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Stay
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
