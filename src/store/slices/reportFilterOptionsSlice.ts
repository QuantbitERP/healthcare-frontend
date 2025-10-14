import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReportService } from '@/services/api-client/services/ReportService';

export interface LabelValue {
  key: any;
  label: string;
  value: string;
}

interface ReportFilterOptionsState {
  loading: boolean;
  error: string | null;
  serviceGroups: LabelValue[];
  departments: LabelValue[];
  services: LabelValue[];
  billingClasses: LabelValue[];
  companyNames: LabelValue[];
  groupByOptions: LabelValue[];
}

const initialState: ReportFilterOptionsState = {
  loading: false,
  error: null,
  serviceGroups: [],
  departments: [],
  services: [],
  billingClasses: [],
  companyNames: [],
  groupByOptions: [],
  
};

export const fetchReportFilterOptions = createAsyncThunk(
  'reportFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const [
        serviceGroups,
        departments,
        services,
        billingClasses,
        companyNames,
        groupBy,
        
      ] = await Promise.all([
        ReportService.getApiV1ServiceGroups(),
        ReportService.getApiVDepartmentsDepartmentKVlist('v1'),
        ReportService.getApiV1ServiceMaster(),
        ReportService.getApiV1BillingClass(),
        ReportService.getApiVCompany(),
        ReportService.getApiV1GrouBy(),
        
      ]);

      const normalizeList = <T extends { key?: string; value?: string }>(maybeList: any): Array<T> => {
        if (!maybeList) return [] as Array<T>;
        const items = Array.isArray(maybeList)
          ? maybeList
          : Array.isArray(maybeList?.data?.items)
            ? maybeList.data.items
            : Array.isArray(maybeList?.items)
              ? maybeList.items
              : [];
        return items as Array<T>;
      };

      const sgItems = normalizeList<{ key?: string; value?: string }>(serviceGroups);
      const deptItems = normalizeList<{ key?: string; value?: string }>(departments);
      const svcItems = normalizeList<{ key?: string; value?: string }>(services);
      const billingClassItems = normalizeList<{ key?: string; value?: string }>(billingClasses);
      const companyItems = normalizeList<{ key?: string; value?: string }>(companyNames);
      const groupByItems = normalizeList<{ key?: string; value?: string }>(groupBy);

      return {
        serviceGroups: sgItems.map((g) => ({
          key: g.key ?? '',
          value: g.key ?? '',
          label: g.value ?? '',
        })),
        departments: deptItems.map((d) => ({
          key: d.key ?? d.value ?? '',
          value: d.key ?? d.value ?? '',
          label: d.value ?? d.key ?? '',
        })),
        services: svcItems.map((s) => ({
          key: s.key ?? '',
          value: s.key ?? '',
          label: s.value ?? '',
        })),
        billingClasses: billingClassItems.map((b) => ({
          key: b.key ?? '',
          value: b.key ?? '',
          label: b.value ?? '',
        })),
        companyNames: companyItems.map((c) => ({
          key: c.key ?? '',
          value: c.key ?? '',
          label: c.value ?? '',
        })),
        groupBy: groupByItems.map((g) => ({
          key: g.key ?? '',
          value: g.key ?? '',
          label: g.value ?? '',
        })),
      };
    
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch report filter options'
      );
    }
  }
);

const reportFilterOptionsSlice = createSlice({
  name: 'reportFilterOptions/fetchAll',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceGroups = action.payload.serviceGroups;
        state.departments = action.payload.departments;
        state.services = action.payload.services;
        state.billingClasses = action.payload.billingClasses;
        state.companyNames = action.payload.companyNames;
        state.groupByOptions = action.payload.groupBy;
      })  
      .addCase(fetchReportFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportFilterOptionsSlice.reducer;
