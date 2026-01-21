'use client';

/**
 * Edit Beta Page - Epic 5 Story 5.12
 *
 * Form for editing an existing instrument beta with validation and audit trail.
 * ISIN, Benchmark, and Effective Date are read-only; only Beta value can be changed.
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBeta, updateBeta } from '@/lib/api/betas';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Beta } from '@/types/beta';

interface FormErrors {
  beta?: string;
}

export default function EditBetaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  // Form state
  const [betaData, setBetaData] = useState<Beta | null>(null);
  const [beta, setBeta] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Load existing beta
  useEffect(() => {
    const loadBeta = async () => {
      try {
        const result = await getBeta(id);
        setBetaData(result);
        setBeta(String(result.beta));
      } catch (err) {
        setApiError(
          err instanceof Error
            ? err.message
            : 'Failed to load beta. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };
    loadBeta();
  }, [id]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!beta) {
      newErrors.beta = 'Beta is required';
    } else {
      const betaNum = parseFloat(beta);
      if (isNaN(betaNum)) {
        newErrors.beta = 'Beta must be a valid number';
      } else if (betaNum < -3 || betaNum > 3) {
        newErrors.beta = 'Beta must be between -3 and 3';
      }
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
      await updateBeta(
        id,
        {
          beta: parseFloat(beta),
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Beta updated successfully',
        variant: 'success',
      });

      router.push('/betas');
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
          'Another user has updated this beta. Please refresh and try again.',
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
    router.push('/betas');
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
          <p className="mt-4 text-gray-600">Loading beta...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError && !betaData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            {apiError}
          </div>
          <Button onClick={() => router.push('/betas')} className="mt-4">
            Back to Betas
          </Button>
        </div>
      </div>
    );
  }

  if (!betaData) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Beta</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update instrument beta value
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* ISIN (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="isin">ISIN</Label>
          <Input
            id="isin"
            type="text"
            value={betaData.isin}
            disabled
            aria-label="ISIN"
            className="bg-gray-100"
          />
        </div>

        {/* Benchmark (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="benchmark">Benchmark</Label>
          <Input
            id="benchmark"
            type="text"
            value={betaData.benchmark}
            disabled
            aria-label="Benchmark"
            className="bg-gray-100"
          />
        </div>

        {/* Effective Date (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Effective Date</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={betaData.effectiveDate}
            disabled
            aria-label="Effective Date"
            className="bg-gray-100"
          />
        </div>

        {/* Beta */}
        <div className="space-y-2">
          <Label htmlFor="beta">
            Beta <span className="text-red-500">*</span>
          </Label>
          <Input
            id="beta"
            type="number"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(e.target.value)}
            placeholder="Enter beta value (-3 to 3)"
            required
            aria-required="true"
            aria-invalid={!!errors.beta}
          />
          {errors.beta && <p className="text-sm text-red-600">{errors.beta}</p>}
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
