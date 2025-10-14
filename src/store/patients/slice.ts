// src/store/opd/slices/patientSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { fetchPatients } from "./thunks";
import type { PatientSearchDtoListResultModelResultModel } from "@/services/api-client/models/PatientSearchDtoListResultModelResultModel";

interface PatientState {
  data: PatientSearchDtoListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  data: null,
  loading: false,
  error: null,
};

export const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

