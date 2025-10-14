import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClaimCheckList,
  createClaimCheckList,
  updateClaimCheckList,
  deleteClaimCheckList,
  fetchClaimCheckListCreatedByUsers,
  fetchClaimCheckListModifiedByUsers,
  fetchClaimCheckListById,
} from "./claimCheckListThunk";
import type { ClaimCheckListDto, ClaimCheckListDataDto } from "@/services/api-client";

interface ClaimCheckListState {
  list: ClaimCheckListDto[] | any;
  selectedItem: ClaimCheckListDataDto | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  createdByUsers: any[];
  modifiedByUsers: any[];
  metadata: any;
  modalLoading: boolean;
}

const initialState: ClaimCheckListState = {
  list: [],
  selectedItem: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  createdByUsers: [],
  modifiedByUsers: [],
  metadata: {},
  modalLoading: false,
};

export const claimCheckListSlice = createSlice({
  name: "claimCheckList",
  initialState,
  reducers: {
    resetSuccessFlags(state) {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchClaimCheckList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimCheckList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.items || [];
        state.metadata = action.payload?.metadata || {};
      })
      .addCase(fetchClaimCheckList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createClaimCheckList.fulfilled, (state) => {
        state.createSuccess = true;
      })
      .addCase(createClaimCheckList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updateClaimCheckList.fulfilled, (state) => {
        state.updateSuccess = true;
      })
      .addCase(updateClaimCheckList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(deleteClaimCheckList.fulfilled, (state) => {
        state.deleteSuccess = true;
      })
      .addCase(deleteClaimCheckList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // GET BY ID
      .addCase(fetchClaimCheckListById.pending, (state) => {
        state.selectedItem = null;
        state.modalLoading = true;
      })
      .addCase(fetchClaimCheckListById.fulfilled, (state, action) => {
        state.selectedItem = action.payload as ClaimCheckListDataDto;
        state.modalLoading = false;
      })
      .addCase(fetchClaimCheckListById.rejected, (state, action) => {
        state.selectedItem = null;
        state.modalLoading = false;
        state.error = action.payload as string;
      })
      // CREATED BY USERS
      .addCase(fetchClaimCheckListCreatedByUsers.fulfilled, (state, action) => {
        state.createdByUsers = action.payload || [];
      })
      // MODIFIED BY USERS
      .addCase(fetchClaimCheckListModifiedByUsers.fulfilled, (state, action) => {
        state.modifiedByUsers = action.payload || [];
      });
  },
});

export const { resetSuccessFlags, resetError } = claimCheckListSlice.actions;

export default claimCheckListSlice;
