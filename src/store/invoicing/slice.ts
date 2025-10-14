import { createSlice } from '@reduxjs/toolkit';
import { fetchInvoicingList, fetchBillCounts } from './thunks';
import { InvoicingApiResponse } from '@/sections/invoicing/tableData';

interface InvoicingState {
  data: InvoicingApiResponse | null;
  loading: boolean;
  error: string | null;
  billCounts: any | null;
  billCountsLoading: boolean;
  billCountsError: string | null;
}

const initialState: InvoicingState = {
  data: null,
  loading: false,
  error: null,
  billCounts: null,
  billCountsLoading: false,
  billCountsError: null,
};

const invoicingSlice = createSlice({
  name: 'invoicing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBillCountsError: (state) => {
      state.billCountsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoicing list
      .addCase(fetchInvoicingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicingList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoicingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch bill counts
      .addCase(fetchBillCounts.pending, (state) => {
        state.billCountsLoading = true;
        state.billCountsError = null;
      })
      .addCase(fetchBillCounts.fulfilled, (state, action) => {
        state.billCountsLoading = false;
        state.billCounts = action.payload;
        state.billCountsError = null;
      })
      .addCase(fetchBillCounts.rejected, (state, action) => {
        state.billCountsLoading = false;
        state.billCountsError = action.payload as string;
      });
  },
});

export const { clearError, clearBillCountsError } = invoicingSlice.actions;
export default invoicingSlice.reducer;
