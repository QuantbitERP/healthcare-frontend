import { createAsyncThunk } from "@reduxjs/toolkit";

function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}

// Types for Doctor Wise Settings
export type DoctorWiseSettingItem = {
  doctorID: string;
  doctorName: string;
  applicableDate: string;
  status: string;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
};

export type PaginationMetadata = {
  page: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
};

export type DoctorWiseSettingsResponse = {
  data: {
    items: DoctorWiseSettingItem[];
    metadata: PaginationMetadata;
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
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
  validationErrors: any | null;
  errorCode: string | null;
};

// Request payload type
export type DoctorWiseSettingsListRequest = {
  status?: number[];
  createdBy?: string[];
  modifiedBy?: string[];
  currentApplicable?: boolean;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
};

// API endpoints
const DOCTOR_WISE_SETTINGS_LIST_API = generateApiURL("DoctorWiseSetting/list");
const BILL_TYPE_LIST_API = generateApiURL("Common/billTypeList");
const PATIENT_CATEGORY_LIST_API = generateApiURL("PatientCategoryMaster/getPatientCategoryList");
const CREATED_BY_LIST_API = generateApiURL("DoctorMaster/getCreatedBy");
const MODIFIED_BY_LIST_API = generateApiURL("DoctorMaster/getModifiedbyUser");

// Fetch Doctor Wise Settings List
export const fetchDoctorWiseSettingsList = createAsyncThunk<
  DoctorWiseSettingsResponse,
  DoctorWiseSettingsListRequest,
  { rejectValue: string }
>("doctorWiseSettings/fetchList", async (params, { rejectWithValue }) => {
  try {
    const requestBody = {
      status: params.status || [1],
      createdBy: params.createdBy || [],
      modifiedBy: params.modifiedBy || [],
      currentApplicable: params.currentApplicable !== undefined ? params.currentApplicable : false,
      searchTerm: params.searchTerm || "",
      page: params.page || 1,
      pageSize: params.pageSize || 100,
    };

    const response = await fetch(DOCTOR_WISE_SETTINGS_LIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as DoctorWiseSettingsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch Doctor Wise Settings list");
  }
});

export const fetchBillTypeListForSettings = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("doctorWiseSettings/fetchBillTypeList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(BILL_TYPE_LIST_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch bill type list");
  }
});

// Fetch Patient Category List
export const fetchPatientCategoryListForSettings = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("doctorWiseSettings/fetchPatientCategoryList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(PATIENT_CATEGORY_LIST_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch patient category list");
  }
});


// Fetch Created By List
export const fetchCreatedByListForSettings = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("doctorWiseSettings/fetchCreatedByList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(CREATED_BY_LIST_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch created by list");
  }
});

// Fetch Modified By List
export const fetchModifiedByListForSettings = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("doctorWiseSettings/fetchModifiedByList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(MODIFIED_BY_LIST_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch modified by list");
  }
});