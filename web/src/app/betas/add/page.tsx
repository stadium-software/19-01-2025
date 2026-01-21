'use client';

/**
 * Add Beta Page - Epic 5 Story 5.11
 *
 * Form for adding a new instrument beta with validation and audit trail.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createBeta,
  getInstrumentsForBeta,
  getBenchmarks,
} from '@/lib/api/betas';
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
  benchmark?: string;
  beta?: string;
  effectiveDate?: string;
}

interface InstrumentOption {
  isin: string;
  name: string;
}

export default function AddBetaPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form state
  const [isin, setIsin] = useState('');
  const [benchmark, setBenchmark] = useState('');
  const [beta, setBeta] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [instruments, setInstruments] = useState<InstrumentOption[]>([]);
  const [benchmarks, setBenchmarks] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Load available instruments and benchmarks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [instrumentsResult, benchmarksResult] = await Promise.all([
          getInstrumentsForBeta(),
          getBenchmarks(),
        ]);
        setInstruments(instrumentsResult.instruments || []);
        setBenchmarks(benchmarksResult.benchmarks || []);
      } catch {
        // Silently handle error - user can type values manually
      }
    };
    loadData();
  }, []);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isin.trim()) {
      newErrors.isin = 'ISIN is required';
    }

    if (!benchmark.trim()) {
      newErrors.benchmark = 'Benchmark is required';
    }

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

    if (!effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
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
      await createBeta(
        {
          isin: isin.trim(),
          benchmark: benchmark.trim(),
          beta: parseFloat(beta),
          effectiveDate,
        },
        'currentUser', // TODO: Get actual username from auth context
      );

      showToast({
        title: 'Success',
        message: 'Beta added successfully',
        variant: 'success',
      });

      router.push('/betas');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to add beta. Please try again.';

      if (errorMessage.toLowerCase().includes('already exists')) {
        setApiError('Beta already exists for this ISIN, benchmark, and date');
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/betas');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Beta</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new instrument beta entry
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

        {/* Benchmark */}
        <div className="space-y-2">
          <Label htmlFor="benchmark">
            Benchmark <span className="text-red-500">*</span>
          </Label>
          {benchmarks.length > 0 ? (
            <Select value={benchmark} onValueChange={setBenchmark} required>
              <SelectTrigger id="benchmark" aria-required="true">
                <SelectValue placeholder="Select benchmark..." />
              </SelectTrigger>
              <SelectContent>
                {benchmarks.map((bm) => (
                  <SelectItem key={bm} value={bm}>
                    {bm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="benchmark"
              type="text"
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
              placeholder="Enter benchmark (e.g., S&P 500)"
              required
              aria-required="true"
              aria-invalid={!!errors.benchmark}
            />
          )}
          {errors.benchmark && (
            <p className="text-sm text-red-600">{errors.benchmark}</p>
          )}
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
