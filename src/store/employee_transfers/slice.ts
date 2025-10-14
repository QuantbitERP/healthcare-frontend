import { createSlice } from "@reduxjs/toolkit";
import {
  TransferEmployeeRecordState,
  FundTransferRecordState,
  CategoryChangeBillingRecordState,
  FilterState,
} from "./types";
import {
  fetchFundTransferTableData,
  fetchTransferTableData,
  fetchCategoryChangeTableData,
  fetchEmployeeTransferFilters,
  fetchSubCategoryOptions,
} from "./thunks";

const initialState: TransferEmployeeRecordState = {
  data: [],
  loading: false,
  error: null,
};

export const transferTableSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferTableData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransferTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing data";
      });
  },
});

const FundInitialState: FundTransferRecordState = {
  data: [],
  loading: false,
  error: null,
};

export const fundTransferTableSlice = createSlice({
  name: "fundTransfer",
  initialState: FundInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundTransferTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundTransferTableData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFundTransferTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing data";
      });
  },
});

const CategoryInitialState: CategoryChangeBillingRecordState = {
  data: [],
  loading: false,
  error: null,
};

export const categoryChangeTableSlice = createSlice({
  name: "categoryChange",
  initialState: CategoryInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryChangeTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryChangeTableData.fulfilled,
        (state, action) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategoryChangeTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing data";
      });
  },
});

const FiltersInitialState: FilterState = {
  options: {
    category: [],
    designation: [],
    referredDoctor: [],
    modifiedBy: [],
    createdBy: [],
    subCategory: [],
  },
  loading: false,
  error: null,
};
export const emplyeeTransfersFiltersSlice = createSlice({
  name: "categoryChangeFilters",
  initialState: FiltersInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeTransferFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployeeTransferFilters.fulfilled,
        (state, action) => {
          state.options = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchEmployeeTransferFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load filter data";
      })
      .addCase(fetchSubCategoryOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryOptions.fulfilled, (state, action) => {
        state.options.subCategory = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubCategoryOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load subcategory data";
      });
  },
});
