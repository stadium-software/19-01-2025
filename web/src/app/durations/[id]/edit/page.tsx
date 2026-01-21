'use client';

/**
 * Edit Duration Page - Epic 5 Story 5.9
 *
 * Form for editing an existing instrument duration with validation and audit trail.
 * ISIN and Effective Date are read-only; only Duration and YTM can be changed.
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getDuration, updateDuration } from '@/lib/api/durations';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Duration } from '@/types/duration';

interface FormErrors {
  duration?: string;
  ytm?: string;
}

export default function EditDurationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  // Form state
  const [durationData, setDurationData] = useState<Duration | null>(null);
  const [duration, setDuration] = useState('');
  const [ytm, setYtm] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Load existing duration
  useEffect(() => {
    const loadDuration = async () => {
      try {
        const result = await getDuration(id);
        setDurationData(result);
        setDuration(String(result.duration));
        setYtm(String(result.ytm));
      } catch (err) {
        setApiError(
          err instanceof Error
            ? err.message
            : 'Failed to load duration. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };
    loadDuration();
  }, [id]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!duration) {
      newErrors.duration = 'Duration is required';
    } else {
      const durationNum = parseFloat(duration);
      if (isNaN(durationNum) || durationNum < 0) {
        newErrors.duration = 'Duration must be a positive number';
      }
    }

    if (!ytm) {
      newErrors.ytm = 'YTM is required';
    } else {
      const ytmNum = parseFloat(ytm);
      if (isNaN(ytmNum)) {
        newErrors.ytm = 'YTM must be a valid number';
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
      await updateDuration(
        id,
        {
          duration: parseFloat(duration),
          ytm: parseFloat(ytm),
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Duration updated successfully',
        variant: 'success',
      });

      router.push('/durations');
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
          'Another user has updated this duration. Please refresh and try again.',
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
    router.push('/durations');
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
          <p className="mt-4 text-gray-600">Loading duration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError && !durationData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div role="alert" className="text-red-600">
            {apiError}
          </div>
          <Button onClick={() => router.push('/durations')} className="mt-4">
            Back to Durations
          </Button>
        </div>
      </div>
    );
  }

  if (!durationData) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Duration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update instrument duration details
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
            value={durationData.isin}
            disabled
            aria-label="ISIN"
            className="bg-gray-100"
          />
        </div>

        {/* Effective Date (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Effective Date</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={durationData.effectiveDate}
            disabled
            aria-label="Effective Date"
            className="bg-gray-100"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">
            Duration <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            type="number"
            step="0.01"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration"
            required
            aria-required="true"
            aria-invalid={!!errors.duration}
          />
          {errors.duration && (
            <p className="text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        {/* YTM */}
        <div className="space-y-2">
          <Label htmlFor="ytm">
            YTM (%) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ytm"
            type="number"
            step="0.01"
            value={ytm}
            onChange={(e) => setYtm(e.target.value)}
            placeholder="Enter yield to maturity"
            required
            aria-required="true"
            aria-invalid={!!errors.ytm}
          />
          {errors.ytm && <p className="text-sm text-red-600">{errors.ytm}</p>}
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
