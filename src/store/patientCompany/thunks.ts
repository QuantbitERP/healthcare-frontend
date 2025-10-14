import { createAsyncThunk } from "@reduxjs/toolkit";

import { API_TENANT, API_VERSION } from "@/utils/constants";
import { KVPair } from "./types";
import {
  CommonService,
  CreatePatientCompanyCommand,
  DeletePatientCompanyMasterIdCommand,
  DepartmentsService,
  HospitalService,
  InsertPatientCompanyResponseDTOResultModel,
  PatientCompanyMasterDeleteResponceDTO,
  PatientCompanyMasterGetByIdResponceDtoResultModel,
  PatientCompanyMasterListRequestDto,
  PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel,
  PatientCompanyMasterService,
  UpdatePatientCompanyCommand,
} from "@/services2/api-client";
import { CommonResponseDto } from "@/api-client/models/DepartmentListDto";
import { DistrictRequestDto } from "@/api-client/models/CommonRequestDto";

export const fetchPatientCompanyMasterList = createAsyncThunk<
  PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel,
  {
    version: string;
    tenant?: string;
    requestBody?: PatientCompanyMasterListRequestDto;
  },
  {
    rejectValue: string;
  }
>(
  "patientCompany/fetchList",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response =
        await PatientCompanyMasterService.postApiVPatientCompanyMasterList(
          version,
          tenant,
          requestBody
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage ||
          error?.message ||
          "Failed to fetch patient company list"
      );
    }
  }
);

export const fetchAllKVLists = async (version: string, tenant?: string) => {
  try {
    const [
      patientCategoryList,
      rateNameList,
      createdByUsers,
      modifiedByUsers,
      companies,
    ] = await Promise.all([
      PatientCompanyMasterService.getApiVPatientCompanyMasterGetPatientCategoryList(
        version,
        tenant
      ),
      PatientCompanyMasterService.getApiVPatientCompanyMasterGetRateNameList(
        version,
        tenant
      ),
      PatientCompanyMasterService.getApiVPatientCompanyMasterGetCreatedbyUser(
        version,
        tenant
      ),
      PatientCompanyMasterService.getApiVPatientCompanyMasterGetModifiedbyUser(
        version,
        tenant
      ),
      PatientCompanyMasterService.getApiVPatientCompanyMasterPatientcompanies(
        version,
        tenant
      ),
    ]);

    return {
      patientCategoryList,
      rateNameList,
      createdByUsers,
      modifiedByUsers,
      companies: (companies as any)?.data?.items ?? [],
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch KV lists");
  }
};

export const fetchAllDropdownData = createAsyncThunk(
  "patientCompany/fetchAllDropdownData",
  async (
    { version, tenant }: { version: string; tenant?: string },
    thunkAPI
  ) => {
    try {
      const result = await fetchAllKVLists(version, tenant);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.message || "Dropdown fetch failed"
      );
    }
  }
);

export const fetchHospitalList = createAsyncThunk<
  {
    hospitals: CommonResponseDto;
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "hospital/fetchList",
  async ({ version, tenant }, { rejectWithValue }): Promise<any> => {
    try {
      const [hospitals] = await Promise.all([
        HospitalService.getApiVHospitalHospitals(version, tenant),
      ]);

      return {
        hospitals,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch service filters"
      );
    }
  }
);

export const savePatientCompany = createAsyncThunk<
  InsertPatientCompanyResponseDTOResultModel, // Return type
  { version: string; tenant?: string; data: CreatePatientCompanyCommand }, // Params
  { rejectValue: string } // Error type
>(
  "schemeCompany/save",
  async ({ version, tenant, data }, { rejectWithValue }) => {
    try {
      const response =
        await PatientCompanyMasterService.postApiVPatientCompanyMasterSave(
          version,
          tenant,
          data
        );
      
      // Check if the API response indicates an error (status 200 but isError: true)
      // Handle both direct structure and nested result structure
      const isError = response?.isError || (response as any)?.result?.isError;
      const errorMessage = response?.errorMessage || (response as any)?.result?.errorMessage;
      
      if (isError) {
        return rejectWithValue(errorMessage || "Failed to save patient company data");
      }
      
      return response;
    } catch (err: any) {
      // Handle backend error shape
      const errorMessage =
        err?.body?.ErrorMessage ||
        err?.body?.errorMessage ||
        err?.message ||
        "Failed to save patient company data";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Patient Company
export const deletePatientCompany = createAsyncThunk<
  Array<PatientCompanyMasterDeleteResponceDTO>,
  { version: string; tenant?: string; ids: string[] },
  { rejectValue: string }
>(
  "patientCompany/delete",
  async ({ version, tenant, ids }, { rejectWithValue }) => {
    try {
      const requestBody: DeletePatientCompanyMasterIdCommand = { ids };
      const response =
        await PatientCompanyMasterService.deleteApiVPatientCompanyMasterDelete(
          version,
          tenant,
          requestBody
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage ||
          error?.message ||
          "Failed to delete patient company"
      );
    }
  }
);

// ✅ Fetch Country List
export const fetchCountries = createAsyncThunk<KVPair[]>(
  "common/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonCountry(
        API_VERSION,
        API_TENANT
      );
      const items = response?.data?.items ?? [];

      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch countries");
    }
  }
);

// ✅ Fetch State List based on Country
export const fetchStates = createAsyncThunk<KVPair[], string>(
  "common/fetchStates",
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonState(
        API_VERSION,
        API_TENANT,
        {
          countryId: countryId,
        }
      );
      const items = response?.data?.items ?? [];

      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch states");
    }
  }
);

// ✅ Fetch Districts
export const fetchDistricts = createAsyncThunk<KVPair[], string>(
  "common/fetchDistricts",
  async (stateId, { rejectWithValue }) => {
    try {
      const payload: DistrictRequestDto = { state_Id: stateId };
      const response = await CommonService.postApiVCommonDistrict(
        API_VERSION,
        API_TENANT,
        payload
      );
      const items = response?.data?.items ?? [];

      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch districts");
    }
  }
);

// ✅ Fetch Cities
export const fetchCities = createAsyncThunk<KVPair[], string>(
  "common/fetchCities",
  async (districtId, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonCity(
        API_VERSION,
        API_TENANT,
        { state_Id: districtId }
      );
      const items = response?.data?.items ?? [];

      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cities");
    }
  }
);

export const fetchStatusListCommon = createAsyncThunk<KVPair[]>(
  "common/fetchStatusList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonStatus(
        API_VERSION,
        API_TENANT
      );
      const items = response?.data?.items ?? [];

      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch status list");
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "common/fetchDepartments",
  async (_, { rejectWithValue }): Promise<any> => {
    try {
      const response =
        (await DepartmentsService.getApiVDepartmentsDepartmentKVlist(
          API_VERSION,
          API_TENANT
        )) as any;

      const items = response?.data?.items ?? [];
      const sanitized: KVPair[] = items.map((item) => ({
        key: item.key ?? "",
        value: item.value ?? "",
      }));

      return sanitized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch departments");
    }
  }
);

// New APIS

// Fetch Patient Company by ID
export const fetchPatientCompanyById = createAsyncThunk<
  PatientCompanyMasterGetByIdResponceDtoResultModel,
  { id: string; version: string; tenant?: string },
  { rejectValue: string }
>(
  "patientCompany/fetchById",
  async ({ id, version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await PatientCompanyMasterService.getApiVPatientCompanyMaster(
          id,
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage ||
          error?.message ||
          "Failed to fetch patient company"
      );
    }
  }
);

// ✅ Fetch Patient Companies KV List
export const fetchPatientCompanies = createAsyncThunk<
  KVPair[],
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "patientCompany/fetchCompanies",
  async ({ version, tenant }, { rejectWithValue }): Promise<any> => {
    try {
      const response =
        await PatientCompanyMasterService.getApiVPatientCompanyMasterPatientcompanies(
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch patient companies"
      );
    }
  }
);

// ✅ Update Patient Company
export const updatePatientCompany = createAsyncThunk<
  InsertPatientCompanyResponseDTOResultModel,
  { version: string; tenant?: string; data: UpdatePatientCompanyCommand },
  { rejectValue: string }
>(
  "patientCompany/update",
  async ({ version, tenant, data }: any, { rejectWithValue }) => {
    try {
      const response =
        await PatientCompanyMasterService.putApiVPatientCompanyMasterUpdate(
          version,
          tenant,
          data
        );
      
      // Check if the API response indicates an error (status 200 but isError: true)
      // Handle both direct structure and nested result structure
      const isError = response?.isError || (response as any)?.result?.isError;
      const errorMessage = response?.errorMessage || (response as any)?.result?.errorMessage;
      
      if (isError) {
        return rejectWithValue(errorMessage || "Failed to update patient company");
      }
      
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err?.body?.errorMessage || err?.body?.ErrorMessage || "Failed to update patient company"
      );
    }
  }
);

// ✅ Export Patient Company Master to Excel
export const exportPatientCompanyExcel = createAsyncThunk<
  Blob,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "patientCompany/exportExcel",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await PatientCompanyMasterService.postApiVPatientCompanyMasterPatientCompanyMasterExcelExcel(
          version,
          tenant
        );
      // return response;
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      return blob;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to export patient company master to Excel"
      );
    }
  }
);
