import { useState, useEffect, useCallback } from 'react';
import { TableDataType } from '@/sections/invoicing/tableData';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';

export interface UseInvoicingDataReturn {
  data: TableDataType[];
  loading: boolean;
  error: string | null;
  metadata: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  refetch: () => void;
  updateFilters: (filters: InvoicingFilters) => void;
}

export interface InvoicingFilters {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  billStatus?: string[];
  billType?: string[];
  company?: string[];
  associateCompany?: string[];
  priorAuthDoneBy?: string;
  billFinalizedBy?: string;
  isCoverLetterAvailable?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const useInvoicingData = (): UseInvoicingDataReturn => {
  const [data, setData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    currentPage: 1,
    pageSize: 100,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<InvoicingFilters>({});

  const fetchData = useCallback(async (currentFilters: InvoicingFilters) => {
    setLoading(true);
    setError(null);

    try {
      const request = InvoicingApiService.buildRequestFromFilters(currentFilters);
      const result = await InvoicingApiService.getInvoicingList(request);
      
      setData(result.data);
      setMetadata(result.metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoicing data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: InvoicingFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  const refetch = useCallback(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  // Fetch data when filters change - no initial fetch
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchData(filters);
    }
  }, [filters, fetchData]);

  return {
    data,
    loading,
    error,
    metadata,
    refetch,
    updateFilters,
  };
};
