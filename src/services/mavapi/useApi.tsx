import { useCallback, useState } from 'react';
import { ApiError } from '../api-client';

export function useApi() {
  const [error, setError] = useState<ApiError | unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generic request handler
  const handleRequest = useCallback(async function <T>(request: Promise<T>) {
    setIsLoading(true);
    try {
      const response = await request;
      setError(undefined);
      return response;
    } catch (err) {
      setError(err);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  function dismissError() {
    setError(undefined);
  }

  return {
    dismissError,
    error,
    isLoading,
    handleRequest,
  };
}

export default useApi;
