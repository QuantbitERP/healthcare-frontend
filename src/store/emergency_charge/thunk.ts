// src/store/emergency_charge_settings/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_TENANT, API_VERSION } from "@/utils/constants";
import { EmergencyChargeSettingsService } from "@/api-client/services/EmergencyChargeSettingsService";
import type {
  EmergencyChargeSettingsSearchRequestDto,
  EmergencyChargeSettingRequestDto,
} from "@/api-client";

// ✅ Fetch list with filters
export const fetchEmergencyChargeSettingsWithFilter = createAsyncThunk(
  "emergencyChargeSettings/fetchWithFilter",
  async (
    {
      version = API_VERSION,
      tenant = API_TENANT,
      filter,
    }: {
      version?: string;
      tenant?: string;
      filter?: EmergencyChargeSettingsSearchRequestDto;
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await EmergencyChargeSettingsService.postApiVEmergencyChargeSettingsGetHospitalFilterWithSearch(
          version,
          tenant,
          filter
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// ✅ Create
export const createEmergencyChargeSetting = createAsyncThunk(
  "emergencyChargeSettings/create",
  async (
    {
      version = API_VERSION,
      tenant = API_TENANT,
      data,
    }: {
      version?: string;
      tenant?: string;
      data: EmergencyChargeSettingRequestDto;
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await EmergencyChargeSettingsService.postApiVEmergencyChargeSettingsCreateEmergencyChargeSetting(
          version,
          tenant,
          data
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// ✅ Update
export const updateEmergencyChargeSetting = createAsyncThunk(
  "emergencyChargeSettings/update",
  async (
    {
      id,
      version = API_VERSION,
      tenant = API_TENANT,
      data,
    }: {
      id: string;
      version?: string;
      tenant?: string;
      data: EmergencyChargeSettingRequestDto;
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await EmergencyChargeSettingsService.putApiVEmergencyChargeSettings(
          id,
          version,
          tenant,
          data
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// ✅ Delete
export const deleteEmergencyChargeSettings = createAsyncThunk(
  "emergencyChargeSettings/delete",
  async (
    {
      version = API_VERSION,
      tenant = API_TENANT,
      ids,
    }: {
      version?: string;
      tenant?: string;
      ids: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await EmergencyChargeSettingsService.deleteApiVEmergencyChargeSettings(
          version,
          tenant,
          ids
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// ✅ Fetch single detail (for Edit Modal)
export const getEmergencyChargeSettingById = createAsyncThunk(
  "emergencyChargeSettings/getById",
  async (
    {
      id,
      version = API_VERSION,
      tenant = API_TENANT,
    }: {
      id: string;
      version?: string;
      tenant?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await EmergencyChargeSettingsService.getApiVEmergencyChargeSettings(
          id,
          version,
          tenant
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// ✅ Fetch createdBy & modifiedBy filters
export const fetchEmergencyChargeSettingFilters = createAsyncThunk(
  "emergencyChargeSettings/fetchFilters",
  async (
    {
      version = API_VERSION,
      tenant = API_TENANT,
    }: { version?: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const [createdBy, modifiedBy] = await Promise.all([
        EmergencyChargeSettingsService.getApiVEmergencyChargeSettingsCreatedByListForEmrCharSetting(
          version,
          tenant
        ),
        EmergencyChargeSettingsService.getApiVEmergencyChargeSettingsGetServicemodifiedByList(
          version,
          tenant
        ),
      ]);
      return { createdBy, modifiedBy };
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);
