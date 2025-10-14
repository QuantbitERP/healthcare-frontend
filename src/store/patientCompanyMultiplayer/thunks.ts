import { createAsyncThunk } from "@reduxjs/toolkit";
import { InvoicingService, IpdBillPatientCompanyService } from "@/services/api-client";
import { API_TENANT, API_VERSION } from "@/utils/constants";
import { PatientCompanyItem, PatientCompanyData } from "./types";

// Fetch Patient Companies for Dropdown
export const fetchPatientCompaniesForDropdown = createAsyncThunk<
  PatientCompanyItem[],
  { version?: string; tenant?: string },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/fetchDropdownData",
  async ({ version = API_VERSION, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await InvoicingService.getApiVInvoicingPatientCompanies(version, tenant);
      
      // Handle the API response structure
      if (response && response.data && response.data.items && Array.isArray(response.data.items)) {
        const sanitized: PatientCompanyItem[] = response.data.items.map((item) => ({
          key: item.key ?? "",
          value: item.value ?? "",
        }));
        return sanitized;
      }
      
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage || error?.message || "Failed to fetch patient companies"
      );
    }
  }
);

// Add Patient Company to Table
export const addPatientCompanyToTable = createAsyncThunk<
  PatientCompanyData,
  { companyData: Omit<PatientCompanyData, 'id' | 'createdOn' | 'modifiedOn'> },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/addToTable",
  async ({ companyData }, { rejectWithValue }) => {
    try {
      const newCompany: PatientCompanyData = {
        ...companyData,
        id: `new-${Date.now()}`,
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
      };
      
      return newCompany;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to add patient company"
      );
    }
  }
);

// Update Patient Company in Table
export const updatePatientCompanyInTable = createAsyncThunk<
  { id: string; updates: Partial<PatientCompanyData> },
  { id: string; updates: Partial<PatientCompanyData> },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/updateInTable",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return { id, updates };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to update patient company"
      );
    }
  }
);

// Remove Patient Companies from Table
export const removePatientCompaniesFromTable = createAsyncThunk<
  string[],
  { ids: string[] },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/removeFromTable",
  async ({ ids }, { rejectWithValue }) => {
    try {
      return ids;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to remove patient companies"
      );
    }
  }
);

// Select/Deselect Patient Company Rows
export const togglePatientCompanyRowSelection = createAsyncThunk<
  { id: string; selected: boolean },
  { id: string; selected: boolean },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/toggleRowSelection",
  async ({ id, selected }, { rejectWithValue }) => {
    try {
      return { id, selected };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to toggle row selection"
      );
    }
  }
);

// Select All Patient Company Rows
export const selectAllPatientCompanyRows = createAsyncThunk<
  { selected: boolean; allIds: string[] },
  { selected: boolean; allIds: string[] },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/selectAllRows",
  async ({ selected, allIds }, { rejectWithValue }) => {
    try {
      return { selected, allIds };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to select all rows"
      );
    }
  }
);

// Clear All Selections
export const clearAllPatientCompanySelections = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/clearAllSelections",
  async (_, { rejectWithValue }) => {
    try {
      return;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to clear selections"
      );
    }
  }
);

// Fetch Associate Companies for Dropdown
export const fetchAssociateCompaniesForDropdown = createAsyncThunk<
  PatientCompanyItem[],
  { version?: string; tenant?: string },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/fetchAssociateCompanies",
  async ({ version = API_VERSION, tenant = API_TENANT }, { rejectWithValue }) => {
    try {
      const response = await InvoicingService.getApiVInvoicingAssociateCompanies(version, tenant);
      
      // Handle the API response structure
      if (response && response.data && response.data.items && Array.isArray(response.data.items)) {
        const sanitized: PatientCompanyItem[] = response.data.items.map((item) => ({
          key: item.key ?? "",
          value: item.value ?? "",
        }));
        return sanitized;
      }
      
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage || error?.message || "Failed to fetch associate companies"
      );
    }
  }
);

// Save Patient Company Data
export const savePatientCompanyData = createAsyncThunk<
  any,
  { 
    visitId: string; 
    data: PatientCompanyData[];
    companyOptions: { label: string; value: string }[];
    associateCompanyOptions: { label: string; value: string }[];
  },
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/saveData",
  async ({ visitId, data, companyOptions, associateCompanyOptions }, { rejectWithValue }) => {
    try {
      // Transform data to API format
      const transformedData = data.map((item) => {
        // Find company key from company name
        const companyOption = companyOptions.find(option => option.label === item.companyName);
        const schemecompanyId = companyOption ? companyOption.value : "";

        // Find associate company key from associate company name
        const associateCompanyOption = associateCompanyOptions.find(option => option.label === item.associatedCompanyName);
        const associateCompanyId = associateCompanyOption ? associateCompanyOption.value : "";

        const payload: any = {
          patientVisitId: visitId,
          schemecompanyId: schemecompanyId,
          associateCompanyId: associateCompanyId,
          insuranceNumber: item.insurancePolicyNumber || "",
          claimId: item.preAuthorizationNumber || "",
          approvedamount: item.amount || 0,
        };

        // Only include ID for existing records (not new ones)
        if (item.id && !item.id.startsWith('new-')) {
          payload.id = item.id;
        }

        return payload;
      });

      const requestBody = {
        model: transformedData,
      };

      const response = await IpdBillPatientCompanyService.postApiVIPDBillPatientCompanyPatientTypeByBillTypeSave(
        requestBody
      );

      // Check if the response indicates an error even with 200 status
      if (response.isError) {
        return rejectWithValue(
          response.errorMessage || "An error occurred while saving the data"
        );
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.body?.errorMessage || error?.message || "Failed to save patient company data"
      );
    }
  }
);

// Reset Patient Company Multiplayer State
export const resetPatientCompanyMultiplayerState = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "patientCompanyMultiplayer/resetState",
  async (_, { rejectWithValue }) => {
    try {
      return;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to reset state"
      );
    }
  }
);
