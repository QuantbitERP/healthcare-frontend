import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRateSettingsList,
  fetchHospitals,
  fetchHospitalDepartments,
  fetchHospitalRateNames,
  fetchHospitalDoctors,
  fetchHospitalServices,
  fetchBillingClasses,
  saveRateSetting,
  updateRateSetting,
  fetchRateSettingById,
  fetchRateTypes,
  fetchRateSettingEnum,
  fetchStatuses,
  fetchModifiedByUsers,
  fetchCreatedByUsers,
  exportRateSettingsExcel,
  RateSettingItem,
  FilterOption,
} from "./actions/rateSettingsActions";

interface RateSettingsState {
  list: RateSettingItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  // Filter options
  hospitals: FilterOption[];
  departments: FilterOption[];
  rateNames: FilterOption[];
  doctors: FilterOption[];
  services: any[];
  billingClasses: FilterOption[];
  rateTypes: FilterOption[];
  statuses: FilterOption[];
  modifiedByUsers: FilterOption[];
  createdByUsers: FilterOption[];
  rateCategory: FilterOption[];
  // Edit mode data
  editData: any | null;
  editLoading: boolean;
  // Loading states for filter options
  filterOptionsLoading: boolean;
  // Export state
  exportLoading: boolean;
  exportError: string | null;
}

const initialState: RateSettingsState = {
  list: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  // Filter options
  hospitals: [],
  departments: [],
  rateNames: [],
  doctors: [],
  services: [],
  billingClasses: [],
  rateTypes: [],
  rateCategory: [],
  statuses: [],
  modifiedByUsers: [],
  createdByUsers: [],
  // Edit mode data
  editData: null,
  editLoading: false,
  // Loading states for filter options
  filterOptionsLoading: false,
  // Export state
  exportLoading: false,
  exportError: null,
};

const rateSettingsSlice = createSlice({
  name: "rateSettings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAll: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRateSettingsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRateSettingsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data?.items || [];
        state.totalCount = action.payload.data.metadata.page?.totalPages || 0;
        state.currentPage = action.payload.data?.metadata.page?.currentPage || 1;
        state.totalPages = action.payload.data?.metadata.page?.totalPages || 1;
        state.error = null;
      })
      .addCase(fetchRateSettingsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rate settings";
      })
      // Filter options reducers
      .addCase(fetchHospitals.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.hospitals = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch hospitals";
      })
      .addCase(fetchHospitalDepartments.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalDepartments.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.departments = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchHospitalDepartments.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch hospital departments";
      })
      .addCase(fetchHospitalRateNames.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalRateNames.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.rateNames = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchHospitalRateNames.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch hospital rate names";
      })
      .addCase(fetchHospitalDoctors.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalDoctors.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.doctors = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchHospitalDoctors.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch hospital doctors";
      })
      .addCase(fetchHospitalServices.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalServices.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.services = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchHospitalServices.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch hospital services";
      })
      .addCase(fetchBillingClasses.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchBillingClasses.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.billingClasses = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchBillingClasses.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch billing classes";
      })
      .addCase(fetchRateTypes.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchRateTypes.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.rateCategory = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchRateTypes.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch rate types";
      })
      .addCase(fetchRateSettingEnum.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchRateSettingEnum.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.rateTypes = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchRateSettingEnum.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch rate setting enum";
      })
      .addCase(fetchStatuses.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.statuses = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch statuses";
      })
      .addCase(fetchModifiedByUsers.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchModifiedByUsers.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.modifiedByUsers = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchModifiedByUsers.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch modified by users";
      })
      .addCase(fetchCreatedByUsers.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchCreatedByUsers.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.createdByUsers = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchCreatedByUsers.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || "Failed to fetch created by users";
      })
      .addCase(saveRateSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRateSetting.fulfilled, (state, _action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveRateSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save rate setting";
      })
      .addCase(updateRateSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRateSetting.fulfilled, (state, _action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRateSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update rate setting";
      })
      .addCase(fetchRateSettingById.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(fetchRateSettingById.fulfilled, (state, action) => {
        state.editLoading = false;
        state.editData = action.payload;
        state.error = null;
      })
      .addCase(fetchRateSettingById.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload || "Failed to fetch rate setting";
      })
      .addCase(exportRateSettingsExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportRateSettingsExcel.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportError = null;
      })
      .addCase(exportRateSettingsExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || "Failed to export rate settings to Excel";
      });
  },
});

export const { clearError, clearAll } = rateSettingsSlice.actions;
export default rateSettingsSlice.reducer;
