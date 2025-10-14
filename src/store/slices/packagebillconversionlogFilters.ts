import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PackageBillConversionLogFiltersState {
  patientVisitId?: string;
  sourcePackage: string[];
  targetPackage: string[];
  changeType: number[];
  modifiedByList: string[];
  searchTerm: string;
}

const initialState: PackageBillConversionLogFiltersState = {
  patientVisitId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  sourcePackage: [],
  targetPackage: [],
  changeType: [],
  modifiedByList: [],
  searchTerm: "",
};

const packageBillConversionLogFiltersSlice = createSlice({
  name: "packageBillConversionLogFilters",
  initialState,
  reducers: {
    setPackageBillConversionLogFilters(
      state,
      action: PayloadAction<Partial<PackageBillConversionLogFiltersState>>
    ) {
      Object.assign(state, action.payload);
    },
    resetPackageBillConversionLogFilters: () => initialState,
  },
});

export const {
  setPackageBillConversionLogFilters,
  resetPackageBillConversionLogFilters,
} = packageBillConversionLogFiltersSlice.actions;

export default packageBillConversionLogFiltersSlice.reducer;
