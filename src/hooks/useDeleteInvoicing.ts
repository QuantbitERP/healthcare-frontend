import { useState } from 'react';
import { InvoicingApiService, DeleteInvoicingRequest } from '@/services/invoicing/invoicingApiService';

export interface UseDeleteInvoicingReturn {
  deleteInvoicingItems: (ids: string[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteInvoicing = (): UseDeleteInvoicingReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteInvoicingItems = async (ids: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const requestBody: DeleteInvoicingRequest = {
        model: {
          ids: ids,
        },
      };

      await InvoicingApiService.deleteInvoicingItems(requestBody);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoicing items';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteInvoicingItems,
    loading,
    error,
    success,
  };
};
