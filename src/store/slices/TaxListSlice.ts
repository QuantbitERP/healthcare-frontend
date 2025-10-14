import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TaxService } from "../../services/api-client/services/TaxService";
import { TaxDtoRequest, TaxResponse } from "../../services/api-client/models/TaxDto";

interface TaxListState {
  data: TaxResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaxListState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchTaxList = createAsyncThunk<
  TaxResponse,
  { version: string; tenant?: string; requestBody: TaxDtoRequest },
  { rejectValue: string }
>(
  "taxList/fetchTaxList",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await TaxService.postApiVTaxList(version, tenant, requestBody);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch tax list");
    }
  }
);

export const deleteTax = createAsyncThunk<
  any,
  { version: string; tenant?: string; ids: string[] },
  { rejectValue: string }
>(
  "taxList/deleteTax",
  async ({ version, tenant, ids }, { rejectWithValue }) => {
    try {
      const response = await TaxService.deleteApiVTax(version, tenant, ids);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete tax");
    }
  }
);

const taxListSlice = createSlice({
  name: "taxList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTaxList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tax list";
      })
      .addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete tax";
      });
  },
});

export default taxListSlice.reducer; 