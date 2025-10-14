import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OPDFiltersState {
  meMode: boolean;
  startDate?: string;
  endDate?: string;
  billStatuses: number[];
  createdByList: string[];
  companyIds: string[];
  schemeCompanyTypeIds: string[];
  isCancelled: boolean;
  searchTerm: string;
}

const initialState: OPDFiltersState = {
  meMode: false,
  startDate: "",
  endDate: "",
  billStatuses: [],
  createdByList: [],
  companyIds: [],
  schemeCompanyTypeIds: [],
  isCancelled: false,
  searchTerm: "",
};

const filtersSlice = createSlice({
  name: "opdFilters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<OPDFiltersState>>) {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
