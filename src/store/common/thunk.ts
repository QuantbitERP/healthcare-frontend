import { createAsyncThunk } from "@reduxjs/toolkit";
import { CommonService} from "@/api-client";
import { API_TENANT, API_VERSION } from "@/utils/constants";
import { DistrictRequestDto, StateRequestDto } from "@/api-client/models/CommonRequestDto";


// ✅ Fetch Country List
export const fetchCountries = createAsyncThunk(
  "common/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonCountry(API_VERSION, API_TENANT, {});
      return response?.data?.items ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch countries");
    }
  }
);

// ✅ Fetch State List based on Country
export const fetchStates = createAsyncThunk(
  "common/fetchStates",
  async (countryId: string, { rejectWithValue }) => {
    try {
    //   const payload: CommonRequestDto = { id: countryId };
    const payload: StateRequestDto = { countryId };
      const response = await CommonService.postApiVCommonState(API_VERSION, API_TENANT, payload);
      return response?.data?.items ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch states");
    }
  }
);

// ✅ Fetch District List based on State
export const fetchDistricts = createAsyncThunk(
  "common/fetchDistricts",
  async (stateId: string, { rejectWithValue }) => {
    try {
    //   const payload: CommonRequestDto = { id: stateId };
    const payload: DistrictRequestDto = { state_Id: stateId };
      const response = await CommonService.postApiVCommonDistrict(API_VERSION, API_TENANT, payload);
      return response?.data?.items ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch districts");
    }
  }
);

// ✅ Fetch City List based on District
export const fetchCities = createAsyncThunk(
  "common/fetchCities",
  async (districtId: string, { rejectWithValue }) => {
    try {
    //   const payload: CommonRequestDto = { id: districtId };
      const payload: DistrictRequestDto = { state_Id: districtId };
      const response = await CommonService.postApiVCommonCity(API_VERSION, API_TENANT, payload);
      return response?.data?.items ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cities");
    }
  }
);

// ✅ Fetch Status List (generic)
export const fetchStatusListCommon = createAsyncThunk(
  "common/fetchStatusList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommonService.postApiVCommonStatus(API_VERSION, API_TENANT);
      return response?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch status list");
    }
  }
);
