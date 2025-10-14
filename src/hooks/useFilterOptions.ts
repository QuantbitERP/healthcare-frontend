import { useState, useEffect } from 'react';
import { FilterApiService } from '@/services/invoicing/filterApiService';

export interface FilterOptions {
  billStatus: Array<{ label: string; value: string }>;
  billType: Array<{ label: string; value: string }>;
  companies: Array<{ label: string; value: string }>;
  associateCompanies: Array<{ label: string; value: string }>;
  groupBy: Array<{ label: string; value: string }>;
}

export interface UseFilterOptionsReturn {
  filterOptions: FilterOptions;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFilterOptions = (): UseFilterOptionsReturn => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    billStatus: [],
    billType: [],
    companies: [],
    associateCompanies: [],
    groupBy: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilterOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = await FilterApiService.getAllFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch filter options';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchFilterOptions();
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return {
    filterOptions,
    loading,
    error,
    refetch,
  };
};
