import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TaxService } from '../../services/api-client/services/TaxService'
import { KVPair } from "@/api-client";

export interface LabelValue {
  label: string;
  value: string;
}

export interface TaxFilterOptionsState {
  loading: boolean;
  error: string | null;
  createdByList: LabelValue[];
  modifiedByList: LabelValue[];
  taxTypeList: LabelValue[];
  statusList: LabelValue[];
}

const initialState: TaxFilterOptionsState = {
  loading: false,
  error: null,
  createdByList: [],
  modifiedByList: [],
  taxTypeList: [],
  statusList: [],
};

export const fetchTaxFilterOptions = createAsyncThunk(
  "TaxFilterOptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [createdBy, modifiedBy, taxTypes, status] = await Promise.all([
        TaxService.GetCreatedBy("1"),
        TaxService.GetModifiedBy("1"),
        TaxService.GetTaxTypes("1"),
        TaxService.GetStatus("1"),
      ]);
    return {
        createdByList: createdBy.data?.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        modifiedByList: modifiedBy.data?.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        taxTypeList: taxTypes.data?.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        statusList: status.data?.items.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
      };
    } catch (error: any) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch tax filter options");
    }
  }
);

const TaxFilterOptionsSlice = createSlice({
  name: "TaxFilterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.createdByList = action.payload.createdByList;
        state.modifiedByList = action.payload.modifiedByList;
        state.taxTypeList = action.payload.taxTypeList;
        state.statusList = action.payload.statusList;
      })
      .addCase(fetchTaxFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default TaxFilterOptionsSlice.reducer; 