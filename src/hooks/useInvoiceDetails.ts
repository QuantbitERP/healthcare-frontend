import { useState, useEffect, useCallback } from 'react';
import { InvoiceDetailsResponse } from '@/sections/invoicing/tableData';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';

export interface UseInvoiceDetailsReturn {
  invoiceDetails: InvoiceDetailsResponse['data'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useInvoiceDetails = (invoiceId: string | null): UseInvoiceDetailsReturn => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoiceDetails = useCallback(async () => {
    if (!invoiceId) {
      setInvoiceDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await InvoicingApiService.getInvoiceDetails(invoiceId);
      setInvoiceDetails(details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoice details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  const refetch = useCallback(() => {
    fetchInvoiceDetails();
  }, [fetchInvoiceDetails]);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [fetchInvoiceDetails]);

  return {
    invoiceDetails,
    loading,
    error,
    refetch,
  };
};
