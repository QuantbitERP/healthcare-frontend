import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFinanceAuthorityList,
  fetchFinanceAuthorityById,
  createFinanceAuthority,
  updateFinanceAuthority,
  deleteFinanceAuthority,
  fetchFinanceAuthorityFilters,
} from "./thunk";

import type { FinanceAuthorityListResponseDto } from "@/services/api-client";
import { Metadata } from "@/services/api-client";

interface FinanceAuthorityState {
  list: FinanceAuthorityListResponseDto[];
  metadata: Metadata;
  selected: any | null;
  filters: any;
  loading: boolean;
  error: string | null;

  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;

  dropdowns: {
    concessionGivenBy: any[];
    employee: any[];
    createdBy: any[];
    modifiedBy: any[];
    doctorList: any[];
  };
}

const initialState: FinanceAuthorityState = {
  list: [],
  metadata: {
    page: {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    },
  },
  selected: null,
  filters: null,
  loading: false,
  error: null,

  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,

  dropdowns: {
    concessionGivenBy: [],
    employee: [],
    createdBy: [],
    modifiedBy: [],
    doctorList: [],
  },
};

const financeAuthoritySlice = createSlice({
  name: "financeAuthority",
  initialState,
  reducers: {
    clearFinanceAuthorityState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    resetSuccessFlags: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchFinanceAuthorityList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinanceAuthorityList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data?.items || [];
        // Note: FinanceAuthority API doesn't provide metadata, keeping existing metadata
      })
      .addCase(fetchFinanceAuthorityList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SINGLE
      .addCase(fetchFinanceAuthorityById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // CREATE
      .addCase(createFinanceAuthority.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFinanceAuthority.fulfilled, (state, action) => {
        state.loading = false;
        if(action.payload?.isError ){  
          state.error = action.payload.errorMessage as string;
          state.createSuccess = false;   
          return;
        }
        else{
          state.createSuccess = true;
          state.error = null;
        }
      })
      .addCase(createFinanceAuthority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create finance authority';
        state.createSuccess = false;
      })

      // UPDATE
      .addCase(updateFinanceAuthority.fulfilled, (state, action) => {
        if(action.payload?.isError ){  
          state.error = action.payload.errorMessage as string;
          state.updateSuccess = false;   
          return;
        }
        else{
          state.updateSuccess = true;
          state.error = null;
        }
      })

      // DELETE
      .addCase(deleteFinanceAuthority.fulfilled, (state, _action) => {
        state.deleteSuccess = true;
      })

      // FILTER DROPDOWNS
      .addCase(fetchFinanceAuthorityFilters.fulfilled, (state, action) => {
        const {
          concessionGivenBy,
          employee,
          createdBy,
          modifiedBy,
          doctorList,
        } = action.payload;
        state.dropdowns = {
          concessionGivenBy: concessionGivenBy?.data?.items || [],
          employee: employee?.data?.items ||  [],
          createdBy: createdBy?.data?.items ||  [],
          modifiedBy: modifiedBy?.data?.items ||  [],
          doctorList: doctorList?.data?.items ||  [],
        };
      });
  },
});

export const { clearFinanceAuthorityState, resetSuccessFlags } = financeAuthoritySlice.actions;

export default financeAuthoritySlice;
