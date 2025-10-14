import { createAsyncThunk } from "@reduxjs/toolkit";
import { PriorAuthService, SuggestServicesService } from "@/services/api-client";
import type {GetPriorAuthorizationRequestListRequestDto,KVPair, SuggestServicesGetByIdResponseDtoResultModel} from "@/services/api-client";
import { API_VERSION, API_TENANT } from "@/utils/constants";
import { priorAuthDtoResponse, PriorAuthorizationModelDto, PriorAuthorizationRequestListDto } from "@/services/api-client/models/PriorAuthorizationRequestDto";
import { OpenAPI } from "@/services/api-client";
import { request as __request } from "@/services/api-client/core/request";

// Generate PDF for prior authorization request
export const generatePriorAuthPDF = createAsyncThunk<
  Blob,
  {
    id: string;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/generatePDF",
  async ({ id, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${OpenAPI.BASE}/api/v1/PriorAuthorizationRequest/generate-pdf/${id}`,
        {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${OpenAPI.TOKEN}`,
            ...(tenant && { 'tenant': tenant }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to generate PDF");
    }
  }
);

// Fetch prior authorization request list
export const fetchPriorAuthList = createAsyncThunk<
  PriorAuthorizationRequestListDto,
  {
    tenant?: string;
    requestBody?: GetPriorAuthorizationRequestListRequestDto | null;
  },
  { rejectValue: string }
>(
  "priorAuth/fetchList",
  async ({ tenant = API_TENANT, requestBody }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.postApiVPriorAuthorizationRequestList(
        API_VERSION,
        tenant,
        requestBody
      );
      
      return response|| null;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to fetch prior auth list");
    }
  }
);

// Create new prior authorization request
export const createPriorAuth = createAsyncThunk<
  any,
  {
    tenant?: string;
    data: PriorAuthorizationModelDto;
  },
  { rejectValue: string }
>(
  "priorAuth/create",
  async ({ tenant = API_TENANT, data }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.postApiVPriorAuthorizationRequest(
        API_VERSION,
        tenant,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to create prior auth request");
    }
  }
);

// Get prior authorization request by ID
export const getPriorAuthById = createAsyncThunk<
  priorAuthDtoResponse,
  {
    id: string;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getById",
  async ({ id, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequest(
        id,
        API_VERSION,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to fetch prior auth request");
    }
  }
);

// Update prior authorization request
export const  updatePriorAuth = createAsyncThunk<
  any,
  {
    id: string;
    tenant?: string;
    data: PriorAuthorizationModelDto;
  },
  { rejectValue: string }
>(
  "priorAuth/update",
  async ({ id, tenant = API_TENANT, data }, { rejectWithValue }) => {
    try {
      // Use PUT method for updates
      const response = await PriorAuthService.putApiVPriorAuthorizationRequest(
        id,
        API_VERSION,
        tenant,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to update prior auth request");
    }
  }
);

// Delete prior authorization request (if supported by your API)
export const deletePriorAuth = createAsyncThunk<
  any,
  {
    id: string;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/delete",
  async ({ id, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      
      const response = await PriorAuthService.deleteApiVPriorAuthorizationRequest(
        API_VERSION,
        tenant,
        [id]
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to delete prior auth request");
    }
  }
);
export const getPriorAuthCreatedByList = createAsyncThunk<
  KVPair[],
  {
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getCreatedByList",
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetCreatedBy(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth created by list");
    }
  }
);

export const getPriorAuthModifiedByList = createAsyncThunk< 
  KVPair[],
  {
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getModifiedByList",
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetModifiedBy(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];      
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth modified by list");
    }
  }
);

export const getPriorAuthStatusEnum = createAsyncThunk<
  KVPair[],
  {
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getStatusEnum",
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetStatusEnum(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth status enum");
    }
  }
);
export const getPriorAuthVisitTypeList = createAsyncThunk<
  KVPair[],
  {
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getVisitTypeList",
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetVisitType(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth visit type list");
    }
  }
);
export const getPriorAuthPatientCategoryList = createAsyncThunk<
  KVPair[],
  {
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getPatientCategoryList",
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetPatientCategory(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth patient category list");
    }
  }
);
export const getPriorAuthPatientCompanyList = createAsyncThunk< 
    KVPair[],
    {
      tenant?: string;
    },
    { rejectValue: string }
>(
  "priorAuth/getPatientCompanyList",        
  async ({ tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await PriorAuthService.getApiVPriorAuthorizationRequestGetPatientCompany(
        API_VERSION,
        tenant
      );
      return response.data?.items||[];
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get prior auth patient company list");
    }
  }
);

export const getSuggestServicesById = createAsyncThunk<
  SuggestServicesGetByIdResponseDtoResultModel,
  {
    version?: string;
    patientid: string;
    patientVisitId?: string|null;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "priorAuth/getSuggestServicesById",
  async ({version = API_VERSION, patientid, patientVisitId, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await SuggestServicesService.getApiVSuggestServicesId(
        version,
        patientid,
        patientVisitId,
        tenant
      );   
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || "Failed to get suggest services by id");
    }
  }
);

// Export Prior Authorization to Excel
export const exportPriorAuthExcel = createAsyncThunk<
  Blob,
  {
    tenant?: string;
    requestBody?: GetPriorAuthorizationRequestListRequestDto;
  },
  { rejectValue: string }
>(
  "priorAuth/exportExcel",
  async ({ tenant = API_TENANT, requestBody }, { rejectWithValue }) => {
    try {
      const response = await __request(OpenAPI, {
        method: "POST",
        url: `/api/v${API_VERSION}/PriorAuthorizationRequest/export/excel`,
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "tenant": tenant,
        },
        body: requestBody || {
          pageNumber: 0,
          pageSize: 0,
          searchTerm: "",
          status: [],
          visitType: [],
          patientCategoryList: [],
          patientCompanyList: [],
          createdByList: [],
          modifiedByList: [],
        },
      });

      return response as Blob;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export prior auth to Excel");
    }
  }
);

// Export all thunks
export const priorAuthThunks = {
  fetchPriorAuthList,
  createPriorAuth,
  getPriorAuthModifiedByList,
  getPriorAuthCreatedByList,
  getPriorAuthById,
  updatePriorAuth,
  deletePriorAuth,
  getSuggestServicesById,
  exportPriorAuthExcel,
};
