import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDepositConversionWithFilter,
  fetchDepositConversionFilters,
  createDepositConversion,
  updateDepositConversion,
  deleteDepositConversion,
} from "./thunk";

interface DepositConversionState {
  list: any[];
  meta: any;
  filtersData: {
    transferToList: any[];
    depositTypeList: any[];
    createdByList: any[];
    modifiedByList: any[];
  };
  loading: boolean;
  error: string | null;
  success: {
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

const initialState: DepositConversionState = {
  list: [],
  meta: {},
  filtersData: {
    transferToList: [],
    depositTypeList: [],
    createdByList: [],
    modifiedByList: [],
  },
  loading: false,
  error: null,
  success: {
    add: false,
    edit: false,
    delete: false,
  },
};

export const depositConversionSlice = createSlice({
  name: "depositConversion",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = { add: false, edit: false, delete: false };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Table data
      .addCase(fetchDepositConversionWithFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepositConversionWithFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data?.items || [];
        state.meta = action.payload?.data?.meta || {};
        state.error = null;
      })
      .addCase(fetchDepositConversionWithFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch data";
      })

      // Filter dropdowns
      .addCase(fetchDepositConversionFilters.fulfilled, (state, action) => {
        state.filtersData = action.payload?.data || initialState.filtersData;
        state.error = null;
      })
      .addCase(fetchDepositConversionFilters.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to fetch filter options";
      })

      // ====== Create ======
      .addCase(createDepositConversion.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
          state.success.add = true;
        }
        state.error = null;
      })

      // ====== Update ======
      .addCase(updateDepositConversion.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (item) => item.id === action.payload.data.id
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
            state.success.edit = true;
          }
        }
        state.error = null;
      })

      // ====== Delete ======
      .addCase(deleteDepositConversion.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list = state.list.filter(
            (item) => item.id !== action.payload.data.id
          );
          state.success.delete = true;
        }
        state.error = null;
      });
  },
});

export const { resetSuccess, clearError } = depositConversionSlice.actions;
export default depositConversionSlice.reducer;
