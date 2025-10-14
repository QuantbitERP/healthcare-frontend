import { createAsyncThunk } from "@reduxjs/toolkit";
function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}
export type Service = {
  service_code: string;
  service_id: number;
  service_name: string;
  department: string;
  service_group: string;
  outpatient_general: number;
  outpatient_special: number;
  super_speciality_opd: number;
  health_check: number;
};

export type Meta = {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
};

export type ServicesResponse = {
  services: Service[];
  meta: Meta;
};

export type RateStats = {
  total_count: number;
  active_count: number;
  deactive_count: number;
};

// 👉 Utility to build query string
const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

// 👇 Async thunk using fetch

const RATE_LIST_API = generateApiURL("/services_list");
const RATE_STATES_API = generateApiURL("/rates/stats");
const RATE_UPLOAD_API = generateApiURL("/rates/upload");

export const fetchServiceRatesList = createAsyncThunk<
  ServicesResponse,
  {
    search?: string;
    department?: string;
    service_group?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    per_page?: number;
  }
>("fetchServiceRatesList", async (params, { rejectWithValue }) => {
  try {
    const queryString = buildQuery(params);
    const response = await fetch(`${RATE_LIST_API}?${queryString}`);

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    const data = await response.json();
    return data as ServicesResponse;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

type RateStatsResponse = {
  rate_stats: RateStats;
};

export const fetchRateStats = createAsyncThunk<RateStatsResponse>(
  "fetchRateStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(RATE_STATES_API);

      if (!response.ok) {
        throw new Error("Failed to fetch rate statistics");
      }

      const data = await response.json();
      return data as RateStatsResponse;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

export const uploadRatesExcel = createAsyncThunk<
  any, // Replace with your API response type
  FormData,
  { rejectValue: string }
>("rates/uploadRatesExcel", async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch(RATE_UPLOAD_API, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.message || "Upload failed");
    }

    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message || "Upload failed");
  }
});
