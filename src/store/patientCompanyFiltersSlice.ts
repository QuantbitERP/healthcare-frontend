import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PatientCompanyFilterState {
  hosptialNameId: string[];
  createdByList: string[];
  modifiedByList:  string[];
  rateNameType: string[];
  patientCategoryType: string[];
  deactivated: boolean;
  searchTerm: string;
}

const initialState: PatientCompanyFilterState = {
  hosptialNameId: [],
  createdByList: [],
  modifiedByList: [],
  rateNameType: [],
  patientCategoryType: [],
  deactivated: false,
  searchTerm: "",
};

export const filtersSlicePatientCompany = createSlice({
  name: "patientCompanyFilters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<PatientCompanyFilterState>>) {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtersSlicePatientCompany.actions;

