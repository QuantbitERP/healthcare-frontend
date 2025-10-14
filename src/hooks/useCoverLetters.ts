import { useState, useEffect } from 'react';
import { CoverLetterItem } from '@/sections/invoicing/tableData';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';

export interface UseCoverLettersReturn {
  coverLetters: CoverLetterItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoverLetters = (): UseCoverLettersReturn => {
  const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetters = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await InvoicingApiService.getCoverLetters();
      setCoverLetters(result.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cover letters';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCoverLetters();
  };

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  return {
    coverLetters,
    loading,
    error,
    refetch,
  };
};
