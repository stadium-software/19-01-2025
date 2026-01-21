'use client';

/**
 * Add Duration Page - Epic 5 Story 5.8
 *
 * Form for adding a new instrument duration with validation and audit trail.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createDuration, getInstrumentsForDuration } from '@/lib/api/durations';
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

interface FormErrors {
  isin?: string;
  effectiveDate?: string;
  duration?: string;
  ytm?: string;
}

interface InstrumentOption {
  isin: string;
  name: string;
}

export default function AddDurationPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form state
  const [isin, setIsin] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [duration, setDuration] = useState('');
  const [ytm, setYtm] = useState('');
  const [instruments, setInstruments] = useState<InstrumentOption[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Load available instruments on mount
  useEffect(() => {
    const loadInstruments = async () => {
      try {
        const result = await getInstrumentsForDuration();
        setInstruments(result.instruments || []);
      } catch {
        // Silently handle error - user can type ISIN manually
      }
    };
    loadInstruments();
  }, []);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isin.trim()) {
      newErrors.isin = 'ISIN is required';
    }

    if (!effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }

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

    setLoading(true);

    try {
      await createDuration(
        {
          isin: isin.trim(),
          effectiveDate,
          duration: parseFloat(duration),
          ytm: parseFloat(ytm),
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Duration added successfully',
        variant: 'success',
      });

      router.push('/durations');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to add duration. Please try again.';

      if (errorMessage.toLowerCase().includes('already exists')) {
        setApiError('Duration already exists for this ISIN and date');
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/durations');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Duration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new instrument duration entry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* ISIN */}
        <div className="space-y-2">
          <Label htmlFor="isin">
            ISIN <span className="text-red-500">*</span>
          </Label>
          {instruments.length > 0 ? (
            <Select value={isin} onValueChange={setIsin} required>
              <SelectTrigger id="isin" aria-required="true">
                <SelectValue placeholder="Select instrument..." />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((inst) => (
                  <SelectItem key={inst.isin} value={inst.isin}>
                    {inst.isin} - {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="isin"
              type="text"
              value={isin}
              onChange={(e) => setIsin(e.target.value)}
              placeholder="Enter ISIN"
              required
              aria-required="true"
              aria-invalid={!!errors.isin}
            />
          )}
          {errors.isin && <p className="text-sm text-red-600">{errors.isin}</p>}
        </div>

        {/* Effective Date */}
        <div className="space-y-2">
          <Label htmlFor="effectiveDate">
            Effective Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="effectiveDate"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
            aria-required="true"
            aria-invalid={!!errors.effectiveDate}
          />
          {errors.effectiveDate && (
            <p className="text-sm text-red-600">{errors.effectiveDate}</p>
          )}
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
