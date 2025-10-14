import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DoctorService } from '../../services/api-client/services/DoctorService'
import { KVPair } from "@/api-client";

export interface LabelValue {
  label: string;
  value: string;
}

export interface DoctorFilterOptionsState {
  loading: boolean;
  error: string | null;
  createdByList: LabelValue[];
  modifiedByList: LabelValue[];
  DoctorTypeList: LabelValue[];
  statusList: LabelValue[];
}

const initialState: DoctorFilterOptionsState = {
  loading: false,
  error: null,
  createdByList: [],
  modifiedByList: [],
  DoctorTypeList: [],
  statusList: [],
};

export const fetchDoctorFilterOptions = createAsyncThunk(
  "DoctorFilterOptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [createdBy, modifiedBy, DoctorTypes, status] = await Promise.all([
        DoctorService.GetCreatedBy("1"),
        DoctorService.GetModifiedBy("1"),
        DoctorService.GetDoctorTypes("1"),
        DoctorService.GetStatus("1"),
      ]);
    
    return {
        createdByList: createdBy.data.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        modifiedByList: modifiedBy.data.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        DoctorTypeList: DoctorTypes.data.items?.map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
        statusList: status.data?.items.filter((item:KVPair) => item.key !== "0").map((item:KVPair) => ({
          value: item.key ?? "",
          label: item.value ?? "",
        })) ?? [],
      };
    } catch (error: any) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch Doctor filter options");
    }
  }
);

const DoctorFilterOptionsSlice = createSlice({
  name: "DoctorFilterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.createdByList = action.payload.createdByList;
        state.modifiedByList = action.payload.modifiedByList;
        state.DoctorTypeList = action.payload.DoctorTypeList;
        state.statusList = action.payload.statusList;
      })
      .addCase(fetchDoctorFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default DoctorFilterOptionsSlice.reducer; 