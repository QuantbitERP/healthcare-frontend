import { useState, useEffect, useCallback } from 'react';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';
import { BillCountsRequest, BillCountsData } from '@/sections/invoicing/tableData';

export const useBillCounts = (request: BillCountsRequest | null) => {
  const [data, setData] = useState<BillCountsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillCounts = useCallback(async () => {
    if (!request) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await InvoicingApiService.getBillCounts(request);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bill counts');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchBillCounts();
  }, [fetchBillCounts]);

  return {
    data,
    loading,
    error,
    refetch: fetchBillCounts
  };
};
