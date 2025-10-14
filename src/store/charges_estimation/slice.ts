import { createSlice } from "@reduxjs/toolkit";
import {
  fetchChargesEstimationSearchServicesList,
  saveChargesEstimation,
  updateChargesEstimation,
  deleteChargesEstimation,
  fetchChargesEstimationCreatedBy,
  fetchChargesEstimationModifiedBy,
  fetchChargesEstimationTypeEnum,
  fetchChargesEstimationPatientTypeEnum,
  fetchChargesEstimationList,
  exportChargesEstimationPdf,
  exportChargesEstimationExcel,
  fetchChargesEstimationById,
  exportChargesEstimationVsBillComparisonPdf,
} from "./thunks";

interface ChargesEstimationState {
  createdByList: string[];
  modifiedByList: string[];
  estimationTypes: { key: number; value: string }[];
  patientTypes: { key: number; value: string }[];
  estimationList: any[];
  serviceSearchResults: any[];
  estimationById: any | null;

  // Pagination metadata
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };

  exportPdf: Blob | null;
  exportExcel: Blob | null;
  exportVsBillPdf: Blob | null;

  saveResult: any | null;
  updateResult: any | null;
  deleteResult: any | null;

  loading: boolean;
  error: string | null;
}

const initialState: ChargesEstimationState = {
  createdByList: [],
  modifiedByList: [],
  estimationTypes: [],
  patientTypes: [],
  estimationList: [],
  serviceSearchResults: [],
  estimationById: null,

  // Pagination metadata
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  },

  exportPdf: null,
  exportExcel: null,
  exportVsBillPdf: null,

  saveResult: null,
  updateResult: null,
  deleteResult: null,

  loading: false,
  error: null,
};

const chargesEstimationSlice = createSlice({
  name: "chargesEstimation",
  initialState,
  reducers: {
    resetChargesEstimationState: () => initialState,
  },
  extraReducers: (builder) => {
    // Created By
    builder
      .addCase(fetchChargesEstimationCreatedBy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargesEstimationCreatedBy.fulfilled, (state, action) => {
        state.loading = false;
        state.createdByList = action.payload?.data?.items?.map((kv) => kv.value ?? "") ?? [];
      })
      .addCase(fetchChargesEstimationCreatedBy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Modified By
    builder
      .addCase(fetchChargesEstimationModifiedBy.fulfilled, (state, action) => {
        state.loading = false;
        state.modifiedByList = action.payload?.data?.items?.map((kv) => kv.value ?? "") ?? [];
      });

    // Estimation Type Enum
    builder
      .addCase(fetchChargesEstimationTypeEnum.fulfilled, (state, action) => {
        state.loading = false;
        state.estimationTypes = action.payload?.data?.items?.map((kv) => ({ key: Number(kv.key) ?? 0, value: kv.value ?? "" })) ?? [];
      });

    // Patient Type Enum
    builder
      .addCase(fetchChargesEstimationPatientTypeEnum.fulfilled, (state, action) => {
        state.loading = false;
        state.patientTypes = action.payload?.data?.items?.map((kv) => ({ key: Number(kv.key) ?? 0, value: kv.value ?? "" })) ?? [];
      });

    // Estimation List
    builder
      .addCase(fetchChargesEstimationList.fulfilled, (state, action) => {
        state.loading = false;
        state.estimationList = action.payload?.data?.items ?? [];
        
        // Update pagination metadata from API response
        const metadata = action.payload?.data?.metadata?.page;
        if (metadata) {
          state.pagination = {
            currentPage: metadata.currentPage ?? 1,
            pageSize: metadata.pageSize ?? 10,
            totalPages: metadata.totalPages ?? 1,
            totalItems: (metadata.totalPages ?? 1) * (metadata.pageSize ?? 10),
          };
        }
      });

    // Search Services
    builder
      .addCase(fetchChargesEstimationSearchServicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceSearchResults = action.payload?.data?.items ?? [];
      });

    // Estimation by ID
    builder
      .addCase(fetchChargesEstimationById.fulfilled, (state, action) => {
        state.loading = false;
        state.estimationById = action.payload;
      });

    // Save
    builder
      .addCase(saveChargesEstimation.fulfilled, (state, action) => {
        state.loading = false;
        state.saveResult = action.payload;
      });

    // Update
    builder
      .addCase(updateChargesEstimation.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;
      });

    // Delete
    builder
      .addCase(deleteChargesEstimation.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;
      });

    // Export PDF
    builder
      .addCase(exportChargesEstimationPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.exportPdf = action.payload;
      });

    // Export Excel
    builder
      .addCase(exportChargesEstimationExcel.fulfilled, (state, action) => {
        state.loading = false;
        state.exportExcel = action.payload;
      });

    // Export Vs Bill Comparison PDF
    builder
      .addCase(exportChargesEstimationVsBillComparisonPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.exportVsBillPdf = action.payload;
      });

    // Common rejected
    [
      fetchChargesEstimationModifiedBy,
      fetchChargesEstimationTypeEnum,
      fetchChargesEstimationPatientTypeEnum,
      fetchChargesEstimationList,
      fetchChargesEstimationSearchServicesList,
      fetchChargesEstimationById,
      saveChargesEstimation,
      updateChargesEstimation,
      deleteChargesEstimation,
      exportChargesEstimationPdf,
      exportChargesEstimationExcel,
      exportChargesEstimationVsBillComparisonPdf,
    ].forEach((thunk) => {
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });
  },
});

export const { resetChargesEstimationState } = chargesEstimationSlice.actions;
export default chargesEstimationSlice.reducer;
