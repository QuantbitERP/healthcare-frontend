// src/store/opd/thunks/patientThunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { PatientService } from "@/services/api-client/services/PatientService";
import type { GetPatientsDto } from "@/services/api-client/models/GetPatientsDto";
import type { PatientSearchDtoListResultModelResultModel } from "@/services/api-client/models/PatientSearchDtoListResultModelResultModel";

export const fetchPatients = createAsyncThunk<
  PatientSearchDtoListResultModelResultModel,
  {
    version: string;
    tenant?: string;
    requestBody?: GetPatientsDto;
  }
>(
  "patients/fetchPatients",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await PatientService.postApiVPatientPatients(
        version,
        tenant,
        requestBody
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
