// src/store/thunks/associateSchemeCompanyThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AssociateSchemeCompanyService } from "@/api-client/services/AssociateSchemeCompanyService";
import {
  CreateAssociateSchemeCompanyCommand,
  UpdateAssociateSchemeCompanyCommand,
  DeleteAssociateSchemeCompanyCommand,
  AssociateCompanyListRequestDto,
} from "@/api-client";

const API_VERSION = "1";

export const fetchCreatedBy = createAsyncThunk<
  any,
  { tenant?: string },
  { rejectValue: string }
>(
  "associateSchemeCompany/fetchCreatedBy",
  async ({ tenant }, { rejectWithValue }) => {
    try {
      return await AssociateSchemeCompanyService.getApiVAssociateSchemeCompanyGetcretaedby(
        API_VERSION,
        tenant
      );
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch created by list');
    }
  }
);

export const fetchModifiedBy = createAsyncThunk<
  any,
  { tenant?: string },
  { rejectValue: string }
>(
  "associateSchemeCompany/fetchModifiedBy",
  async ({ tenant }, { rejectWithValue }) => {
    try {
      return await AssociateSchemeCompanyService.getApiVAssociateSchemeCompanyGetmodifiedby(
        API_VERSION,
        tenant
      );
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch modified by list');
    }
  }
);

export const fetchStatusList = createAsyncThunk<
  any,
  { tenant?: string },
  { rejectValue: string }
>(
  "associateSchemeCompany/fetchStatusList",
  async ({ tenant }, { rejectWithValue }) => {
    try {
      return await AssociateSchemeCompanyService.getApiVAssociateSchemeCompanyGetStatusList(
        API_VERSION,
        tenant
      );
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch status list');
    }
  }
);

export const fetchAssociateCompanies = createAsyncThunk<
  any,
  { tenant?: string },
  { rejectValue: string }
>(
  "associateSchemeCompany/fetchAssociateCompanies",
  async ({ tenant }, { rejectWithValue }) => {
    try {
      return await AssociateSchemeCompanyService.getApiVAssociateSchemeCompanyGetAssociateCompanies(
        API_VERSION,
        tenant
      );
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch associate companies');
    }
  }
);

export const fetchAssociateCompanyList = createAsyncThunk(
  "associateSchemeCompany/fetchList",
  async (
    {
      tenant,
      filters,
    }: { tenant?: string; filters?: AssociateCompanyListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      return await AssociateSchemeCompanyService.postApiVAssociateSchemeCompanyList(
        API_VERSION,
        tenant,
        filters
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createAssociateSchemeCompany = createAsyncThunk(
  "associateSchemeCompany/create",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: CreateAssociateSchemeCompanyCommand },
    { rejectWithValue }
  ) => {
    try {
      return await AssociateSchemeCompanyService.postApiVAssociateSchemeCompanySave(
        API_VERSION,
        tenant,
        payload
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAssociateSchemeCompany = createAsyncThunk(
  "associateSchemeCompany/update",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: UpdateAssociateSchemeCompanyCommand },
    { rejectWithValue }
  ) => {
    try {
      return await AssociateSchemeCompanyService.putApiVAssociateSchemeCompanyUpdate(
        API_VERSION,
        tenant,
        payload
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAssociateSchemeCompany = createAsyncThunk(
  "associateSchemeCompany/delete",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: DeleteAssociateSchemeCompanyCommand },
    { rejectWithValue }
  ) => {
    try {
      return await AssociateSchemeCompanyService.deleteApiVAssociateSchemeCompanyDelete(
        API_VERSION,
        tenant,
        payload
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const fetchAssociateCompanyById = createAsyncThunk(
  "associateSchemeCompany/fetchById",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: string },
    { rejectWithValue } 
  ) => {
    try {
      return await AssociateSchemeCompanyService.getApiVAssociateSchemeCompanyGetAssociateSchemeCompanyById(
        payload,
        API_VERSION,
        tenant
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
