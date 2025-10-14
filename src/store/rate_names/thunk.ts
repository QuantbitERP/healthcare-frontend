// src/store/scheduleofChargeType/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ScheduleofChargeTypeService } from "@/api-client/services/ScheduleofChargeTypeService";
import {
  CreateScheduleofChargeTypeCommand,
  UpdateScheduleofChargeTypeCommand,
  ScheduleofChargeTypeSearchRequestDto,
  HospitalService,
} from "@/api-client";

// ✅ Create
export const createScheduleofChargeType = createAsyncThunk<
  any,
  {
    version: string;
    tenant?: string;
    data: CreateScheduleofChargeTypeCommand;
  },
  { rejectValue: string }
>(
  "scheduleofChargeType/create",
  async (
    {
      version,
      tenant,
      data,
    }: {
      version: string;
      tenant?: string;
      data: CreateScheduleofChargeTypeCommand;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ScheduleofChargeTypeService.postApiVScheduleofChargeTypeScheduleofchargetypeSave(
        version,
        tenant,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || 'Failed to create rate name');
    }
  }
);

// ✅ Update
export const updateScheduleofChargeType = createAsyncThunk<
  any,
  {
    version: string;
    tenant?: string;
    data: UpdateScheduleofChargeTypeCommand;
  },
  { rejectValue: string }
>(
  "scheduleofChargeType/update",
  async (
    {
      version,
      tenant,
      data,
    }: {
      version: string;
      tenant?: string;
      data: UpdateScheduleofChargeTypeCommand;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ScheduleofChargeTypeService.putApiVScheduleofChargeTypeScheduleofchargetypeUpdate(
        version,
        tenant,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message || 'Failed to update rate name');
    }
  }
);

// ✅ Delete
export const deleteScheduleofChargeType = createAsyncThunk(
  "scheduleofChargeType/delete",
  async (
    {
      version,
      tenant,
      data,
    }: {
      version: string;
      tenant?: string;
      data: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      return await ScheduleofChargeTypeService.deleteApiVScheduleofChargeTypeScheduleofchargetypeDelete(
        version,
        tenant,
        data
      );
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message);
    }
  }
);

// ✅ Get Filters
export const getScheduleofChargeTypeFilterType = createAsyncThunk(
  "scheduleofChargeType/getFilterType",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      return await ScheduleofChargeTypeService.getApiVScheduleofChargeTypeScheduleofChargeTypeFilterType(
        version,
        tenant
      );
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message);
    }
  }
);

// ✅ Get CreatedBy
export const getScheduleofChargeTypeCreatedBy = createAsyncThunk(
  "scheduleofChargeType/getCreatedBy",
  async (
    {
      version,
      tenant,
      
    }: { version: string; tenant?: string;},
    { rejectWithValue }
  ) => {
    try {
      return await ScheduleofChargeTypeService.getApiVScheduleofChargeTypeCreatedby(
        version,
        
        tenant
      );
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message);
    }
  }
);

// ✅ Search with Filters
export const searchScheduleofChargeType = createAsyncThunk(
  "scheduleofChargeType/search",
  async (
    {
      version,
      tenant,
      data,
    }: {
      version: string;
      tenant?: string;
      data?: ScheduleofChargeTypeSearchRequestDto;
    },
    { rejectWithValue }
  ) => {
    try {
      return await ScheduleofChargeTypeService.postApiVScheduleofChargeTypeGetScheduleofChargeTypeByFilterWithSearch(
        version,
        tenant,
        data
      );
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message);
    }
  }
);

// ✅ Get by Id
export const getScheduleofChargeTypeById = createAsyncThunk(
  "scheduleofChargeType/getById",
  async (
    { id, version, tenant }: { id: string; version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      return await ScheduleofChargeTypeService.getApiVScheduleofChargeTypeScheduleofChargeType(
        id,
        version,
        tenant
      );
    } catch (error: any) {
      return rejectWithValue(error?.body || error.message);
    }
  }
);

export const fetchScheduleofChargeTypeHospitalNames = createAsyncThunk(
  "scheduleofChargeType/fetchHospitals",
  async ({ version }: { version: string; tenant: string }) => {
    const [hospitalList] = await Promise.all([
      HospitalService.getApiVHospitalHospitals(version),
    ]);
    return {
      hospitalList,
    };
  }
);

export const fetchScheduleofChargeTypeList = createAsyncThunk(
  "scheduleofChargeType/typelist",
  async ({ version, tenant }: { version: string; tenant: string }) => {
    const [typeRes] = await Promise.all([
      ScheduleofChargeTypeService.getApiVScheduleofChargeTypeScheduleofChargeTypeFilterType(
        version,
        tenant
      ),
      
    ]);

    return {
      typeList: typeRes?.data?.items ?? [],
    };
  }
);


export const fetchScheduleofChargeTypeCreatedBy = createAsyncThunk(
  "scheduleofChargeType/fetchFilters",
  async ({ version, tenant }: { version: string; tenant: string;}) => {
    const [_createdByRes] = await Promise.all([
      
      ScheduleofChargeTypeService.getApiVScheduleofChargeTypeCreatedby(
        version,
        
        tenant
      ),
    ]);

    return {
      createdByList: _createdByRes?.data?.items ?? [],
    };
  }
);
