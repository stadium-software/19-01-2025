'use client';

/**
 * Edit Index Price Page - Epic 5 Story 5.3
 *
 * Form for editing an existing index price with validation and audit trail.
 * Index Code and Date are read-only; only Price and Currency can be changed.
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getIndexPrice, updateIndexPrice } from '@/lib/api/index-prices';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IndexPrice } from '@/types/index-price';

interface FormErrors {
  price?: string;
  currency?: string;
}

export default function EditIndexPricePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  // Form state
  const [indexPrice, setIndexPrice] = useState<IndexPrice | null>(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Load existing index price
  useEffect(() => {
    const loadIndexPrice = async () => {
      try {
        const result = await getIndexPrice(id);
        setIndexPrice(result);
        setPrice(String(result.price));
        setCurrency(result.currency);
      } catch (err) {
        setApiError(
          err instanceof Error
            ? err.message
            : 'Failed to load index price. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };
    loadIndexPrice();
  }, [id]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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

    setSaving(true);

    try {
      await updateIndexPrice(
        id,
        {
          price: parseFloat(price),
          currency: currency.trim(),
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Price updated successfully',
        variant: 'success',
      });

      router.push('/index-prices');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update. Please try again.';

      if (
        errorMessage.toLowerCase().includes('concurrency') ||
        errorMessage.toLowerCase().includes('conflict')
      ) {
        setApiError(
          'Another user has updated this price. Please refresh and try again.',
        );
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/index-prices');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div
            role="progressbar"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <p className="mt-4 text-gray-600">Loading index price...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError && !indexPrice) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            {apiError}
          </div>
          <Button onClick={() => router.push('/index-prices')} className="mt-4">
            Back to Index Prices
          </Button>
        </div>
      </div>
    );
  }

  if (!indexPrice) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Index Price</h1>
        <p className="mt-1 text-sm text-gray-500">Update index price details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* Index Code (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="indexCode">Index Code</Label>
          <Input
            id="indexCode"
            type="text"
            value={indexPrice.indexCode}
            disabled
            aria-label="Index Code"
            className="bg-gray-100"
          />
        </div>

        {/* Date (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={indexPrice.date}
            disabled
            aria-label="Date"
            className="bg-gray-100"
          />
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
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
