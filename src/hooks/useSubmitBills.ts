import { useState } from 'react';
import { SubmitBillRequest, SelectedBill } from '@/sections/invoicing/tableData';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';
import { extractApiErrorMessage } from '@/utils/errorHandler';

export interface UseSubmitBillsReturn {
  submitBills: (params: SubmitBillsParams) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface SubmitBillsParams {
  selectedBills: SelectedBill[];
  company: string;
  submissionRefNo: string;
  remarks: string;
  coverLetterContents: string;
  coverLetterId?: string;
  submissionDate?: string; // Optional submission date, defaults to current date
}

export const useSubmitBills = (): UseSubmitBillsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitBills = async (params: SubmitBillsParams): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the request body
      const submissionDate = params.submissionDate ? new Date(params.submissionDate).toISOString() : new Date().toISOString();
      
      const requestBody: SubmitBillRequest = {
        model: {
          invoiceDate: new Date().toISOString(),
          company: params.company,
          submissionRefNo: params.submissionRefNo,
          submissionDate: submissionDate,
          selectedBills: params.selectedBills,
          coverLetterId: params.coverLetterId || '',
          coverLetterContents: params.coverLetterContents,
          remarks: params.remarks,
        },
      };

      await InvoicingApiService.submitBills(requestBody);
      setSuccess(true);
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err) || 'Failed to submit bills';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitBills,
    loading,
    error,
    success,
  };
};
