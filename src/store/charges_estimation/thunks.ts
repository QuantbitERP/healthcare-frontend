import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChargesEstimationService } from "@/services/api-client/services/ChargesEstimationService";
import {
  SearchedServiceRequestDto,
  ChargesEstimationListRequestDto,
  ChargesEstimationPrintRequestDto,
  CreateChargesEstimationCommand,
  UpdateChargesEstimationCommand,
  DeleteChargesEstimationListCommand,
  ChargesEstimationComparisionPrintRequestDto,
} from "@/services/api-client/";

// Search Services List
export const fetchChargesEstimationSearchServicesList = createAsyncThunk(
  "chargesEstimation/fetchSearchServicesList",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: SearchedServiceRequestDto },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.postApiVChargesEstimationSearchServiceslist(version, tenant, requestBody);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch services list");
    }
  }
);

//Save Charges Estimation
export const saveChargesEstimation = createAsyncThunk(
  "chargesEstimation/save",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: CreateChargesEstimationCommand },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.postApiVChargesEstimationSave(version, tenant, requestBody);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to save estimation");
    }
  }
);

//Update Charges Estimation
export const updateChargesEstimation = createAsyncThunk(
  "chargesEstimation/update",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: UpdateChargesEstimationCommand },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.putApiVChargesEstimation(version, tenant, requestBody);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update estimation");
    }
  }
);

// Delete Charges Estimation
export const deleteChargesEstimation = createAsyncThunk(
  "chargesEstimation/delete",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: DeleteChargesEstimationListCommand },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.deleteApiVChargesEstimation(version, tenant, requestBody);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete estimation");
    }
  }
);

//Get CreatedBy
export const fetchChargesEstimationCreatedBy = createAsyncThunk(
  "chargesEstimation/fetchCreatedBy",
  async ({ version, tenant }: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      return await ChargesEstimationService.getApiVChargesEstimationGetCreatedby(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch created by list");
    }
  }
);

// Get ModifiedBy
export const fetchChargesEstimationModifiedBy = createAsyncThunk(
  "chargesEstimation/fetchModifiedBy",
  async ({ version, tenant }: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      return await ChargesEstimationService.getApiVChargesEstimationGetModifiedby(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch modified by list");
    }
  }
);

//Estimation Type Enum
export const fetchChargesEstimationTypeEnum = createAsyncThunk(
  "chargesEstimation/fetchTypeEnum",
  async ({ version, tenant }: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      return await ChargesEstimationService.getApiVChargesEstimationEstimationTypeenum(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch estimation type enum");
    }
  }
);

// Patient Type Enum
export const fetchChargesEstimationPatientTypeEnum = createAsyncThunk(
  "chargesEstimation/fetchPatientTypeEnum",
  async ({ version, tenant }: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      return await ChargesEstimationService.getApiVChargesEstimationPatienttypeenum(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch patient type enum");
    }
  }
);

// Estimation List
export const fetchChargesEstimationList = createAsyncThunk(
  "chargesEstimation/fetchList",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: ChargesEstimationListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.postApiVChargesEstimationList(version, tenant, requestBody);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch estimation list");
    }
  }
);

// Export Estimation PDF
export const exportChargesEstimationPdf = createAsyncThunk(
  "chargesEstimation/exportPdf",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: ChargesEstimationPrintRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await ChargesEstimationService.postApiVChargesEstimationChargesEstimationPdf(version, tenant, requestBody);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export estimation PDF");
    }
  }
);

//Export Estimation Excel
export const exportChargesEstimationExcel = createAsyncThunk(
  "chargesEstimation/exportExcel",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: ChargesEstimationPrintRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await ChargesEstimationService.postApiVChargesEstimationChargesEstimationExcel(version, tenant, requestBody);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export estimation Excel");
    }
  }
);

// Get Estimation by Id
export const fetchChargesEstimationById = createAsyncThunk(
  "chargesEstimation/fetchById",
  async ({ id, version, tenant }: { id: string; version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await ChargesEstimationService.getApiVChargesEstimation(id, version, tenant);
      return response?.data ?? null; // Extract the data field from the response
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch estimation by ID");
    }
  }
);

// Estimation Vs Bill Comparison PDF
export const exportChargesEstimationVsBillComparisonPdf = createAsyncThunk(
  "chargesEstimation/exportVsBillComparisonPdf",
  async (
    { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: ChargesEstimationComparisionPrintRequestDto },
    { rejectWithValue }
  ) => {
    try {
      return await ChargesEstimationService.postApiVChargesEstimationChargesestimationVsBilComparisionPdf(
        version,
        tenant,
        requestBody
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export Vs Bill Comparison PDF");
    }
  }
);
