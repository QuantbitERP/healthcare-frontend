import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ModeOfPaymentService } from "@/services/api-client/services/ModeOfPaymentService";

export interface LabelValue { label: string; value: string; }
export interface ModeOfPaymentFilterOptionsState {
  loading: boolean;
  error: string | null;
  paymentTypes: LabelValue[];
  createdBy: LabelValue[];
  modifiedBy: LabelValue[];
}

const initialState: ModeOfPaymentFilterOptionsState = {
  loading: false,
  error: null,
  paymentTypes: [],
  createdBy: [],
  modifiedBy: [],
};

export const fetchModeOfPaymentFilterOptions = createAsyncThunk(
  "ModeOfPaymentFilterOptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [paymentTypes, createdBy, modifiedBy] = await Promise.all([
        ModeOfPaymentService.getApiVModeOfPaymentGetPaymentType("1"),
        ModeOfPaymentService.getApiVModeOfPaymentGetCreatedbyUser("1"),
        ModeOfPaymentService.getApiVModeOfPaymentGetModifiedbyUser("1"),
      ]);
      return {
        paymentTypes: paymentTypes.data?.items?.map(item => ({
          value: item.key ?? "",
          label: item.value ?? ""
        })) ?? [],
        createdBy: createdBy.data?.items?.map(item => ({
          value: item.value ?? "",
          label: item.value ?? ""
        })) ?? [],
        modifiedBy: modifiedBy.data?.items?.map(item => ({
          value: item.value ?? "",
          label: item.value ?? ""
        })) ?? [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch filter options");
    }
  }
);

const ModeOfPaymentFilterSlice = createSlice({
  name: "ModeOfPaymentFilterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModeOfPaymentFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeOfPaymentFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentTypes = action.payload.paymentTypes;
        state.createdBy = action.payload.createdBy;
        state.modifiedBy = action.payload.modifiedBy;
      })
      .addCase(fetchModeOfPaymentFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ModeOfPaymentFilterSlice.reducer; 