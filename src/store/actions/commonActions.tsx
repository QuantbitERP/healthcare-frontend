import { createAsyncThunk } from "@reduxjs/toolkit";
import generateApiURL from "..";

// API URLs
const SERVICE_LIST_URL = generateApiURL("/services");
const SERVICE_STATS_URL = generateApiURL("/services/stats");
const ADD_SERVICE_URL = generateApiURL("/api/mn/services");

interface FetchServiceParams {
  search?: string;
  department_id?: number;
  sub_department_id?: number;
  status?: "active" | "inactive";
  code_type?: string;
  hospital_id?: number;
  operation_category?: string;
  created_by?: string;
  modified_by?: string;
  rate_name?: string;
  daily_auto_charges?: boolean;
  one_time_service?: boolean;
  me_mode?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Types
export interface Service {
  hospitals: never[];
  code: string | number;
  code_type_id: string | number;
  service_group_id: string | number;
  sub_sub_department_id: string | number;
  operation_category_id: string | number;
  service_sub_group_id: string | number;
  restriction_type_id: string | number;
  time: string | number;
  repeatable_type_id: string | number;
  id: number;
  alias?: string;
  name: string;
  code_type: string;
  service_code: string;
  status: string;
  department_id: number;
  department_name: string;
  sub_department_id: number;
  sub_department_name: string;
  hospital_id: number;
  hospital_name: string;
}

export interface Meta {
  current_page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: string;
  total_count: number;
  total_pages: number;
}

export interface ServiceStats {
  total_count: number;
  active_count: number;
  deactive_count: number;
}

function buildQueryParams(params: FetchServiceParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

// Thunks
export const fetchServiceList = createAsyncThunk<
  { services: Service[]; meta: Meta },
  FetchServiceParams,
  { rejectValue: string }
>("services/fetchList", async (params, { rejectWithValue }) => {
  try {
    const queryString = buildQueryParams(params);
    const res = await fetch(`${SERVICE_LIST_URL}?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch service list");
    return await res.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchServiceStats = createAsyncThunk<
  ServiceStats,
  void,
  { rejectValue: string }
>("services/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(SERVICE_STATS_URL);
    if (!res.ok) throw new Error("Failed to fetch service stats");
    const data = await res.json();
    return data.service_stats;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface AddServicePayload {
  id?: number;
  name: string;
  code: string;
  alias_name: string;
  code_type_id: number;
  department_id: number;
  sub_department_id: number;
  service_group_id: number;
  service_sub_group_id: number;
  operation_category_id: number;
  sub_sub_department_id: number;
  restriction_type_id: number;
  repeatable_type_id: number;
  time: string;
  time_days_list_id: number;
}

export const addService = createAsyncThunk<
  string, // return message
  { body: AddServicePayload; onSuccess?: (msg: string) => void }, // input
  { rejectValue: string }
>("services/addService", async ({ body, onSuccess }, { rejectWithValue }) => {
  try {
    const res = await fetch(ADD_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add service");
    }

    const result = await res.json(); // Assume backend returns { message: "Service added successfully" }
    const message = result.message || "Service added successfully";

    if (onSuccess) onSuccess(message); // call callback

    return message;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const SERVICE_INFO_URL = (id: number) => generateApiURL(`/services/${id}/edit`);
const SERVICE_COMPOSITE_URL = (id: number) =>
  generateApiURL(`/services/${id}/composite`);
const SERVICE_HOSPITALS_URL = (id: number) =>
  generateApiURL(`/services/${id}/hospitals`);

export const getServiceInfo = createAsyncThunk<
  Service,
  number,
  { rejectValue: string }
>("services/getServiceInfo", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(SERVICE_INFO_URL(id));
    if (!res.ok) throw new Error("Failed to fetch service info");
    const data = await res.json();
    const [compositeRes, hospitalsRes] = await Promise.all([
      fetch(SERVICE_COMPOSITE_URL(id)),
      fetch(SERVICE_HOSPITALS_URL(id)),
    ]);

    if (!compositeRes.ok) {
      data.composite = null;
    } else {
      data.composite = await compositeRes.json();
    }
    if (!hospitalsRes.ok) {
      data.hospitals = null;
    } else {
      data.composite = await hospitalsRes.json();
    }
    return data; // adjust if structure is different
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// ==== GENERIC THUNK CREATOR ====
function createListThunk<T>(name: string, endpoint: string) {
  return createAsyncThunk<T[], void, { rejectValue: string }>(
    `services/${name}`,
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch(generateApiURL(endpoint));
        if (!res.ok) throw new Error(`Failed to fetch ${name}`);
        const result = await res.json();

        return result.departments
          ? result.departments
          : result.sub_departments
          ? result.sub_departments
          : result.statuses
          ? result.statuses
          : result.code_types
          ? result.code_types
          : result.hospitals
          ? result.hospitals
          : result.hospitals
          ? result.hospitals
          : result;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
}

interface ListItem {
  id: number;
  name: string;
}

export const fetchDepartments = createListThunk<ListItem>(
  "fetchDepartments",
  "/departments"
);
export const fetchSubDepartments = createListThunk<ListItem>(
  "fetchSubDepartments",
  "/sub_departments"
);
export const fetchSubSubDepartments = createListThunk<ListItem>(
  "fetchSubSubDepartments",
  "/sub_sub_departments"
);
export const fetchStatuses = createListThunk<ListItem>(
  "fetchStatuses",
  "/statuses"
);
export const fetchCodeTypes = createListThunk<ListItem>(
  "fetchCodeTypes",
  "/code_types"
);
export const fetchHospitals = createListThunk<ListItem>(
  "fetchHospitals",
  "/hospitals"
);
export const fetchOperationCategories = createListThunk<ListItem>(
  "fetchOperationCategories",
  "/operation_categories"
);
export const fetchServiceRates = createListThunk<ListItem>(
  "fetchServiceRates",
  "/services/rates"
);

export const fetchServiceGroups = createListThunk<ListItem>(
  "fetchServiceGroups",
  "/service_groups"
);
export const fetchSubServiceGroups = createListThunk<ListItem>(
  "fetchSubServiceGroups",
  "/service_sub_groups"
);

export const fetchRestrictionTypes = createListThunk<ListItem>(
  "fetchRestrictionTypes",
  "/restriction_types"
);

export const fetchRepeatableTypes = createListThunk<ListItem>(
  "fetchRepeatableTypes",
  "/repeatable_types"
);
export const fetchTimeDaysList = createListThunk<ListItem>(
  "fetchTimeDaysList",
  "/time_days_list"
);

const COMPOSITE_SERVICE_LIST_URL = generateApiURL("/services_list");

export const fetchCompositeServiceList = createAsyncThunk<
  { services: Service[]; meta: Meta },
  FetchServiceParams,
  { rejectValue: string }
>("fetchCompositeServiceList", async (params, { rejectWithValue }) => {
  try {
    const queryString = buildQueryParams(params);
    const res = await fetch(`${COMPOSITE_SERVICE_LIST_URL}?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch service list");
    return await res.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const ADD_COMPOSITE_SERVICE_LIST = generateApiURL("/services");

export const addCompositeServiceList = createAsyncThunk<
  { success: boolean; message: string },
  {
    id: string | number;
    body: any;
  },
  { rejectValue: string }
>(
  "addCompositeServiceList",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${ADD_COMPOSITE_SERVICE_LIST}/${id}/composite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to fetch service list");
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const FETCH_EMPLOYEE_LIST_URL = generateApiURL("/employees");

export const fetchEmployees = createAsyncThunk<
  { employees: Service[]; meta: Meta },
  FetchServiceParams,
  { rejectValue: string }
>("fetchEmployees", async (params, { rejectWithValue }) => {
  try {
    const queryString = buildQueryParams(params);
    const res = await fetch(`${FETCH_EMPLOYEE_LIST_URL}?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch service list");
    return await res.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// servicesThunks.ts
interface DeactivateServicePayload {
  id: string;
}

interface DeactivateServiceResponse {
  success: boolean;
  message: string;
}

export const deactivateService = createAsyncThunk<
  DeactivateServiceResponse, // return type
  DeactivateServicePayload, // input type
  { rejectValue: { message: string } } // error type
>("services/deactivateService", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/mn/services/${id}/deactivate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue({
        message: errorData.message || "Failed to deactivate service",
      });
    }

    const data: DeactivateServiceResponse = await response.json();
    return data;
  } catch {
    return rejectWithValue({ message: "Network error or unexpected failure" });
  }
});
