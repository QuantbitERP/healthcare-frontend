import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DoctorService } from "@/services/api-client/services/DoctorService";
import { DoctorByIdResponse } from "@/services/api-client/models/DoctorDto";

interface DoctorByIdState {
  data: DoctorByIdResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorByIdState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDoctorById = createAsyncThunk<
  any,
  { id: string; version: string; tenant?: string },
  { rejectValue: string }
>(
  "doctorById/fetchDoctorById",
  async ({ id, version, tenant }, { rejectWithValue }) => {
    try {
      const response = await DoctorService.getApiVDoctorById(id, version, tenant);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor");
    }
  }
);

const DoctorByIdSlice = createSlice({
  name: "doctorById",
  initialState,
  reducers: {
    clearDoctorData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch doctor";
      });
  },
});

export const { clearDoctorData } = DoctorByIdSlice.actions;
export default DoctorByIdSlice.reducer; 