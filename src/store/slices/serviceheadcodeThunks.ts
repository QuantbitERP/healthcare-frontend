import { createAsyncThunk } from "@reduxjs/toolkit";
import { ServiceHeadCodeService } from "@/api-client/services/ServiceHeadCodeService";
import type { ServiceHeadCodeSettingRequestDto } from "@/api-client/models/ServiceHeadCodeSettingRequestDto";
import type { KVPair } from "@/api-client/models/KVPair";
import type { KVPairListResultModelResultModel } from "@/api-client/models/KVPairListResultModelResultModel";
import type { HospitalListDto } from "@/api-client/models/HospitalListDto";

// Fetch list
export const fetchServiceHeadCodeList = createAsyncThunk(
  "serviceheadcode/fetchList",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody: any },
    { rejectWithValue }
  ) => {
    try {
    
     
      
      
      // Create validated request body with proper defaults
      const validatedRequestBody = {
        departmentId: requestBody.departmentId || null,
        hospitalId: requestBody.hospitalId || null,
        companyId: requestBody.companyId || null,
        searchTerm: requestBody.searchTerm || "",
        page: requestBody.page || 0,
        pageSize: requestBody.pageSize || 10
      };
      
      const response = await ServiceHeadCodeService.postApiVServiceHeadCodeSettingList(
        version,
        tenant,
        validatedRequestBody
      );
      
      return response;
      
    } catch  {

      return rejectWithValue("error");
    }
  }
);

// Fetch patient companies
export const fetchPatientCompanies = createAsyncThunk<
  KVPair[],
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceheadcode/fetchPatientCompanies",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response: KVPairListResultModelResultModel = await ServiceHeadCodeService.getApiVPatientCompanyMasterPatientcompanies(
        version,
        tenant
      );
      // Handle the nested response structure: data.items
      return response.data?.items || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch patient companies");
    }
  }
);

// Save
export const saveServiceHeadCode = createAsyncThunk(
  "serviceheadcode/save",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody: Array<ServiceHeadCodeSettingRequestDto> },
    { rejectWithValue }
  ) => {
    try {

      
      const response = await ServiceHeadCodeService.postApiVServiceHeadCodeSettingSave(
        version,
        tenant,
        requestBody
      );
      
      
      return response;
      
    } catch (error: any) {
      
      
      // Return detailed error information
      const errorMessage = error?.response?.data?.ErrorMessage || 
                          error?.response?.data?.message || 
                          error?.message || 
                          "Failed to save service head code";
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Export to Excel
export const exportServiceHeadCodeExcel = createAsyncThunk(
  "serviceheadcode/exportExcel",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      return await ServiceHeadCodeService.postApiVServiceHeadCodeSettingServiceHeadCodeSettingExcel(
        version,
        tenant
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export service head code excel");
    }
  }
);

// Fetch departments for service head code
export const fetchServiceHeadCodeDepartments = createAsyncThunk<
  KVPair[],
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceheadcode/fetchDepartments",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await ServiceHeadCodeService.getApiVDepartmentsDepartmentKVlist(
        version,
        tenant
      );
      // Since the service is typed to return Array<KVPair>, we need to handle it as such
      // But if the actual response is nested, we need to cast it
      const departmentsArray = (response as any).data?.items || response || [];
      return departmentsArray;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch departments");
    }
  }
);

// Fetch hospitals for service head code
export const fetchServiceHeadCodeHospitals = createAsyncThunk<
  HospitalListDto[],
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceheadcode/fetchHospitals",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {

      const response = await ServiceHeadCodeService.getApiVHospitalHospitals(
        version,
        tenant
      );
      // Extract data.items from the nested response structure or use response directly if it's already an array
      const hospitalsArray = (response as any).data?.items || response || [];
      return hospitalsArray;
    } catch (error: any) {

      return rejectWithValue(error?.message || "Failed to fetch hospitals");
    }
  }
); 