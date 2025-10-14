import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCodeTypes,
  fetchCompositeServiceList,
  fetchDepartments,
  fetchEmployees,
  fetchHospitals,
  fetchOperationCategories,
  fetchRepeatableTypes,
  fetchRestrictionTypes,
  fetchServiceGroups,
  fetchServiceRates,
  fetchStatuses,
  fetchSubDepartments,
  fetchSubServiceGroups,
  fetchSubSubDepartments,
  fetchTimeDaysList,
} from "./actions/commonActions";

interface ServiceState {
  departments: ListItem[];
  subDepartments: ListItem[];
  subSubDepartments: ListItem[];
  statuses: ListItem[];
  codeTypes: ListItem[];
  hospitals: ListItem[];
  operationCategories: ListItem[];
  serviceRates: ListItem[];
  employees: ListItem[];
  serviceGroups: ListItem[];
  subServiceGroups: ListItem[];
  restrictionTypes: ListItem[];
  repeatableTypes: ListItem[];
  timeDaysList: ListItem[];
  compositeServiceList: any;
}

// ==== TYPES ====
interface ListItem {
  id: number;
  name: string;
}

export interface ServiceRate {
  id: number;
  name: string;
  amount: number;
}

// Initial State
const initialState: ServiceState = {
  timeDaysList: [],
  employees: [],
  departments: [],
  subDepartments: [],
  subSubDepartments: [],
  serviceGroups: [],
  subServiceGroups: [],
  statuses: [],
  codeTypes: [],
  hospitals: [],
  restrictionTypes: [],
  repeatableTypes: [],
  compositeServiceList: [],
  operationCategories: [],
  serviceRates: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || "Error fetching data";
    };

    builder
      .addCase(fetchDepartments.pending, setLoading)
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, setError)

      // SubDepartments
      .addCase(fetchSubDepartments.pending, setLoading)
      .addCase(fetchSubDepartments.fulfilled, (state, action) => {
        state.subDepartments = action.payload;
      })
      .addCase(fetchSubDepartments.rejected, setError)

      .addCase(fetchSubSubDepartments.pending, setLoading)
      .addCase(fetchSubSubDepartments.fulfilled, (state, action) => {
        state.subSubDepartments = action.payload;
      })
      .addCase(fetchSubSubDepartments.rejected, setError)

      // Statuses
      .addCase(fetchStatuses.pending, setLoading)
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, setError)

      // CodeTypes
      .addCase(fetchCodeTypes.pending, setLoading)
      .addCase(fetchCodeTypes.fulfilled, (state, action) => {
        state.codeTypes = action.payload;
      })
      .addCase(fetchCodeTypes.rejected, setError)

      // Hospitals
      .addCase(fetchHospitals.pending, setLoading)
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, setError)

      // Operation Categories
      .addCase(fetchOperationCategories.pending, setLoading)
      .addCase(fetchOperationCategories.fulfilled, (state, action) => {
        state.operationCategories = action.payload;
      })
      .addCase(fetchOperationCategories.rejected, setError)

      // Service Rates
      .addCase(fetchServiceRates.pending, setLoading)
      .addCase(fetchServiceRates.fulfilled, (state, action) => {
        state.serviceRates = action.payload;
      })
      .addCase(fetchServiceRates.rejected, (state, _action) => {
        state.serviceRates = [];
      })

      // Service Groups
      .addCase(fetchServiceGroups.pending, setLoading)
      .addCase(fetchServiceGroups.fulfilled, (state, action) => {
        state.serviceGroups = action.payload;
      })
      .addCase(fetchServiceGroups.rejected, setError)

      // Sub Service Groups
      .addCase(fetchSubServiceGroups.pending, setLoading)
      .addCase(fetchSubServiceGroups.fulfilled, (state, action) => {
        state.subServiceGroups = action.payload;
      })
      .addCase(fetchSubServiceGroups.rejected, setError)

      .addCase(fetchRestrictionTypes.pending, setLoading)
      .addCase(fetchRestrictionTypes.fulfilled, (state, action) => {
        state.restrictionTypes = action.payload;
      })
      .addCase(fetchRestrictionTypes.rejected, setError)

      .addCase(fetchRepeatableTypes.pending, setLoading)
      .addCase(fetchRepeatableTypes.fulfilled, (state, action) => {
        state.repeatableTypes = action.payload;
      })
      .addCase(fetchRepeatableTypes.rejected, setError)

      .addCase(fetchTimeDaysList.pending, setLoading)
      .addCase(fetchTimeDaysList.fulfilled, (state, action) => {
        state.timeDaysList = action.payload;
      })
      .addCase(fetchTimeDaysList.rejected, setError)

      .addCase(fetchCompositeServiceList.pending, setLoading)
      .addCase(fetchCompositeServiceList.fulfilled, (state, action) => {
        state.compositeServiceList = action.payload;
      })
      .addCase(fetchCompositeServiceList.rejected, setError)

      .addCase(fetchEmployees.pending, setLoading)
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload.employees;
      })
      .addCase(fetchEmployees.rejected, setError);
  },
});

export default commonSlice.reducer;
