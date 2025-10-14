import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DoctorDtoRequest, DoctorResponse } from "@/services/api-client/models/DoctorDto";
import { DoctorService } from "@/services/api-client/services/DoctorService";

interface DoctorListState {
  data: DoctorResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorListState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDoctorList = createAsyncThunk<
DoctorResponse,
  { version: string; tenant?: string; requestBody: DoctorDtoRequest },
  { rejectValue: string }
>(
  "taxList/fetchDoctorList",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await DoctorService.postApiVDoctorList(version, tenant, requestBody);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch tax list");
    }
  }
);

const DoctorListSlice = createSlice({
  name: "doctorList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctorList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tax list";
      });
  },
});

export default DoctorListSlice.reducer; 