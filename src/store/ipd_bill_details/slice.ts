import { createSlice } from "@reduxjs/toolkit";
import {
  fetchIpdBillDetails,
  searchServices,
  finalizeIpdBill,
  saveIpdDraft,
  fetchPatientVisitDetails,
  fetchIpdBillDetailsByDraftBillId,
} from "@/store/ipd_bill_details/thunks";
import {
  IpdBillDetailsResponse,
  SearchServicesResponse,
} from "@/store/ipd_bill_details/types";

export interface IpdBillDetailsState {
  data: IpdBillDetailsResponse | null;
  loading: boolean;
  error: string | null;
  searchResults: SearchServicesResponse | null;
  searchLoading: boolean;
  searchError: string | null;
  finalizeLoading: boolean;
  finalizeError: string | null;
  finalizeSuccess: boolean;
  saveDraftLoading: boolean;
  saveDraftError: string | null;
  saveDraftSuccess: boolean;
  patientVisitDetails: any | null;
  patientVisitLoading: boolean;
  patientVisitError: string | null;
  draftBillDetails: IpdBillDetailsResponse | null;
  draftBillDetailsLoading: boolean;
  draftBillDetailsError: string | null;
}

const initialIpdBillDetailsState: IpdBillDetailsState = {
  data: null,
  loading: false,
  error: null,
  searchResults: null,
  searchLoading: false,
  searchError: null,
  finalizeLoading: false,
  finalizeError: null,
  finalizeSuccess: false,
  saveDraftLoading: false,
  saveDraftError: null,
  saveDraftSuccess: false,
  patientVisitDetails: null,
  patientVisitLoading: false,
  patientVisitError: null,
  draftBillDetails: null,
  draftBillDetailsLoading: false,
  draftBillDetailsError: null,
};

export const ipdBillDetailsSlice = createSlice({
  name: "ipdBillDetails",
  initialState: initialIpdBillDetailsState,
  reducers: {
    clearIpdBillDetails: (state) => {
      state.data = null;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
    },
    clearFinalizeState: (state) => {
      state.finalizeLoading = false;
      state.finalizeError = null;
      state.finalizeSuccess = false;
    },
    clearSaveDraftState: (state) => {
      state.saveDraftLoading = false;
      state.saveDraftError = null;
      state.saveDraftSuccess = false;
    },
    clearPatientVisitDetails: (state) => {
      state.patientVisitDetails = null;
      state.patientVisitLoading = false;
      state.patientVisitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIpdBillDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIpdBillDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIpdBillDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchServices.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      })
      .addCase(finalizeIpdBill.pending, (state) => {
        state.finalizeLoading = true;
        state.finalizeError = null;
        state.finalizeSuccess = false;
      })
      .addCase(finalizeIpdBill.fulfilled, (state) => {
        state.finalizeLoading = false;
        state.finalizeSuccess = true;
      })
      .addCase(finalizeIpdBill.rejected, (state, action) => {
        state.finalizeLoading = false;
        state.finalizeError = action.payload as string;
      })
      .addCase(saveIpdDraft.pending, (state) => {
        state.saveDraftLoading = true;
        state.saveDraftError = null;
        state.saveDraftSuccess = false;
      })
      .addCase(saveIpdDraft.fulfilled, (state) => {
        state.saveDraftLoading = false;
        state.saveDraftError = null;
        state.saveDraftSuccess = true;
      })
      .addCase(saveIpdDraft.rejected, (state, action) => {
        state.saveDraftLoading = false;
        state.saveDraftError = action.payload as string;
        state.saveDraftSuccess = false;
      })
      .addCase(fetchPatientVisitDetails.pending, (state) => {
        state.patientVisitLoading = true;
        state.patientVisitError = null;
      })
      .addCase(fetchPatientVisitDetails.fulfilled, (state, action) => {
        state.patientVisitLoading = false;
        state.patientVisitDetails = action.payload;
        state.patientVisitError = null;
      })
      .addCase(fetchPatientVisitDetails.rejected, (state, action) => {
        state.patientVisitLoading = false;
        state.patientVisitError = action.payload as string;
      })
      .addCase(fetchIpdBillDetailsByDraftBillId.pending, (state) => {
        state.draftBillDetailsLoading = true;
        state.draftBillDetailsError = null;
      })
      .addCase(fetchIpdBillDetailsByDraftBillId.fulfilled, (state, action) => {
        state.draftBillDetailsLoading = false;
        state.draftBillDetails = action.payload;
      })
      .addCase(fetchIpdBillDetailsByDraftBillId.rejected, (state, action) => {
        state.draftBillDetailsLoading = false;
        state.draftBillDetailsError = action.payload as string;
      });
  },
});

export const {
  clearIpdBillDetails,
  clearSearchResults,
  clearFinalizeState,
  clearSaveDraftState,
  clearPatientVisitDetails,
} = ipdBillDetailsSlice.actions;
export default ipdBillDetailsSlice.reducer;
