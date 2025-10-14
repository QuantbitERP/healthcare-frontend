import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  fetchConcessions,
  fetchPayments,
  fetchPaymentStats,
  fetchPaymentById,
  fetchColumnConfig, 
  saveColumnConfig
} from "./thunks";
import {
  Company,
  Concession,
  PaymentResponse,
  PaymentStats,
  PaymentDetailResponse,
  ColumnConfigState,
} from "./types";


// Metadata Slice
interface PaymentMetadataState {
  companies: Company[];
  concessions: Concession[];
  loading: boolean;
  error: string | null;
}

const metadataInitialState: PaymentMetadataState = {
  companies: [],
  concessions: [],
  loading: false,
  error: null,
};

export const paymentMetadataSlice = createSlice({
  name: "paymentMetadata",
  initialState: metadataInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load companies";
      })
      .addCase(fetchConcessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessions.fulfilled, (state, action) => {
        state.concessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchConcessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load concessions";
      });
  },
});

// Payments Slice
interface PaymentsState {
  data: PaymentResponse | null;
  stats: PaymentStats | null;
  loading: boolean;
  error: string | null;
}

const paymentsInitialState: PaymentsState = {
  data: null,
  stats: null,
  loading: false,
  error: null,
};

export const paymentsSlice = createSlice({
  name: "payments",
  initialState: paymentsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch payments";
      })
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch payment stats";
      });
  },
});

// Payment Detail Slice
interface PaymentDetailState {
  data: PaymentDetailResponse | null;
  loading: boolean;
  error: string | null;
}

const detailInitialState: PaymentDetailState = {
  data: null,
  loading: false,
  error: null,
};

export const paymentDetailSlice = createSlice({
  name: "paymentDetail",
  initialState: detailInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch payment details";
      });
  },
});


  
const initialState: ColumnConfigState = {
    all_columns: [],
    selected_columns: [],
    unselected_columns: [],
    loading: false,
    error: null,
  };
  
export const columnConfigSlice = createSlice({
    name: "columnConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchColumnConfig.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchColumnConfig.fulfilled, (state, action) => {
          state.loading = false;
          state.all_columns = action.payload.all_columns;
          state.selected_columns = action.payload.selected_columns;
          state.unselected_columns = action.payload.unselected_columns;
        })
        .addCase(fetchColumnConfig.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to load column config";
        })
        .addCase(saveColumnConfig.pending, (state) => {
          state.loading = true;
        })
        .addCase(saveColumnConfig.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(saveColumnConfig.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to save column config";
        });
    },
  });

export { fetchConcessions, fetchPaymentStats };