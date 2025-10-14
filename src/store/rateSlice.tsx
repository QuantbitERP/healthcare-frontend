import {
  fetchRateStats,
  fetchServiceRatesList,
  // fetchServiceRatesList,
  Meta,
  RateStats,
  Service,
  uploadRatesExcel,
} from "./actions/rateActions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiceState {
  uploadStatus: "idle" | "loading" | "success" | "error";
  list: Service[];
  meta: Meta;
  stats: RateStats;
  loading: boolean;
  error: string | null;
}

export interface ServiceRate {
  id: number;
  name: string;
  amount: number;
}

// Initial State
const initialState: ServiceState = {
  list: [],
  meta: {
    total_count: 0,
    total_pages: 0,
    current_page: 0,
    per_page: 0,
    sort_by: "",
    sort_order: "",
  },
  stats: {
    total_count: 0,
    active_count: 0,
    deactive_count: 0,
  },
  uploadStatus: "idle",
  error: null,
  loading: false,
};

const ratesSlice = createSlice({
  name: "rates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };
    const _setError = (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || "Error fetching data";
    };

    builder
      .addCase(fetchServiceRatesList.pending, setLoading)
      .addCase(fetchServiceRatesList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.services;
        state.meta = action.payload.meta;
      })
      .addCase(fetchServiceRatesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.rate_stats;
      })
      .addCase(fetchRateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadRatesExcel.pending, (state) => {
        state.uploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadRatesExcel.fulfilled, (state, _action) => {
        state.uploadStatus = "success";
        // state.data = action.payload;
      })
      .addCase(uploadRatesExcel.rejected, (state, action) => {
        state.uploadStatus = "error";
        state.error = action.payload || "Unknown error";
      });
  },
});

export default ratesSlice.reducer;
