import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanyWiseClaimCheckList,
  createCompanyWiseClaimCheckList,
  fetchCompanyWiseClaimCheckListById,
  deleteClaimCheckList,
} from "./claimCheckListThunk";
import type { CompanyWiseClaimCheckListDto } from "@/services/api-client";

interface CompanyWiseClaimCheckListState {
  list: CompanyWiseClaimCheckListDto[] | any;
  selectedItem: CompanyWiseClaimCheckListDto | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  metadata: any;
  modalLoading: boolean;
}

const initialState: CompanyWiseClaimCheckListState = {
  list: [],
  selectedItem: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  metadata: {},
  modalLoading: false,
};

export const companyWiseClaimCheckListSlice = createSlice({
  name: "companyWiseClaimCheckList",
  initialState,
  reducers: {
    resetSuccessFlags(state) {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCompanyWiseClaimCheckList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyWiseClaimCheckList.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new API response structure: { data: { items: [...] } }
        const payload = action.payload as any; // Type assertion for API response
        if (payload?.data?.items) {
          state.list = payload.data.items;
          state.metadata = payload.data.metadata || {};
        } else if (payload?.items) {
          state.list = payload.items;
          state.metadata = payload.metadata || {};
        } else {
          state.list = [];
          state.metadata = {};
        }
        state.error = null;
      })
      .addCase(fetchCompanyWiseClaimCheckList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createCompanyWiseClaimCheckList.fulfilled, (state) => {
        state.createSuccess = true;
      })
      .addCase(createCompanyWiseClaimCheckList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // GET BY ID
      .addCase(fetchCompanyWiseClaimCheckListById.pending, (state) => {
        state.selectedItem = null;
        state.modalLoading = true;
      })
      .addCase(fetchCompanyWiseClaimCheckListById.fulfilled, (state, action) => {
        state.selectedItem = action.payload as CompanyWiseClaimCheckListDto;
        state.modalLoading = false;
      })
      .addCase(fetchCompanyWiseClaimCheckListById.rejected, (state, action) => {
        state.selectedItem = null;
        state.modalLoading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(deleteClaimCheckList.fulfilled, (state) => {
        state.deleteSuccess = true;
      })
      .addCase(deleteClaimCheckList.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccessFlags } = companyWiseClaimCheckListSlice.actions;

export default companyWiseClaimCheckListSlice;
