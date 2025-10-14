// src/store/slices/patientCompanySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPatientCompanyMasterList,
  fetchAllDropdownData,
  fetchHospitalList,
  fetchCountries,
  fetchStates,
  fetchDistricts,
  fetchCities,
  fetchStatusListCommon,
  fetchDepartments,
  deletePatientCompany,
} from "./thunks";
import { PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel } from "@/services/api-client";
import { KVPairListResultModelResultModel } from "@/services/api-client";
import { KVPair } from "./types";

type State = {
  data: PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

export const patientCompanySlice = createSlice({
  name: "patientCompany",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientCompanyMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientCompanyMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPatientCompanyMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface DropdownState {
  patientCategoryList: KVPairListResultModelResultModel | null;
  rateNameList: KVPairListResultModelResultModel | null;
  createdByUsers: KVPairListResultModelResultModel | null;
  modifiedByUsers: KVPairListResultModelResultModel | null;
  companies: any;
  loading: boolean;
  error: string | null;
}

const initialFiltersState: DropdownState = {
  patientCategoryList: null,
  rateNameList: null,
  createdByUsers: null,
  modifiedByUsers: null,
  companies: [],
  loading: false,
  error: null,
};

export const dropdownSlice = createSlice({
  name: "dropdown",
  initialState: initialFiltersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDropdownData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDropdownData.fulfilled, (state, action: any) => {
        state.patientCategoryList = action.payload.patientCategoryList;
        state.rateNameList = action.payload.rateNameList;
        state.createdByUsers = action.payload.createdByUsers;
        state.modifiedByUsers = action.payload.modifiedByUsers;
        state.companies = action.payload.companies;
        state.loading = false;
      })
      .addCase(fetchAllDropdownData.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch dropdown data";
      });
  },
});

interface HospitalState {
  hospitals: KVPair[];
  loading: boolean;
  error: string | null;
}

const initialHospitalListState: HospitalState = {
  hospitals: [],
  loading: false,
  error: null,
};

export const hospitalSlice = createSlice({
  name: "hospital",
  initialState: initialHospitalListState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalList.fulfilled, (state, action) => {
        const items = action.payload.hospitals?.data?.items ?? [];
        state.hospitals = items.map((item) => ({
          key: item.key ?? "",
          value: item.value ?? "",
        }));
        state.loading = false;
      })
      .addCase(fetchHospitalList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch hospital data";
      });
  },
});

export interface CommonLocationState {
  countries: KVPair[];
  states: KVPair[];
  districts: KVPair[];
  cities: KVPair[];
  statusList: KVPair[];
  departments: KVPair[];

  loading: boolean;
  error: string | null;
}

const initialCommonState: CommonLocationState = {
  countries: [],
  states: [],
  districts: [],
  cities: [],
  statusList: [],
  departments: [],

  loading: false,
  error: null,
};

export const commonLocationSlicePatient = createSlice({
  name: "commonLocation",
  initialState: initialCommonState,
  reducers: {
    resetStateList: (state) => {
      state.states = [];
      state.districts = [];
      state.cities = [];
    },
    resetDistrictList: (state) => {
      state.districts = [];
      state.cities = [];
    },
    resetCityList: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })

      // States
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })

      // Districts
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })

      // Cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })

      // Status List
      .addCase(fetchStatusListCommon.fulfilled, (state, action) => {
        state.loading = false;
        state.statusList = action.payload;
      })

      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state) => {
          state.loading = false;
          // state.error = action.payload as string;
        }
      );
  },
});

export const { resetStateList, resetDistrictList, resetCityList } =
  commonLocationSlicePatient.actions;

// Delete Patient Company State
interface DeletePatientCompanyState {
  data: Array<any> | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialDeletePatientCompanyState: DeletePatientCompanyState = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

export const deletePatientCompanySlice = createSlice({
  name: "deletePatientCompany",
  initialState: initialDeletePatientCompanyState,
  reducers: {
    resetDeletePatientCompanyState: (state) => {
      state.data = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePatientCompany.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deletePatientCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(deletePatientCompany.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeletePatientCompanyState } =
  deletePatientCompanySlice.actions;

export default patientCompanySlice.reducer;
