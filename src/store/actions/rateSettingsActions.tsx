import { createAsyncThunk } from "@reduxjs/toolkit";

function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}

// Types for Rate Settings
export type RateSettingItem = {
  rateSettingId: string;
  rateName: string;
  hospital: string;
  department: string;
  rateCategory: string;
  applicableFrom: string;
  status: string;
  modifiedOn: string | null;
  modifiedBy: string | null;
  createdDate: string;
  createdBy: string;
};

// Filter option types
export type FilterOption = {
  key: string;
  value: string;
};

export type FilterOptionsResponse = {
  data: {
    items: FilterOption[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type HospitalServiceResponse = {
  data: {

      serviceId: string;
      serviceName: string;
      internationalCode: string;
      isCompositeService: boolean;
      compositeServices: any[];
    }[];

  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type RateSettingResponse = {
  data: {
    items: RateSettingItem[];
   metadata:{ page: {
                currentPage: number,
                pageSize: number,
                totalPages:number 
    } 
  }
  };
  errorCode: string | null;
  errorMessage: string | null;
};

// Request payload type
export type RateSettingListRequest = {
  hospitalId?: string;
  departmentIdList?: string[];
  rateNameList?: string[];
  rateCatList?: string[];
  status?: string[];
  createdByList?: string[];
  modifiedByList?: string[];
  currentApplicable?: boolean;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
};

// API endpoints
const RATE_SETTING_LIST_API = generateApiURL("RateSetting/list");
const HOSPITALS_API = generateApiURL("Hospital/hospitals");
const HOSPITAL_DEPARTMENTS_API = generateApiURL("Hospital/HospitalwiseHospitaldepartments");
const HOSPITAL_RATE_NAMES_API = generateApiURL("RateSetting/hospital-ratenames");
const HOSPITAL_DOCTORS_API = generateApiURL("Hospital/HospitalDoctors");
const HOSPITAL_SERVICES_API = generateApiURL("RateSetting/GetServicesByHospitalDepartmentId");
const BILLING_CLASSES_API = generateApiURL("IPD/billingClassList");
const RATE_TYPES_API = generateApiURL("RateSetting/rate-types");
const RATE_SETTING_ENUM_API = generateApiURL("RateSetting/RateSettingEnum");
const STATUS_API = generateApiURL("Common/status");
const MODIFIED_BY_USERS_API = generateApiURL("RateSetting/modified-by-users");
const CREATED_BY_USERS_API = generateApiURL("RateSetting/created-by-users");
const RATE_SETTING_EXPORT_EXCEL_API = generateApiURL("RateSetting/ratesetting/excel");

// Fetch Rate Settings List
export const fetchRateSettingsList = createAsyncThunk<
  RateSettingResponse,
  RateSettingListRequest,
  { rejectValue: string }
>("rateSettings/fetchList", async (params, { rejectWithValue }) => {
  try {
    const response = await fetch(RATE_SETTING_LIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
      },
      body: JSON.stringify({
        hospitalIdList: params.hospitalId ? [params.hospitalId] : [],
        departmentIdList: params.departmentIdList || [],
        rateNameList: params.rateNameList || [],
        rateCatList: params.rateCatList || [],
        status: params.status || [],
        createdByList: params.createdByList || [],
        modifiedByList: params.modifiedByList || [],
        currentApplicable: params.currentApplicable ?? true,
        searchTerm: params.searchTerm || "",
        page: params.page || 1,
        pageSize: params.pageSize || 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data as RateSettingResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch rate settings list"
    );
  }
});

// Fetch Hospitals
export const fetchHospitals = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchHospitals", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(HOSPITALS_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch hospitals"
    );
  }
});

// Fetch Hospital Departments
export const fetchHospitalDepartments = createAsyncThunk<
  FilterOptionsResponse,
  string,
  { rejectValue: string }
>("rateSettings/fetchHospitalDepartments", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${HOSPITAL_DEPARTMENTS_API}/${hospitalId}`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch hospital departments"
    );
  }
});

// Fetch Hospital Rate Names
export const fetchHospitalRateNames = createAsyncThunk<
  FilterOptionsResponse,
  string,
  { rejectValue: string }
>("rateSettings/fetchHospitalRateNames", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${HOSPITAL_RATE_NAMES_API}/${hospitalId}`, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch hospital rate names"
    );
  }
});

// Fetch Hospital Doctors
export const fetchHospitalDoctors = createAsyncThunk<
  FilterOptionsResponse,
  string,
  { rejectValue: string }
>("rateSettings/fetchHospitalDoctors", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${HOSPITAL_DOCTORS_API}/${hospitalId}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch hospital doctors"
    );
  }
});

// Fetch Hospital Services
export const fetchHospitalServices = createAsyncThunk<
  HospitalServiceResponse,
  string,
  { rejectValue: string }
>("rateSettings/fetchHospitalServices", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${HOSPITAL_SERVICES_API}/${hospitalId}`, {
      method: "GET",
      headers: {
       "accept": "*/*",
       "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as HospitalServiceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch hospital services"
    );
  }
});

// Fetch Billing Classes
export const fetchBillingClasses = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchBillingClasses", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(BILLING_CLASSES_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data: { items: data }, isError: false, errorMessage: null, validationErrors: null, errorCode: null } as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch billing classes"
    );
  }
});

// Save Rate Setting
export const saveRateSetting = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("rateSettings/saveRateSetting", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${generateApiURL("RateSetting/Save")}`, {
      method: "POST",
      headers: {
        "accept": "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to save rate setting"
    );
  }
});

// Update Rate Setting
export const updateRateSetting = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("rateSettings/updateRateSetting", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${generateApiURL("RateSetting")}`, {
      method: "PUT",
      headers: {
        "accept": "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to update rate setting"
    );
  }
});

// Fetch Rate Setting by ID
export const fetchRateSettingById = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("rateSettings/fetchRateSettingById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${generateApiURL(`RateSetting/${id}`)}`, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch rate setting"
    );
  }
});

// Fetch Rate Types
export const fetchRateTypes = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchRateTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(RATE_TYPES_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch rate types"
    );
  }
});

// Fetch Rate Setting Enum (Rate Categories)
export const fetchRateSettingEnum = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchRateSettingEnum", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(RATE_SETTING_ENUM_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch rate setting enum"
    );
  }
});

// Fetch Statuses
export const fetchStatuses = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchStatuses", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(STATUS_API, {
      method: "POST",
      headers: {
        "accept": "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch statuses"
    );
  }
});

// Fetch Modified By Users
export const fetchModifiedByUsers = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchModifiedByUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(MODIFIED_BY_USERS_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch modified by users"
    );
  }
});

// Fetch Created By Users
export const fetchCreatedByUsers = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("rateSettings/fetchCreatedByUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(CREATED_BY_USERS_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch created by users"
    );
  }
});

// Delete Rate Setting
export const deleteRateSetting = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("rateSettings/deleteRateSetting", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${generateApiURL("RateSetting/Delete")}`, {
      method: "DELETE",
      headers: {
        "accept": "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id]),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to delete rate setting"
    );
  }
});

// Export Rate Settings to Excel
export const exportRateSettingsExcel = createAsyncThunk<
  Blob,
  void,
  { rejectValue: string }
>("rateSettings/exportExcel", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(RATE_SETTING_EXPORT_EXCEL_API, {
      method: "POST",
      headers: {
        "accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to export rate settings to Excel");
  }
});
