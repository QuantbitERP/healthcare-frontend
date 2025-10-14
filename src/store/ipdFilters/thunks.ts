import { createAsyncThunk } from "@reduxjs/toolkit";
import { WardService, GenderService , IpdService, DoctorMasterService } from "@/services/api-client/"; 
import type { WardDto } from "@/services/api-client/";
import {  } from "@/services/api-client/";
import { GenderDto } from "@/services/api-client/";
import type { KVPairListResultModelResultModel } from "@/services/api-client/";
import { OpenAPI } from "@/services/api-client/";
import { request as __request } from "@/services/api-client/core/request";

export const fetchWardList = createAsyncThunk<
  WardDto[], 
  { version: string; tenant?: string }, 
  { rejectValue: string }
>(
  "ward/fetchWardList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await WardService.getApiVWardList(version, tenant);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch ward list");
    }
  }
);

export const fetchGenderList = createAsyncThunk<
  GenderDto[],
  { version: string; tenant?: string }
>("gender/fetchGenderList", async ({ version, tenant }, { rejectWithValue }) => {
  try {
    const response = await GenderService.getApiVGenderList(version, tenant);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch gender list");
  }
});

export const fetchIpdPaidStatus = createAsyncThunk(
  "ipd/fetchPaidStatus",
  async ({ version, tenant }: { version: string; tenant?: string }, { rejectWithValue }) => {
    try {
      const response = await IpdService.getApiVIpdPaidStatus(version, tenant);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch IPD Paid Status");
    }
  }
);

export const fetchCreatedByList = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "ipd/fetchCreatedByList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await DoctorMasterService.getApiVDoctorMasterGetCreatedBy(version, tenant);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Created By list");
    }
  }
);

export const fetchModifiedByList = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "ipd/fetchModifiedByList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await __request(OpenAPI, {
        method: 'GET',
        url: `/api/v${version}/IPD/modifieby`,
        headers: {
          'accept': 'text/plain',
          'tenant': tenant,
        },
      });
      return response as KVPairListResultModelResultModel;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Modified By list");
    }
  }
);