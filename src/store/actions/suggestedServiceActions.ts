import { createAsyncThunk } from "@reduxjs/toolkit";
import { OpdBillService, PatientCompanyMasterService } from "@/services/api-client";
import { RoomService, BedService, InvestigationRequisitionService } from "@/services/api-client";

function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}

// Types for Suggested Services
export type SuggestedServiceItem = {
  patientId: string;
  patientName: string;
  uhid: string;
  visitId: string;
  visitType: string;
  patientCategory: string;
  company: string;
  visitNo: string;
  wardNo: string;
  roomNo: string;
  bedNo: string;
  admittedDoctor: string;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
};

// Types for Individual Service Details
export type ServiceDetails = {
  id: string;
  name: string;
  uhid: string;
  visitId: string;
  visitNo: string;
  age: number;
  gender: string;
  contactNumber: string | null;
  aadhaarCard: string;
  abhaid: string;
  patientCategory: string;
  patientCompany: string;
  admittedBillingClass: string;
  currentBillingClass: string;
  visitType: string;
  ward: string;
  room: string;
  bed: string;
  registrationDate: string;
  visitDate: string;
  visitTime: string;
  admittedDoctor: string;
  consultingDoctor: string;
  lastVisitInfo: {
    visitDate: string;
    visitTime: string;
    visitRemark: string | null;
    visitType: string;
    consultingDoctor: string;
    billingClass: string;
    class: string;
    createdBy: string;
  };
};

// Types for Requisition Details
export type RequisitionDetail = {
  requisitionNo: string;
  requisitionDate: string;
  modifiedBy: string;
  modifiedOn: string;
  createdOn: string | null;
  createdBy: string | null;
  requisitionId: string;
  investigationrequisitionId: string;
};

export type Meta = {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: string;
};

export type SuggestedServiceResponse = {
  data: {
    items: SuggestedServiceItem[];
    metadata: {
      page: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    };
  };
  isError: boolean;
  errorMessage: string;
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
  errorCode: string;
};

export type ServiceDetailsResponse = {
  data: ServiceDetails;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

export type RequisitionDetailsResponse = {
  data: RequisitionDetail[];
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

// Filter option types
export type FilterOption = {
  key: string;
  value: string;
};

export type FilterOptionsResponse = {
  data: {
    items: FilterOption[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

// API endpoints
const SUGGESTED_SERVICES_LIST_API = generateApiURL("SuggestServices/list");
const SUGGESTED_SERVICES_DETAILS_API = generateApiURL("SuggestServices/id");
const SUGGESTED_SERVICES_REQUISITION_DETAILS_API = generateApiURL("SuggestServices/GetRequisitionDetailsByPatientVisitID");
const SUGGESTED_SERVICES_SEARCH_API = generateApiURL("SuggestServices/SearchServiceslist");
const SUGGESTED_GET_PATIENT_WISE_INVESTIGATION_API = generateApiURL("SuggestServices/GetPatinetWiseInvestigationById");
const SUGGESTED_GET_PRIORITY_OPTIONS_API = generateApiURL("SuggestServices/PriorityEnum");
const SUGGESTED_GET_DOCTOR_LIST_API = generateApiURL("Hospital/HospitalDoctors");
const SUGGESTED_GET_PROFILE_SERVICES_API = generateApiURL("SuggestServices/GetProfileServicesByHospitalserviceId");
const SUGGESTED_UPDATE_REQUISITION_API = generateApiURL("SuggestServices");
const SUGGESTED_CREATE_REQUISITION_API = generateApiURL("SuggestServices/save");
const SUGGESTED_DELETE_API = generateApiURL("SuggestServices");
const GET_WARD_LIST_API = generateApiURL("Ward/wardlist");

// Request payload type
export type SuggestedServiceListRequest = {
  searchTerm?: string;
  visitType?: number[];
  patientCategory?: string[];
  patientCompany?: string[];
  ward?: string[];
  rooms?: string[];
  beds?: string[];
  admittedDoctor?: string[];
  modifiedByList?: string[];
  createdByList?: string[];
  page?: number;
  pageSize?: number;
  sort_by?: string;
  sort_order?: string;
  fromDate?: string;
  toDate?: string;
};

// Delete request payload type
export type SuggestedServiceDeleteRequest = {
  ids: string[];
};
//
// Fetch Department Options
export const fetchDepartmentOptions = createAsyncThunk(
  "suggestedService/fetchDepartmentOptions",
  async (hospitalId: string, { rejectWithValue }) => {
    console.log(hospitalId,'hospitalId')
    try {
      const apiUrl = generateApiURL(`Hospital/HospitalwiseHospitaldepartments/${hospitalId}`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "accept": "text/plain",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch department options");
    }
  }
);

// Fetch Suggested Services List
export const fetchSuggestedServicesList = createAsyncThunk<
  SuggestedServiceResponse,
  SuggestedServiceListRequest,
  { rejectValue: string }
>("suggestedService/fetchList", async (params, { rejectWithValue }) => {
  try {
    const response = await fetch(SUGGESTED_SERVICES_LIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify({
        searchTerm: params.searchTerm || "",
        visitType: params.visitType || [],
        patientCategory: params.patientCategory || [],
        patientCompany: params.patientCompany || [],
        ward: params.ward || [],
        rooms: params.rooms || [],
        beds: params.beds || [],
        admittedDoctor: params.admittedDoctor || [],
        modifiedByList: params.modifiedByList || [],
        createdByList: params.createdByList || [],
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as SuggestedServiceResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch suggested services list");
  }
});

// Export Suggested Services to Excel
export const exportSuggestedServicesExcel = createAsyncThunk<
  Blob,
  SuggestedServiceListRequest,
  { rejectValue: string }
>("suggestedService/exportExcel", async (params, { rejectWithValue }) => {
  try {
    const response = await fetch(SUGGESTED_SERVICES_LIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: JSON.stringify({
        searchTerm: params.searchTerm || "",
        visitType: params.visitType || [],
        patientCategory: params.patientCategory || [],
        patientCompany: params.patientCompany || [],
        ward: params.ward || [],
        rooms: params.rooms || [],
        beds: params.beds || [],
        admittedDoctor: params.admittedDoctor || [],
        modifiedByList: params.modifiedByList || [],
        createdByList: params.createdByList || [],
        page: params.page || 1,
        pageSize: params.pageSize || 1000, // Export more data
        sort_by: params.sort_by || "modifiedOn",
        sort_order: params.sort_order || "desc",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to export suggested services");
  }
});

// Fetch visit types for filters
export const fetchVisitTypes = createAsyncThunk(
  "suggestedService/fetchVisitTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.getApiVOpdBillOpdbillsPatientVisitType("1", "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch visit types");
    }
  }
);

// Fetch patient categories for filters
export const fetchPatientCategories = createAsyncThunk(
  "suggestedService/fetchPatientCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.getApiVOpdBillOpdbillsPatientCategories("1", "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch patient categories");
    }
  }
);

// Fetch patient companies for filters
export const fetchPatientCompanies = createAsyncThunk(
  "suggestedService/fetchPatientCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PatientCompanyMasterService.getApiVPatientCompanyMasterPatientcompanies("1", "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch patient companies");
    }
  }
);

// Fetch wards for filters
export const fetchWards = createAsyncThunk(
  "suggestedService/fetchWards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(GET_WARD_LIST_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch wards");
    }
  }
);

// Fetch rooms by ward for filters
export const fetchRoomsByWard = createAsyncThunk(
  "suggestedService/fetchRoomsByWard",
  async (wardIds: string[], { rejectWithValue }) => {
    try {
      const response = await RoomService.postApiVRoomRoomlistByWard("1", "", { wardIds });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch rooms");
    }
  }
);

// Fetch beds by room for filters
export const fetchBedsByRoom = createAsyncThunk(
  "suggestedService/fetchBedsByRoom",
  async (roomIds: string[], { rejectWithValue }) => {
    try {
      const response = await BedService.postApiVBedBedlistByRoom("1", "", roomIds);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch beds");
    }
  }
);

// Fetch created by users for filters
export const fetchCreatedByUsers = createAsyncThunk(
  "suggestedService/fetchCreatedByUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await InvestigationRequisitionService.getApiVInvestigationRequisitionCreatedByUsers("1", "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch created by users");
    }
  }
);

// Fetch modified by users for filters
export const fetchModifiedByUsers = createAsyncThunk(
  "suggestedService/fetchModifiedByUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await InvestigationRequisitionService.getApiVInvestigationRequisitionModifiedByUsers("1", "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch modified by users");
    }
  }
);

// Fetch individual service details by Patient ID and Visit ID
export const fetchServiceDetails = createAsyncThunk(
  "suggestedService/fetchServiceDetails",
  async (params: { patientId: string; visitId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_SERVICES_DETAILS_API}?Patientid=${params.patientId}&PatientVisitID=${params.visitId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching service details');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching service details');
    }
  }
);

// Fetch requisition details by Patient Visit ID
export const fetchRequisitionDetails = createAsyncThunk(
  "suggestedService/fetchRequisitionDetails",
  async (visitId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_SERVICES_REQUISITION_DETAILS_API}${visitId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching requisition details');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching requisition details');
    }
  }
);

// Clear rooms action
export const clearRooms = () => ({
  type: "suggestedService/clearRooms",
});

// Clear beds action
export const clearBeds = () => ({
  type: "suggestedService/clearBeds",
});

// Fetch patient-wise investigation data by investigation requisition ID
export const fetchPatientWiseInvestigation = createAsyncThunk(
  "suggestedService/fetchPatientWiseInvestigation",
  async (investigationRequisitionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_GET_PATIENT_WISE_INVESTIGATION_API}/${investigationRequisitionId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching patient-wise investigation data');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching patient-wise investigation data');
    }
  }
);

// Search services by search term
export const searchServices = createAsyncThunk(
  "suggestedService/searchServices",
  async (searchData: { searchterm: string; page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_SERVICES_SEARCH_API}`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
          searchterm: searchData.searchterm || "",
          page: searchData.page || 0,
          pageSize: searchData.pageSize || 100
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while searching services');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while searching services');
    }
  }
);

// Fetch priority options
export const fetchPriorityOptions = createAsyncThunk(
  "suggestedService/fetchPriorityOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_GET_PRIORITY_OPTIONS_API}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching priority options');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching priority options');
    }
  }
);

// Fetch doctor list
export const fetchDoctorList = createAsyncThunk(
  "suggestedService/fetchDoctorList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_GET_DOCTOR_LIST_API}/f1b0f4c7-9f66-48db-b94d-0f4ca190d477`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor list');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching doctor list');
    }
  }
);

// Fetch profile services by hospital service ID
export const fetchProfileServices = createAsyncThunk(
  "suggestedService/fetchProfileServices",
  async (hospitalServiceId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_GET_PROFILE_SERVICES_API}/${hospitalServiceId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching profile services');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching profile services');
    }
  }
);

// Update requisition
export const updateRequisition = createAsyncThunk(
  "suggestedService/updateRequisition",
  async (updateData: {
    investigationRequisitionId: string;
    billRequisitionId: string;
    hospitalId: string;
    patientvisitid: string;
    serviceDetails: any[];
    clinicalRemarks: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_UPDATE_REQUISITION_API}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Model: {
            investigationRequisitionId: updateData.investigationRequisitionId,
            billRequisitionId: updateData.billRequisitionId,
            hospitalId: updateData.hospitalId,
            patientvisitid: updateData.patientvisitid,
            serviceDetails: updateData.serviceDetails,
            clinicalRemarks: updateData.clinicalRemarks
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while updating requisition');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while updating requisition');
    }
  }
);

// Create new requisition
export const createRequisition = createAsyncThunk(
  "suggestedService/createRequisition",
  async (createData: {
    hospitalId: string;
    patientvisitid: string;
    serviceDetails: any[];
    clinicalRemarks: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SUGGESTED_CREATE_REQUISITION_API}`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: createData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while creating requisition');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating requisition');
    }
  }
);

// Delete Suggested Services
export const deleteSuggestServices = createAsyncThunk<
  any,
  SuggestedServiceDeleteRequest,
  { rejectValue: string }
>("suggestedService/delete", async (params, { rejectWithValue }) => {
  try {
    const response = await fetch(SUGGESTED_DELETE_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify({
        model: {
          ids: params.ids
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete suggest services");
  }
});
