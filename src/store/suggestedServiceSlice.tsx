import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSuggestedServicesList,
  exportSuggestedServicesExcel,
  fetchVisitTypes,
  fetchPatientCategories,
  fetchPatientCompanies,
  fetchWards,
  fetchRoomsByWard,
  fetchBedsByRoom,
  fetchCreatedByUsers,
  fetchModifiedByUsers,
  fetchServiceDetails,
  fetchRequisitionDetails,
  SuggestedServiceItem,
  ServiceDetails,
  RequisitionDetail,
  fetchPatientWiseInvestigation,
  searchServices,
  fetchPriorityOptions,
  fetchDepartmentOptions,
  fetchDoctorList,
  fetchProfileServices,
  updateRequisition,
  createRequisition,
  deleteSuggestServices,
} from "./actions/suggestedServiceActions";

interface SuggestedServiceState {
  list: SuggestedServiceItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Filter data
  visitTypes: any[];
  patientCategories: any[];
  patientCompanies: any[];
  wards: any[];
  rooms: any[];
  beds: any[];
  createdByUsers: any[];
  modifiedByUsers: any[];
  // Individual service details
  serviceDetails: ServiceDetails | null;
  serviceDetailsLoading: boolean;
  serviceDetailsError: string | null;
  // Requisition details
  requisitionDetails: RequisitionDetail[];
  requisitionDetailsLoading: boolean;
  requisitionDetailsError: string | null;
  // Client-side pagination metadata
  requisitionTotalCount: number;
  requisitionTotalPages: number;
  requisitionCurrentPage: number;
  requisitionPageSize: number;
  // Client-side search term
  requisitionSearchTerm: string;
  // Add new state properties for patient-wise investigation
  patientWiseInvestigation: any | null;
  patientWiseInvestigationLoading: boolean;
  patientWiseInvestigationError: string | null;
  // Search functionality
  searchTerm: string;
  searchResults: SuggestedServiceItem[];
  searchLoading: boolean;
  searchError: string | null;
  // Priority options
  priorityOptions: any[];
  priorityOptionsLoading: boolean;
  priorityOptionsError: string | null;
  // Department options
  departmentOptions: any[];
  departmentOptionsLoading: boolean;
  departmentOptionsError: string | null;
  // Doctor list
  doctorList: any[];
  doctorListLoading: boolean;
  doctorListError: string | null;
  // Profile services
  profileServices: any | null;
  profileServicesLoading: boolean;
  profileServicesError: string | null;
  // Update requisition
  updateRequisitionLoading: boolean;
  updateRequisitionError: string | null;
  // Create requisition
  createRequisitionLoading: boolean;
  createRequisitionError: string | null;
}

// Initial State
const initialState: SuggestedServiceState = {
  list: [],
  loading: false,
  error: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  // Filter data
  visitTypes: [],
  patientCategories: [],
  patientCompanies: [],
  wards: [],
  rooms: [],
  beds: [],
  createdByUsers: [],
  modifiedByUsers: [],
  // Individual service details
  serviceDetails: null,
  serviceDetailsLoading: false,
  serviceDetailsError: null,
  // Requisition details
  requisitionDetails: [],
  requisitionDetailsLoading: false,
  requisitionDetailsError: null,
  // Client-side pagination metadata
  requisitionTotalCount: 0,
  requisitionTotalPages: 0,
  requisitionCurrentPage: 1,
  requisitionPageSize: 10,
  // Client-side search term
  requisitionSearchTerm: "",
  // Add new state properties for patient-wise investigation
  patientWiseInvestigation: null,
  patientWiseInvestigationLoading: false,
  patientWiseInvestigationError: null,
  // Search functionality
  searchTerm: "",
  searchResults: [],
  searchLoading: false,
  searchError: null,
  // Priority options
  priorityOptions: [],
  priorityOptionsLoading: false,
  priorityOptionsError: null,
  // Doctor list
  doctorList: [],
  doctorListLoading: false,
  doctorListError: null,
  // Profile services
  profileServices: null,
  profileServicesLoading: false,
  profileServicesError: null,
  // Update requisition
  updateRequisitionLoading: false,
  updateRequisitionError: null,
  // Create requisition
  createRequisitionLoading: false,
  createRequisitionError: null,
  // Department options
  departmentOptions: [],
  departmentOptionsLoading: false,
  departmentOptionsError: null,
};

const suggestedServiceSlice = createSlice({
  name: "suggestedService",
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
      state.totalCount = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.pageSize = 10;
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearRooms: (state) => {
      state.rooms = [];
    },
    clearBeds: (state) => {
      state.beds = [];
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    // Requisition pagination actions
    setRequisitionPage: (state, action) => {
      state.requisitionCurrentPage = action.payload;
    },
    setRequisitionPageSize: (state, action) => {
      state.requisitionPageSize = action.payload;
      state.requisitionCurrentPage = 1; // Reset to first page when page size changes
    },
    setRequisitionSearchTerm: (state, action) => {
      state.requisitionSearchTerm = action.payload;
      state.requisitionCurrentPage = 1; // Reset to first page when searching
    },
    clearRequisitionDetails: (state) => {
      state.requisitionDetails = [];
      state.requisitionTotalCount = 0;
      state.requisitionTotalPages = 0;
      state.requisitionCurrentPage = 1;
      state.requisitionDetailsError = null;
      state.requisitionSearchTerm = "";
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };

    builder
      // Main list
      .addCase(fetchSuggestedServicesList.pending, setLoading)
      .addCase(fetchSuggestedServicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.items;
        state.totalCount = action.payload.data.metadata.page.pageSize * action.payload.data.metadata.page.totalPages;
        state.totalPages = action.payload.data.metadata.page.totalPages;
        state.currentPage = action.payload.data.metadata.page.currentPage;
        state.pageSize = action.payload.data.metadata.page.pageSize;
      })
      .addCase(fetchSuggestedServicesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Export Excel
      .addCase(exportSuggestedServicesExcel.pending, setLoading)
      .addCase(exportSuggestedServicesExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportSuggestedServicesExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Filter data
      .addCase(fetchVisitTypes.fulfilled, (state, action) => {
        state.visitTypes = action.payload.data?.items || [];
      })
      .addCase(fetchPatientCategories.fulfilled, (state, action) => {
        state.patientCategories = action.payload.data?.items || [];
      })
      .addCase(fetchPatientCompanies.fulfilled, (state, action) => {
        state.patientCompanies = action.payload.data?.items || [];
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.wards = action.payload.data?.items || [];
      })
      .addCase(fetchRoomsByWard.fulfilled, (state, action) => {
        state.rooms = action.payload.data?.items || [];
      })
      .addCase(fetchBedsByRoom.fulfilled, (state, action) => {
        state.beds = action.payload.data?.items || [];
      })
      .addCase(fetchCreatedByUsers.fulfilled, (state, action) => {
        state.createdByUsers = action.payload.data?.items || [];
      })
      .addCase(fetchModifiedByUsers.fulfilled, (state, action) => {
        state.modifiedByUsers = action.payload.data?.items || [];
      })
      // Service details
      .addCase(fetchServiceDetails.pending, (state) => {
        state.serviceDetailsLoading = true;
        state.serviceDetailsError = null;
      })
      .addCase(fetchServiceDetails.fulfilled, (state, action) => {
        state.serviceDetailsLoading = false;
        state.serviceDetails = action.payload.data;
      })
      .addCase(fetchServiceDetails.rejected, (state, action) => {
        state.serviceDetailsLoading = false;
        state.serviceDetailsError = action.payload as string;
      })
      // Requisition details
      .addCase(fetchRequisitionDetails.pending, (state) => {
        state.requisitionDetailsLoading = true;
        state.requisitionDetailsError = null;
      })
      .addCase(fetchRequisitionDetails.fulfilled, (state, action) => {
        state.requisitionDetailsLoading = false;
        // Store all requisition data from API
        state.requisitionDetails = action.payload.data || [];
        state.requisitionCurrentPage = 1;
        state.requisitionSearchTerm = "";
        // Total count is the length of all data (client-side pagination)
        state.requisitionTotalCount = state.requisitionDetails.length;
        state.requisitionTotalPages = Math.ceil(state.requisitionDetails.length / state.requisitionPageSize);
      })
      .addCase(fetchRequisitionDetails.rejected, (state, action) => {
        state.requisitionDetailsLoading = false;
        state.requisitionDetailsError = action.payload as string;
      })
      // Add new cases for patient-wise investigation
      .addCase(fetchPatientWiseInvestigation.pending, (state) => {
        state.patientWiseInvestigationLoading = true;
        state.patientWiseInvestigationError = null;
      })
      .addCase(fetchPatientWiseInvestigation.fulfilled, (state, action) => {
        state.patientWiseInvestigationLoading = false;
        state.patientWiseInvestigation = action.payload.data;
      })
      .addCase(fetchPatientWiseInvestigation.rejected, (state, action) => {
        state.patientWiseInvestigationLoading = false;
        state.patientWiseInvestigationError = action.payload as string;
      })
      // Search functionality
      .addCase(searchServices.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data.items;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      })
      // Priority options
      .addCase(fetchPriorityOptions.pending, (state) => {
        state.priorityOptionsLoading = true;
        state.priorityOptionsError = null;
      })
      .addCase(fetchPriorityOptions.fulfilled, (state, action) => {
        state.priorityOptionsLoading = false;
        state.priorityOptions = action.payload.data.items;
      })
      .addCase(fetchPriorityOptions.rejected, (state, action) => {
        state.priorityOptionsLoading = false;
        state.priorityOptionsError = action.payload as string;
      })
      // Doctor list
      .addCase(fetchDoctorList.pending, (state) => {
        state.doctorListLoading = true;
        state.doctorListError = null;
      })
      .addCase(fetchDoctorList.fulfilled, (state, action) => {
        state.doctorListLoading = false;
        state.doctorList = action.payload.data.items;
      })
      .addCase(fetchDoctorList.rejected, (state, action) => {
        state.doctorListLoading = false;
        state.doctorListError = action.payload as string;
      })
      // Profile services
      .addCase(fetchProfileServices.pending, (state) => {
        state.profileServicesLoading = true;
        state.profileServicesError = null;
      })
      .addCase(fetchProfileServices.fulfilled, (state, action) => {
        state.profileServicesLoading = false;
        state.profileServices = action.payload.data;
      })
      .addCase(fetchProfileServices.rejected, (state, action) => {
        state.profileServicesLoading = false;
        state.profileServicesError = action.payload as string;
      })
      // Department options
      .addCase(fetchDepartmentOptions.pending, (state) => {
        state.departmentOptionsLoading = true;
        state.departmentOptionsError = null;
      })
      .addCase(fetchDepartmentOptions.fulfilled, (state, action) => {
        state.departmentOptionsLoading = false;
        state.departmentOptions = action.payload.data.items;
      })
      .addCase(fetchDepartmentOptions.rejected, (state, action) => {
        state.departmentOptionsLoading = false;
        state.departmentOptionsError = action.payload as string;
      })
      // Update requisition
      .addCase(updateRequisition.pending, (state) => {
        state.updateRequisitionLoading = true;
        state.updateRequisitionError = null;
      })
      .addCase(updateRequisition.fulfilled, (state) => {
        state.updateRequisitionLoading = false;
      })
      .addCase(updateRequisition.rejected, (state, action) => {
        state.updateRequisitionLoading = false;
        state.updateRequisitionError = action.payload as string;
      })
      // Create requisition
      .addCase(createRequisition.pending, (state) => {
        state.createRequisitionLoading = true;
        state.createRequisitionError = null;
      })
      .addCase(createRequisition.fulfilled, (state) => {
        state.createRequisitionLoading = false;
      })
      .addCase(createRequisition.rejected, (state, action) => {
        state.createRequisitionLoading = false;
        state.createRequisitionError = action.payload as string;
      })
      // Delete suggest services
      .addCase(deleteSuggestServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSuggestServices.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSuggestServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearList,
  clearAll,
  setPage,
  setPageSize,
  clearRooms,
  clearBeds,
  setSearchTerm,
  clearSearchResults,
  clearSearchError,
  // Requisition pagination actions
  setRequisitionPage,
  setRequisitionPageSize,
  setRequisitionSearchTerm,
  clearRequisitionDetails,
} = suggestedServiceSlice.actions;

export default suggestedServiceSlice.reducer;
