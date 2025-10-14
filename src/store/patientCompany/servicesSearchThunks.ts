import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_TENANT, API_VERSION } from "@/utils/constants";
import { PatientCompanyMasterService } from "@/services/api-client";
import { GetServicesOrDepartmentsResponse, SearchServiceOrServiceGroupResponse } from "@/services/api-client/services/PatientCompanyMasterService";

export const fetchServicesOrDepartments = createAsyncThunk<
  GetServicesOrDepartmentsResponse,
  { version?: string; tenant?: string; name?: string },
  { rejectValue: string }
>(
  "servicesSearch/fetchServicesOrDepartments",
  async ({ version = API_VERSION, tenant = API_TENANT, name }, { rejectWithValue }) => {
    try {
      const response = await PatientCompanyMasterService.getApiVPatientCompanyMasterGetServicesOrDepartments(
        version,
        tenant,
        name
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage ||
        error?.message ||
        "Failed to fetch services or departments"
      );
    }
  }
);
export const fetchServiceOrServiceGroup = createAsyncThunk<
  SearchServiceOrServiceGroupResponse,
  { version?: string; tenant?: string; hospitalId?: string; searchTerm?: string },
  { rejectValue: string }
>(
  "servicesSearch/fetchServiceOrServiceGroup",
  async ({ version = API_VERSION, tenant = API_TENANT, hospitalId, searchTerm }, { rejectWithValue }) => {
    try { 
      const response = await PatientCompanyMasterService.getApiVPatientCompanyMasterSearchServiceOrServiceGroup(
        version,
        tenant,
        hospitalId,
        searchTerm
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage ||
        error?.message ||
        "Failed to fetch service or service group"
      );
    }
  }
);
