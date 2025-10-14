import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceHeadCodeList, fetchPatientCompanies, fetchServiceHeadCodeDepartments, fetchServiceHeadCodeHospitals, saveServiceHeadCode } from "./serviceheadcodeThunks";
import type { KVPair } from "@/api-client/models/KVPair";
import type { ServiceHeadCodeSettingListResponseDtoResultModel } from "@/api-client/models/ServiceHeadCodeSettingListResponseDtoResultModel";
import type { HospitalListDto } from "@/api-client/models/HospitalListDto";

export interface ServiceHeadCodeState {
  list: {
    data: ServiceHeadCodeSettingListResponseDtoResultModel | null;
    loading: boolean;
    error: string | null;
  };
  patientCompanies: {
    data: KVPair[];
    loading: boolean;
    error: string | null;
  };
 
  departments: {
    data: KVPair[];
    loading: boolean;
    error: string | null;
  };
  hospitals: {
    data: HospitalListDto[];
    loading: boolean;
    error: string | null;
  };
  save: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: ServiceHeadCodeState = {
  list: {
    data:{ data:{ items:[]}},
    loading: false,
    error: null,
  },
  patientCompanies: {
    data: [],
    loading: false,
    error: null,
  },
  departments: {
    data: [],
    loading: false,
    error: null,
  },
  hospitals: {
    data: [],
    loading: false,
    error: null,
  },
  save: {
    loading: false,
    error: null,
  },
};

const serviceheadcodeSlice = createSlice({
  name: "serviceheadcode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Service Head Code List
    builder.addCase(fetchServiceHeadCodeList.pending, (state) => {
      state.list.loading = true;
      state.list.error = null;
    });
    builder.addCase(fetchServiceHeadCodeList.fulfilled, (state, action) => {
     
      
      state.list.loading = false;
      state.list.data   = action.payload;
      
     
    });
    builder.addCase(fetchServiceHeadCodeList.rejected, (state, action) => {
     
      
      state.list.loading = false;
      state.list.error = action.payload as string;
      
    
    });

    // Patient Companies
    builder.addCase(fetchPatientCompanies.pending, (state) => {
      state.patientCompanies.loading = true;
      state.patientCompanies.error = null;
    });
    builder.addCase(fetchPatientCompanies.fulfilled, (state, action) => {
      state.patientCompanies.loading = false;
      state.patientCompanies.data = action.payload;
    });
    builder.addCase(fetchPatientCompanies.rejected, (state, action) => {
      state.patientCompanies.loading = false;
      state.patientCompanies.error = action.payload as string;
    });

    // Departments
    builder.addCase(fetchServiceHeadCodeDepartments.pending, (state) => {
      state.departments.loading = true;
      state.departments.error = null;
    });
    builder.addCase(fetchServiceHeadCodeDepartments.fulfilled, (state, action) => {
      state.departments.loading = false;
      state.departments.data = action.payload;
    });
    builder.addCase(fetchServiceHeadCodeDepartments.rejected, (state, action) => {
      state.departments.loading = false;
      state.departments.error = action.payload as string;
    });

    // Hospitals
    builder.addCase(fetchServiceHeadCodeHospitals.pending, (state) => {
      state.hospitals.loading = true;
      state.hospitals.error = null;
    });
    builder.addCase(fetchServiceHeadCodeHospitals.fulfilled, (state, action) => {
      state.hospitals.loading = false;
      state.hospitals.data = action.payload;
    });
    builder.addCase(fetchServiceHeadCodeHospitals.rejected, (state, action) => {
      state.hospitals.loading = false;
      state.hospitals.error = action.payload as string;
    });

    // Save Service Head Code
    builder.addCase(saveServiceHeadCode.pending, (state) => {
      state.save.loading = true;
      state.save.error = null;
    });
    builder.addCase(saveServiceHeadCode.fulfilled, (state) => {
      state.save.loading = false;
    });
    builder.addCase(saveServiceHeadCode.rejected, (state, action) => {
      state.save.loading = false;
      state.save.error = action.payload as string;
    });
  },
});

export default serviceheadcodeSlice.reducer; 