import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from 'axios';
import { 
  FinanceAuthorityService 
} from "@/api-client/services/FinanceAuthorityService";

import type { 
  CreateFinanceAuthorityCommand,
  UpdateFinanceAuthorityCommand,
  DeleteFinanceAuthorityCommand,
  FinanceAuthorityListRequestDto
} from "@/api-client";
import { API_VERSION } from "@/utils/constants";

// Common version & tenant can be handled via env or passed dynamically
// const API_VERSION = "1";

// Fetch Finance Authority list
export const fetchFinanceAuthorityList = createAsyncThunk(
  "financeAuthority/fetchList",
  async (
    { tenant, filters }: { tenant?: string; filters?: FinanceAuthorityListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await FinanceAuthorityService.postApiVFinanceAuthorityList(
        API_VERSION,
        tenant,
        filters
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Fetch single Finance Authority by ID
export const fetchFinanceAuthorityById = createAsyncThunk(
  "financeAuthority/fetchById",
  async (
    { id, tenant }: { id: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await FinanceAuthorityService.getApiVFinanceAuthority(
        id,
        API_VERSION,
        tenant
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Create Finance Authority
export const createFinanceAuthority = createAsyncThunk<
  any,
  { data: CreateFinanceAuthorityCommand; tenant?: string },
  { rejectValue: string }
>(
  "financeAuthority/create",
  async (
    { data, tenant }: { data: CreateFinanceAuthorityCommand; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await FinanceAuthorityService.postApiVFinanceAuthority(
        API_VERSION,
        tenant,
        data
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to create finance authority'
      );
    }
  }
);

// Update Finance Authority
export const updateFinanceAuthority = createAsyncThunk(
  "financeAuthority/update",
  async (
    { model, tenant }: {model: UpdateFinanceAuthorityCommand; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await FinanceAuthorityService.putApiVFinanceAuthority(
        API_VERSION,
        tenant,
        model
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Delete Finance Authority
export const deleteFinanceAuthority = createAsyncThunk(
  "financeAuthority/delete",
  async (
    { data, tenant }: { data: DeleteFinanceAuthorityCommand; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await FinanceAuthorityService.deleteApiVFinanceAuthority(
        API_VERSION,
        tenant,
        data
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Fetch dropdown filters (concession, employee, etc.)
export const fetchFinanceAuthorityFilters = createAsyncThunk(
  "financeAuthority/fetchFilters",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      const [concessionGivenBy, employee, createdBy, modifiedBy, doctorList] =
        await Promise.all([
          FinanceAuthorityService.getApiVFinanceAuthorityConcessionGivenBy(API_VERSION, tenant),
          FinanceAuthorityService.getApiVFinanceAuthorityEmployee(API_VERSION, tenant),
          FinanceAuthorityService.getApiVFinanceAuthorityCreatedby(API_VERSION, tenant),
          FinanceAuthorityService.getApiVFinanceAuthorityModifiedBy(API_VERSION, tenant),
          FinanceAuthorityService.getApiVFinanceAuthorityGetDoctorList(API_VERSION, tenant)
        ]);

      
      return { concessionGivenBy, employee, createdBy, modifiedBy, doctorList };
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);
