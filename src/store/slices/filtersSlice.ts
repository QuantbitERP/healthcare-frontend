import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  billStatus: string[] | null;
  createdBy: string[] | null;
  company: string[] | null;
  patientCategory: string[] | null;
  showCancelled: boolean | null;
}

const initialState: FiltersState = {
  billStatus: null,
  createdBy: null,
  company: null,
  patientCategory: null,
  showCancelled: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer; 