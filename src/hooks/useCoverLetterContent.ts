import { useState, useEffect, useCallback } from 'react';
import { CoverLetterContent } from '@/sections/invoicing/tableData';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';

export interface UseCoverLetterContentReturn {
  coverLetterContent: CoverLetterContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoverLetterContent = (coverLetterId: string | null): UseCoverLetterContentReturn => {
  const [coverLetterContent, setCoverLetterContent] = useState<CoverLetterContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetterContent = useCallback(async () => {
    if (!coverLetterId) {
      setCoverLetterContent(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await InvoicingApiService.getCoverLetterContent(coverLetterId);
      setCoverLetterContent(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cover letter content';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [coverLetterId]);

  const refetch = useCallback(() => {
    fetchCoverLetterContent();
  }, [fetchCoverLetterContent]);

  useEffect(() => {
    fetchCoverLetterContent();
  }, [fetchCoverLetterContent]);

  return {
    coverLetterContent,
    loading,
    error,
    refetch,
  };
};
