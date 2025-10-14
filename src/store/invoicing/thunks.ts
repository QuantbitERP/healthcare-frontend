import { createAsyncThunk } from '@reduxjs/toolkit';
import { InvoicingApiService } from '@/services/invoicing/invoicingApiService';
import { InvoicingApiRequest } from '@/sections/invoicing/tableData';

// Fetch invoicing list with filters
export const fetchInvoicingList = createAsyncThunk<
  any,
  { version: string; tenant?: string; requestBody: InvoicingApiRequest }
>(
  'invoicing/fetchList',
  async ({ version: _version, tenant: _tenant, requestBody }, { rejectWithValue }) => {
    try {
      const result = await InvoicingApiService.getInvoicingList(requestBody);
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch invoicing list');
    }
  }
);

// Fetch bill counts for score card
export const fetchBillCounts = createAsyncThunk<
  any,
  { startDate: string; endDate: string; tenant?: string }
>(
  'invoicing/fetchBillCounts',
  async ({ startDate, endDate, tenant: _tenant }, { rejectWithValue }) => {
    try {
      const result = await InvoicingApiService.getBillCounts({
        startdate: startDate,
        enddate: endDate,
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch bill counts');
    }
  }
);
