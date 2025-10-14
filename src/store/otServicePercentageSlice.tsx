import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOTServicePercentageList,
  fetchApplicableForOptions,
  fetchHospitals,
  fetchDepartments,
  fetchRateNames,
  fetchCompanies,
  fetchCreatedByList,
  fetchModifiedByList,
  fetchServices,
  fetchBillingClasses,
  saveOTServicePercentage,
  updateOTServicePercentage,
  deleteOTServicePercentage,
  exportOTServicePercentageExcel,
  fetchOTServicePercentageById,
  fetchOperationCategories,
  OTServicePercentageItem,
  FilterOption,
  OTServicePercentageDetail,
} from "./actions/otServicePercentageActions";

interface OTServicePercentageState {
  list: OTServicePercentageItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  applicableForOptions: FilterOption[];
  hospitals: FilterOption[];
  departments: FilterOption[];
  rateNames: FilterOption[];
  companies: FilterOption[];
  services: FilterOption[];
  createdByList: FilterOption[];
  modifiedByList: FilterOption[];
  billingClasses: FilterOption[];
  operationCategories: FilterOption[];
  detail: OTServicePercentageDetail | null;
  // Export state
  exportLoading: boolean;
  exportError: string | null;
}

// Initial State
const initialState: OTServicePercentageState = {
  list: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  applicableForOptions: [],
  hospitals: [],
  departments: [],
  rateNames: [],
  companies: [],
  services: [],
  createdByList: [],
  modifiedByList: [],
  billingClasses: [],
  operationCategories: [],
  detail: null,
  // Export state
  exportLoading: false,
  exportError: null,
};

const otServicePercentageSlice = createSlice({
  name: "otServicePercentage",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearList: (state) => {
      state.list = [];
    },
    clearAll: (state) => {
      state.list = [];
      state.applicableForOptions = [];
      state.hospitals = [];
      state.departments = [];
      state.rateNames = [];
      state.companies = [];
      state.services = [];
      state.createdByList = [];
      state.modifiedByList = [];
      state.billingClasses = [];
      state.operationCategories = [];
      state.detail = null;
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };

    builder
      // Main list
      .addCase(fetchOTServicePercentageList.pending, setLoading)
      .addCase(fetchOTServicePercentageList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data?.items || [];
        // Extract pagination data from metadata.page
        const pageData = action.payload.data?.metadata?.page;
        state.totalCount = pageData?.totalCount || 0;
        state.currentPage = pageData?.currentPage || 1;
        state.totalPages = pageData?.totalPages || 1;
      })
      .addCase(fetchOTServicePercentageList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Applicable For Options
      .addCase(fetchApplicableForOptions.fulfilled, (state, action) => {
        state.applicableForOptions = action.payload.data.items;
      })
      .addCase(fetchApplicableForOptions.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Hospitals
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload.data.items;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Departments
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload.data.items;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Rate Names
      .addCase(fetchRateNames.fulfilled, (state, action) => {
        state.rateNames = action.payload.data.items;
      })
      .addCase(fetchRateNames.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Companies
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload.data.items;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Services
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload.data || [];
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Created By List
      .addCase(fetchCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload.data.items;
      })
      .addCase(fetchCreatedByList.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Modified By List
      .addCase(fetchModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload.data.items;
      })
      .addCase(fetchModifiedByList.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Billing Classes
      .addCase(fetchBillingClasses.fulfilled, (state, action) => {
        state.billingClasses = action.payload;
      })
      .addCase(fetchBillingClasses.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Operation Categories
      .addCase(fetchOperationCategories.fulfilled, (state, action) => {
        state.operationCategories = action.payload.data.items;
      })
      .addCase(fetchOperationCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Save OT Service Percentage
      .addCase(saveOTServicePercentage.pending, setLoading)
      .addCase(saveOTServicePercentage.fulfilled, (state) => {
        state.loading = false;
        // You can add success handling here if needed
      })
      .addCase(saveOTServicePercentage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update OT Service Percentage
      .addCase(updateOTServicePercentage.pending, setLoading)
      .addCase(updateOTServicePercentage.fulfilled, (state) => {
        state.loading = false;
        // You can add success handling here if needed
      })
      .addCase(updateOTServicePercentage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete OT Service Percentage
      .addCase(deleteOTServicePercentage.pending, setLoading)
      .addCase(deleteOTServicePercentage.fulfilled, (state) => {
        state.loading = false;
        // You can add success handling here if needed
      })
      .addCase(deleteOTServicePercentage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Export OT Service Percentage Excel
      .addCase(exportOTServicePercentageExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportOTServicePercentageExcel.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportError = null;
      })
      .addCase(exportOTServicePercentageExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload as string;
      })

      // Fetch OT Service Percentage by ID
      .addCase(fetchOTServicePercentageById.pending, setLoading)
      .addCase(fetchOTServicePercentageById.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchOTServicePercentageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearList, clearAll } =
  otServicePercentageSlice.actions;
export default otServicePercentageSlice.reducer;
