import { createAsyncThunk } from "@reduxjs/toolkit";
import { CoverLetterService } from "@/api-client/services/CoverLetterService";
import { CoverLetterSaveRequestDto } from "@/api-client/models/CoverLetterSaveRequestDto";
import { CoverLetterUpdateRequestDTO } from "@/api-client/models/CoverLetterUpdateRequestDTO";
import { t } from "@/utils/languages";

// Fetch cover letter list with filters
export const fetchCoverLetterList = createAsyncThunk(
  "coverLetter/fetchList",
  async (params: {
    version: string;
    tenant?: string;
    requestBody: any; // Using any to match API documentation format
  }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.postApiVCoverLetterGetCoverLaterListByFilter(
        params.version,
        params.tenant,
        params.requestBody
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterFetchFailed"));
    }
  }
);

// Create new cover letter
export const createCoverLetter = createAsyncThunk(
  "coverLetter/create",
  async (params: {
    version: string;
    tenant?: string;
    requestBody: CoverLetterSaveRequestDto;
  }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.postApiVCoverLetter(
        params.version,
        params.tenant,
        params.requestBody
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterCreateFailed"));
    }
  }
);

// Update existing cover letter
export const updateCoverLetter = createAsyncThunk(
  "coverLetter/update",
  async (params: {
    id: string;
    version: string;
    tenant?: string;
    requestBody: CoverLetterUpdateRequestDTO;
  }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.putApiVCoverLetter(
        params.id,
        params.version,
        params.tenant,
        params.requestBody
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterUpdateFailed"));
    }
  }
);

// Delete cover letter
export const deleteCoverLetter = createAsyncThunk(
  "coverLetter/delete",
  async (params: {
    version: string;
    tenant?: string;
    requestBody?: Array<string>;
  }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.deleteApiVCoverLetter(
        params.version,
        params.tenant,
        params.requestBody
      );
      return { ...response };
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterDeleteFailed"));
    }
  }
);

// Fetch cover letter by ID
export const fetchCoverLetterById = createAsyncThunk(
  "coverLetter/fetchById",
  async (params: {
    id: string;
    version: string;
    tenant?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.getApiVCoverLetter(
        params.id,
        params.version,
        params.tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterFetchFailed"));
    }
  }
);

// Fetch cover letter companies
export const fetchCoverLetterCompanies = createAsyncThunk(
  "coverLetter/fetchCompanies",
  async (params: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.getApiVCoverLetterCompanies(
        params.version,
        params.tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterCompaniesFetchFailed"));
    }
  }
);

// Fetch cover letter fields
export const fetchCoverLetterFields = createAsyncThunk(
  "coverLetter/fetchFields",
  async (params: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.getApiVCoverLetterFields(
        params.version,
        params.tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterFieldsFetchFailed"));
    }
  }
);

// Fetch cover letter created by list
export const fetchCoverLetterCreatedBy = createAsyncThunk(
  "coverLetter/fetchCreatedBy",
  async (params: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.getApiVCoverLetterGetCreatedByList(
        params.version,
        params.tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterCreatedByFetchFailed"));
    }
  }
);

// Fetch cover letter modified by list
export const fetchCoverLetterModifiedBy = createAsyncThunk(
  "coverLetter/fetchModifiedBy",
  async (params: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await CoverLetterService.getApiVCoverLetterGetModifiedByList(
        params.version,
        params.tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || t("error.coverLetterModifiedByFetchFailed"));
    }
  }
);

// Legacy exports for backward compatibility
export const CoverLetterCompanies = fetchCoverLetterCompanies;
export const CoverLetterFields = fetchCoverLetterFields;
export const CoverLetterCreatedBy = fetchCoverLetterCreatedBy;
export const CoverLetterModifiedBy = fetchCoverLetterModifiedBy;

