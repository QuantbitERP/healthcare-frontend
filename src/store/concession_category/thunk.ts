// src/store/thunks/concessionCategoryThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ConcessionCategoryService } from "@/api-client";
import {
  CreateConcessionCategoryCommand,
  UpdateConcessionCategoryCommand,
  ConcessionCategoryListRequestDto,
} from "@/api-client";
import { t } from "@/utils/languages";

const API_VERSION = "1";

/* ✅ Fetch Concession Categories (KVPair format for dropdowns) - Direct API call */
export const fetchConcessionCategoriesDirect = createAsyncThunk(
  "concessionCategory/fetchCategoriesDirect",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      // Direct API call to concessionCategories endpoint
      const res = await (
        ConcessionCategoryService as any
      ).getApiVConcessionCategoryConcessionCategories?.(API_VERSION, tenant);

      return res;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryFetchFailed")
      );
    }
  }
);

/* ✅ Fetch Concession Categories (KVPair format for dropdowns) */
export const fetchConcessionCategoriesKVPair = createAsyncThunk(
  "concessionCategory/fetchKVPair",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      // Try the concessionCategories endpoint first
      const res = await (
        ConcessionCategoryService as any
      ).getApiVConcessionCategoryConcessionCategories?.(API_VERSION, tenant);

      if (res) {
        return res;
      }

      // Fallback to concessionCategoryTypes if concessionCategories fails
      const fallbackRes =
        await ConcessionCategoryService.getApiVConcessionCategoryConcessionCategoryTypes(
          API_VERSION,
          tenant
        );
      return fallbackRes;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryFetchFailed")
      );
    }
  }
);

/* ✅ Fetch Concession Categories List with filters & search */
export const fetchConcessionCategories = createAsyncThunk(
  "concessionCategory/fetchAll",
  async (
    {
      tenant,
      filters,
    }: { tenant: string; filters?: ConcessionCategoryListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await ConcessionCategoryService.postApiVConcessionCategoryList(
          API_VERSION,
          tenant,
          filters
        );
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryFetchFailed")
      );
    }
  }
);

/* ✅ Create a new concession category */
export const createConcessionCategory = createAsyncThunk(
  "concessionCategory/create",
  async (
    {
      tenant,
      payload,
    }: { tenant: string; payload: CreateConcessionCategoryCommand },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await ConcessionCategoryService.postApiVConcessionCategorySave(
          API_VERSION,
          tenant,
          payload
        );
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryCreateFailed")
      );
    }
  }
);

/* ✅ Update an existing concession category */
export const updateConcessionCategory = createAsyncThunk(
  "concessionCategory/update",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: UpdateConcessionCategoryCommand },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await ConcessionCategoryService.putApiVConcessionCategoryUpdate(
          API_VERSION,
          tenant,
          payload
        );
      return res; // Return the full response to let the component handle isError check
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryUpdateFailed")
      );
    }
  }
);

/* ✅ Delete concession categories (expects array of IDs) */
export const deleteConcessionCategories = createAsyncThunk(
  "concessionCategory/delete",
  async (
    { tenant, ids }: { tenant?: string; ids: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await ConcessionCategoryService.deleteApiVConcessionCategory(
        API_VERSION,
        tenant,
        ids
      );
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryDeleteFailed")
      );
    }
  }
);

/* ✅ Get CreatedBy User Filter Options */
export const fetchConcessionCreatedByUsers = createAsyncThunk(
  "concessionCategory/fetchCreatedByUsers",
  async (tenant: string, { rejectWithValue }) => {
    try {
      const res =
        await ConcessionCategoryService.getApiVConcessionCategoryGetCreatedbyUser(
          API_VERSION,
          tenant
        );
      return res?.data?.items ?? []; // KVPair list
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

/* ✅ Get ModifiedBy User Filter Options */
export const fetchConcessionModifiedByUsers = createAsyncThunk(
  "concessionCategory/fetchModifiedByUsers",
  async (tenant: string, { rejectWithValue }) => {
    try {
      const res =
        await ConcessionCategoryService.getApiVConcessionCategoryGetModifiedbyUser(
          API_VERSION,
          tenant
        );
      return res?.data?.items ?? [];
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

/* ✅ Get Concession Allowed Status (true/false) */
export const fetchConcessionAllowedStatus = createAsyncThunk(
  "concessionCategory/fetchAllowedStatus",
  async (tenant: string, { rejectWithValue }) => {
    try {
      const res =
        await ConcessionCategoryService.getApiVConcessionCategoryConcessionAllowedStatus(
          API_VERSION,
          tenant
        );
      return res?.data ?? false; // BooleanResultModel.data → true/false
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

/* ✅ Get Concession Category Types (dropdown list) */
export const fetchConcessionCategoryTypes = createAsyncThunk(
  "concessionCategory/fetchCategoryTypes",
  async (tenant: string, { rejectWithValue }) => {
    try {
      const res =
        await ConcessionCategoryService.getApiVConcessionCategoryConcessionCategoryTypes(
          API_VERSION,
          tenant
        );
      return res?.data?.items ?? []; // KVPair list
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

/* ✅ Get a single Concession Category by ID */
export const fetchConcessionCategoryById = createAsyncThunk(
  "concessionCategory/fetchById",
  async (
    { tenant, id }: { tenant?: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await ConcessionCategoryService.getApiVConcessionCategory(
        id,
        API_VERSION,
        tenant
      );
      return res ?? null; // returns ConcessionCategoryDto
    } catch (error: any) {
      return rejectWithValue(
        error?.message || t("error.concessionCategoryFetchFailed")
      );
    }
  }
);

/* ✅ Get a specific Concession Category Type by ID */
export const fetchConcessionCategoryTypeById = createAsyncThunk(
  "concessionCategory/fetchCategoryTypeById",
  async (
    { tenant, id }: { tenant?: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await ConcessionCategoryService.getApiVConcessionCategoryConcessionCategoryType(
          id,
          API_VERSION,
          tenant
        );
      return res?.data ?? null; // returns ConcessionCategoryTypeByIdDto
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
