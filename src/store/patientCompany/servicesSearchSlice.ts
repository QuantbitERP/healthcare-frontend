import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchServiceOrServiceGroup, fetchServicesOrDepartments } from "./servicesSearchThunks";
import { GetServicesOrDepartmentsResponse, SearchServiceOrServiceGroupResponse } from "@/services/api-client/services/PatientCompanyMasterService";

interface ServicesSearchState {
  items: GetServicesOrDepartmentsResponse|null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}
interface SearchServiceOrServiceGroupState {
  items: SearchServiceOrServiceGroupResponse|null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialStateServicesSearch: ServicesSearchState = {
  items:null,
  loading: false,
  error: null,
  searchQuery: '',
};
const initialStateSearchServiceOrServiceGroup: SearchServiceOrServiceGroupState = {
    items:null,
    loading: false,
    error: null,
    searchQuery: '',
  };

export const servicesSearchSlice = createSlice({
  name: "servicesSearch",
  initialState:initialStateServicesSearch,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.items = null;
      state.error = null;
    },
    resetServicesSearchState: (state) => {
      state.items = null;
      state.loading = false;
      state.error = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesOrDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesOrDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchServicesOrDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = null;
      });
  },
});

export const searchServiceOrServiceGroupSlice = createSlice({
  name: "searchServiceOrServiceGroup",
  initialState:initialStateSearchServiceOrServiceGroup,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.items = null;
      state.error = null;
    },
    resetSearchServiceOrServiceGroupState: (state) => {
      state.items = null;
      state.loading = false;
      state.error = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceOrServiceGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceOrServiceGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || null;
        state.error = null;
      })
      .addCase(fetchServiceOrServiceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = null;
      });
  },

});
export const { setSearchQuery, clearSearch, resetServicesSearchState } = servicesSearchSlice.actions;
export const { 
  setSearchQuery: setSearchServiceQuery, 
  clearSearch: clearSearchService, 
  resetSearchServiceOrServiceGroupState 
} = searchServiceOrServiceGroupSlice.actions;
export const searchServiceOrServiceGroupReducer = searchServiceOrServiceGroupSlice.reducer;
export const servicesSearchReducer = servicesSearchSlice.reducer;