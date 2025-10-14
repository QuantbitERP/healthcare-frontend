import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addService,
  fetchCodeTypes,
  fetchDepartments,
  fetchHospitals,
  fetchOperationCategories,
  fetchRepeatableTypes,
  fetchRestrictionTypes,
  fetchServiceGroups,
  fetchServiceList,
  fetchServiceRates,
  fetchServiceStats,
  fetchStatuses,
  fetchSubDepartments,
  fetchSubServiceGroups,
  fetchSubSubDepartments,
  fetchTimeDaysList,
  getServiceInfo,
  fetchCompositeServiceList,
  Meta,
  Service,
  ServiceStats,
  fetchEmployees,
} from "./actions/serviceActions";

interface ServiceState {
  list: Service[];
  meta: Meta;
  stats: ServiceStats;
  loading: boolean;
  error: string | null;
  addServiceLoading: boolean;
  addServiceError: string | null;
  serviceInfo?: Service | null;
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
  list: [],
  meta: {
    total_count: 0,
    total_pages: 0,
    current_page: 0,
    per_page: 0,
  },
  stats: {
    total_count: 0,
    active_count: 0,
    deactive_count: 0,
  },
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
  loading: false,
  error: null,
  addServiceLoading: false,
  addServiceError: null,
  serviceInfo: null,
};

const serviceSlice = createSlice({
  name: "services",
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
      // Service List
      .addCase(fetchServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServiceList.fulfilled,
        (state, action: PayloadAction<{ services: Service[]; meta: Meta }>) => {
          state.loading = false;
          state.list = action.payload.services;
          state.meta = action.payload.meta;
        }
      )
      .addCase(fetchServiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching service list";
      })

      // Service Stats
      .addCase(fetchServiceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServiceStats.fulfilled,
        (state, action: PayloadAction<ServiceStats>) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )
      .addCase(fetchServiceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching service stats";
      })

      // Add Service
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding service";
      })

      // Service Info
      .addCase(getServiceInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getServiceInfo.fulfilled,
        (state, action: PayloadAction<Service>) => {
          state.loading = false;
          state.serviceInfo = action.payload;
        }
      )
      .addCase(getServiceInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching service info";
      })

      .addCase(fetchDepartments.pending, setLoading)
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, setError)

      // SubDepartments
      .addCase(fetchSubDepartments.pending, setLoading)
      .addCase(fetchSubDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.subDepartments = action.payload;
      })
      .addCase(fetchSubDepartments.rejected, setError)

      .addCase(fetchSubSubDepartments.pending, setLoading)
      .addCase(fetchSubSubDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.subSubDepartments = action.payload;
      })
      .addCase(fetchSubSubDepartments.rejected, setError)

      // Statuses
      .addCase(fetchStatuses.pending, setLoading)
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, setError)

      // CodeTypes
      .addCase(fetchCodeTypes.pending, setLoading)
      .addCase(fetchCodeTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.codeTypes = action.payload;
      })
      .addCase(fetchCodeTypes.rejected, setError)

      // Hospitals
      .addCase(fetchHospitals.pending, setLoading)
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, setError)

      // Operation Categories
      .addCase(fetchOperationCategories.pending, setLoading)
      .addCase(fetchOperationCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.operationCategories = action.payload;
      })
      .addCase(fetchOperationCategories.rejected, setError)

      // Service Rates
      .addCase(fetchServiceRates.pending, setLoading)
      .addCase(fetchServiceRates.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRates = action.payload;
      })
      .addCase(fetchServiceRates.rejected, (state, _action) => {
        state.loading = false;
        state.serviceRates = [];
      })

      // Service Groups
      .addCase(fetchServiceGroups.pending, setLoading)
      .addCase(fetchServiceGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceGroups = action.payload;
      })
      .addCase(fetchServiceGroups.rejected, setError)

      // Sub Service Groups
      .addCase(fetchSubServiceGroups.pending, setLoading)
      .addCase(fetchSubServiceGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.subServiceGroups = action.payload;
      })
      .addCase(fetchSubServiceGroups.rejected, setError)

      .addCase(fetchRestrictionTypes.pending, setLoading)
      .addCase(fetchRestrictionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.restrictionTypes = action.payload;
      })
      .addCase(fetchRestrictionTypes.rejected, setError)

      .addCase(fetchRepeatableTypes.pending, setLoading)
      .addCase(fetchRepeatableTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.repeatableTypes = action.payload;
      })
      .addCase(fetchRepeatableTypes.rejected, setError)

      .addCase(fetchTimeDaysList.pending, setLoading)
      .addCase(fetchTimeDaysList.fulfilled, (state, action) => {
        state.loading = false;
        state.timeDaysList = action.payload;
      })
      .addCase(fetchTimeDaysList.rejected, setError)

      .addCase(fetchCompositeServiceList.pending, setLoading)
      .addCase(fetchCompositeServiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.compositeServiceList = action.payload;
      })
      .addCase(fetchCompositeServiceList.rejected, setError)

      .addCase(fetchEmployees.pending, setLoading)
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
      })
      .addCase(fetchEmployees.rejected, setError);
  },
});

export default serviceSlice.reducer;
