"use client"
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ReportService } from '@/services/api-client/services/ReportService';
import { ServicewiseBillReportDto } from '@/api-client/models/ServicewiseBillReportDto';

export type ReportItem = ServicewiseBillReportDto;

export interface ReportListRequestDto {
  fromDate: string;
  toDate: string;
  hospitalIds: string[];
  billType?: number;
  patientId?: string | null;
  serviceGroupIds?: string[];
  serviceDepartmentIds?: string[];
  serviceIds?: string[];
  billingClassIds?: string[];
  companyNameIds?: string[];
  groupBy?: string[];
  searchTerm?: string;
}



interface ReportState {
  items: ReportItem[];
  loading: boolean;
  error: string | null;
}

export interface ReportListResponseDto {
  data: {
    items: ReportItem[];
  };
}

const initialState: ReportState = {
  items: [],
  loading: false,
  error: null,
};


  export const fetchServicewiseReport = createAsyncThunk<ReportListResponseDto, ReportListRequestDto>(
    'report/fetchReport',
    async (params, { rejectWithValue }) => {
      try {
        const response = await ReportService.postApiV1BillReport(params);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch report');
      }
    }
  );

  


const reportListSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicewiseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicewiseReport.fulfilled, (state, action: PayloadAction<ReportListResponseDto>) => {
        state.loading = false;
        state.items = action.payload.data?.items || [];
      })
      .addCase(fetchServicewiseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch report';
      });
  },
});

export default reportListSlice.reducer;
