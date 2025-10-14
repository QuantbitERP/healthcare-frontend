// src/store/slices/concessionCategorySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConcessionCategories,
  fetchConcessionCategoriesKVPair,
  fetchConcessionCategoriesDirect,
  createConcessionCategory,
  updateConcessionCategory,
  deleteConcessionCategories,
  fetchConcessionCategoryTypes,
  fetchConcessionCreatedByUsers,
  fetchConcessionModifiedByUsers,
  fetchConcessionCategoryById,
} from "./thunk";
import type { ConcessionCategoryDto } from "@/api-client";
import { ConcessionCategoryById } from "@/api-client/models/ConcessionCategoryRequestDto";

interface ConcessionCategoryState {
  list: ConcessionCategoryDto[] | any;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  types: any;
  categories: any; // ✅ Add categories for KVPair data
  createdByUsers: any;
  modifiedByUsers: any
  concessionCategoryById: ConcessionCategoryById | null;
  modalLoading: boolean; // ✅ Add loading state for modal
}

const initialState: ConcessionCategoryState = {
  concessionCategoryById: null,
  list: [],
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  types: [],
  categories: [], // ✅ Add categories initial state
  createdByUsers: [],
  modifiedByUsers: [],
  modalLoading: false,
};

export const concessionCategorySlice = createSlice({
  name: "concessionCategory",
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
      .addCase(fetchConcessionCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchConcessionCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createConcessionCategory.fulfilled, (state, action) => {
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
      .addCase(createConcessionCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updateConcessionCategory.fulfilled, (state, action) => {
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
      .addCase(updateConcessionCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(deleteConcessionCategories.fulfilled, (state) => {
        state.deleteSuccess = true;
      })
      .addCase(deleteConcessionCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchConcessionCategoryTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(fetchConcessionCategoriesKVPair.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionCategoriesKVPair.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        console.log('Concession categories loaded successfully:', action.payload);
      })
      .addCase(fetchConcessionCategoriesKVPair.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch concession categories:', action.payload);
      })
      .addCase(fetchConcessionCategoriesDirect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionCategoriesDirect.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        console.log('Concession categories loaded successfully (direct):', action.payload);
      })
      .addCase(fetchConcessionCategoriesDirect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch concession categories (direct):', action.payload);
      })
      .addCase(fetchConcessionCreatedByUsers.fulfilled, (state, action) => {
        state.createdByUsers = action.payload;
      })
      .addCase(fetchConcessionModifiedByUsers.fulfilled, (state, action) => {
        state.modifiedByUsers = action.payload;
      })
      .addCase(fetchConcessionCategoryById.pending, (state) => {
        state.concessionCategoryById = null;
        state.modalLoading = true; // ✅ Set modal loading
      })
      .addCase(fetchConcessionCategoryById.fulfilled, (state, action) => {
        state.concessionCategoryById = action.payload as ConcessionCategoryById;
        state.modalLoading = false; // ✅ Clear modal loading
      })
      .addCase(fetchConcessionCategoryById.rejected, (state, action) => {
        state.concessionCategoryById = null;
        state.modalLoading = false; // ✅ Clear modal loading
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccessFlags } = concessionCategorySlice.actions;

export default concessionCategorySlice;
