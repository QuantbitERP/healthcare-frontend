// src/store/thunks/depositTypeThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DepositTypeService } from "@/api-client";
import type {
  DepositTypeListRequestDto,
  DepositTypeRequestDto,
  CreateDepositTypeCommand,
  UpdateDepositTypeCommand,
} from "@/api-client";

const API_VERSION = "1";

/**
 * ✅ Fetch all deposit types with optional filters (pagination, search)
 */
export const fetchDepositTypes = createAsyncThunk(
  "depositType/fetchAll",
  async (
    { tenant, filters }: { tenant?: string; filters?: DepositTypeListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const res = await DepositTypeService.postApiVDepositTypeList(
        API_VERSION,
        tenant,
        {
          ...filters,
          applicableForId: Array.isArray(filters?.applicableForId) && filters.applicableForId.length > 0
            ? filters.applicableForId
            : [0],
            status: filters?.status ?? 0,
        }
      );
      return res; // returns Array<DepositTypeListDto>
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Fetch single deposit type by ID
 */
export const fetchDepositTypeById = createAsyncThunk(
  "depositType/fetchById",
  async (
    { id, tenant }: { id: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await DepositTypeService.getApiVDepositType(
        id,
        API_VERSION,
        tenant
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Create a new deposit type
 */
export const createDepositType = createAsyncThunk(
  "depositType/create",
  async (
    { tenant, payload }: { tenant?: string; payload: DepositTypeRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const command: CreateDepositTypeCommand = { model: { ...payload,deactive:false, user: "1" } };
      const res = await DepositTypeService.postApiVDepositType(
        API_VERSION,
        tenant,
        command
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Update deposit type by ID
 */
export const updateDepositType = createAsyncThunk(
  "depositType/update",
  async (
    {
      id,
      tenant,
      payload,
    }: { id: string; tenant?: string; payload: DepositTypeRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const command: UpdateDepositTypeCommand = { 
        model: { ...payload, id } 
      };
      const res = await DepositTypeService.putApiVDepositType(
        API_VERSION,
        tenant,
        command
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Delete one or multiple deposit types
 */
export const deleteDepositTypes = createAsyncThunk(
  "depositType/delete",
  async (
    { tenant, ids }: { tenant?: string; ids: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await DepositTypeService.deleteApiVDepositType(
        API_VERSION,
        tenant,
        ids
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Fetch CreatedBy list
 */
export const fetchDepositTypeCreatedByList = createAsyncThunk(
  "depositType/createdByList",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      const res = await DepositTypeService.getApiVDepositTypeCreatedByList(
        API_VERSION,
        tenant
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Fetch ModifiedBy list
 */
export const fetchDepositTypeModifiedByList = createAsyncThunk(
  "depositType/modifiedByList",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      const res = await DepositTypeService.getApiVDepositTypeModifiedByList(
        API_VERSION,
        tenant
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Fetch Deposit Type Status list
 */
export const fetchDepositTypeStatus = createAsyncThunk(
  "depositType/statusList",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      const res = await DepositTypeService.getApiVDepositTypeDepositeTypeStatus(
        API_VERSION,
        tenant
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDepositTypeApplicableForList = createAsyncThunk(
  "depositType/applicableForList",
  async ({ tenant }: { tenant?: string }, { rejectWithValue }) => {
    try {
      const res = await DepositTypeService.getApiVDepositTypeApplicableForList(
        API_VERSION,
        tenant
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
