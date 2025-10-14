import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IpdFiltersState {
  meMode: boolean;
  patientCategory: string[];
  patientCompany: string[];
  billingClass: string[];
  admittingDoctor: string[];
  ward: string[];
  billStatus: number[];
  paidStatus: number[];
  gender: number[];
  modifiedByList: string[];
  createdByList: string[];
  package: boolean;
  surgeryDone: boolean;
  showBilledAndDischargedPatients: boolean;
  searchTerm: string;
  startDate: string | null;
  endDate: string | null;
  hospitalId: string;
}

const initialState: IpdFiltersState = {
  meMode: false,
  patientCategory: [],
  patientCompany: [],
  billingClass: [],
  admittingDoctor: [],
  ward: [],
  billStatus: [0],
  paidStatus: [0],
  gender: [0],
  modifiedByList: [],
  createdByList: [],
  package: false,
  surgeryDone: false,
  showBilledAndDischargedPatients: false,
  searchTerm: "",
  startDate: null,
  endDate: null,
  hospitalId: "00000000-0000-0000-0000-000000000000",
};

export const ipdFiltersSlice = createSlice({
  name: "ipdFilters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<IpdFiltersState>>) {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = ipdFiltersSlice.actions;
export default ipdFiltersSlice.reducer;
