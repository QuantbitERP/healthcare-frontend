"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportFilterState {
  serviceGroup: string[];
  department: string[];
  service: string[];
  billingClass: string[];
  companyName: string[];
  checkbox1: boolean;
  checkbox2: boolean;
  groupBy?: string[];
}

const initialState: ReportFilterState = {
  serviceGroup: [],
  department: [],
  service: [],
  billingClass: [],
  companyName: [],
  checkbox1: false,
  checkbox2: false,
  groupBy: [],
  
};

const reportFilterSlice = createSlice({
  name: "reportFilter",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<ReportFilterState>>) {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = reportFilterSlice.actions;
export default reportFilterSlice.reducer;
