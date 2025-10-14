import { createAsyncThunk } from "@reduxjs/toolkit";

function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}

// Types for OT Service Percentage
export type OTServicePercentageItem = {
  id: string;
  category: string;
  hospitalName: string;
  departmentName: string;
  rateName: string;
  companyName: string;
  applicableFor: string;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
};

export type Meta = {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
};

export type OTServicePercentageResponse = {
  data: {
    items: OTServicePercentageItem[];
    metadata: {
      page: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalCount?: number;
      };
    };
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

export type ServicesResponse = {
  data: FilterOption[];
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

// API endpoints
const OT_SERVICE_PERCENTAGE_LIST_API = generateApiURL("OTServicePercentage/list");
const OT_SERVICE_PERCENTAGE_APPLICABLE_FOR_API = generateApiURL("OTServicePercentage/ApplicableFor");
const HOSPITAL_HOSPITALS_API = generateApiURL("Hospital/hospitals");
const HOSPITAL_WISE_DEPARTMENTS_API = generateApiURL("Hospital/Hospitalwisedepartments");
const PATIENT_COMPANY_RATE_NAME_API = generateApiURL("PatientCompanyMaster/getRateNameList");
const PATIENT_COMPANY_COMPANIES_API = generateApiURL("PatientCompanyMaster/patientcompanies");
const OT_SERVICE_PERCENTAGE_CREATED_BY_API = generateApiURL("OTServicePercentage/GetCreatedByList");
const OT_SERVICE_PERCENTAGE_MODIFIED_BY_API = generateApiURL("OTServicePercentage/GetModifiedByList");
const OT_SERVICE_PERCENTAGE_SERVICES_API = generateApiURL("OTServicePercentage/Services");
const OT_SERVICE_PERCENTAGE_BILLING_CLASSES_API = generateApiURL("IPD/billingClassList");
const OT_SERVICE_PERCENTAGE_SAVE_API = generateApiURL("OTServicePercentage/Save");
const OT_SERVICE_PERCENTAGE_GET_BY_ID_API = generateApiURL("OTServicePercentage");
const OT_SERVICE_PERCENTAGE_UPDATE_API = generateApiURL("OTServicePercentage");
const OT_SERVICE_PERCENTAGE_DELETE_API = generateApiURL("OTServicePercentage/Delete");
const OT_SERVICE_PERCENTAGE_EXPORT_EXCEL_API = generateApiURL("OTServicePercentage/OTServicePercentageExcel/excel");
const OPERATION_CATEGORY_DROPDOWN_API = generateApiURL("OperationCategory/getOperationCategoryDropdownList");

// Request payload type
export type OTServicePercentageListRequest = {
  searchTerm?: string;
  applicableForList?: string[];
  hospitalList?: string[];
  departmentList?: string[];
  ratenameList?: string[];
  companyList?: string[];
  createdbyList?: string[];
  modifiedbyList?: string[];
  page?: number;
  pageSize?: number;
};

// Fetch OT Service Percentage List
export const fetchOTServicePercentageList = createAsyncThunk<
  OTServicePercentageResponse,
  OTServicePercentageListRequest,
  { rejectValue: string }
>("otServicePercentage/fetchList", async (params, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_LIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify({
        searchTerm: params.searchTerm || "",
        applicableForList: params.applicableForList || [],
        hospitalList: params.hospitalList || [],
        departmentList: params.departmentList || [],
        ratenameList: params.ratenameList || [],
        companyList: params.companyList || [],
        createdbyList: params.createdbyList || [],
        modifiedbyList: params.modifiedbyList || [],
        page: params.page || 1,
        pageSize: params.pageSize || 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as OTServicePercentageResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch OT Service Percentage list");
  }
});

// Fetch Applicable For Options
export const fetchApplicableForOptions = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchApplicableFor", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_APPLICABLE_FOR_API, {
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
    return rejectWithValue(error.message || "Failed to fetch applicable for options");
  }
});

// Fetch Hospitals
export const fetchHospitals = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchHospitals", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(HOSPITAL_HOSPITALS_API, {
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
    return rejectWithValue(error.message || "Failed to fetch hospitals");
  }
});

// Fetch Departments
export const fetchDepartments = createAsyncThunk<
  FilterOptionsResponse,
  { hospitalIds: string[] },
  { rejectValue: string }
>("otServicePercentage/fetchDepartments", async ({ hospitalIds }, { rejectWithValue }) => {
  try {
    const response = await fetch(HOSPITAL_WISE_DEPARTMENTS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify({
        hospitalId: hospitalIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilterOptionsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch departments");
  }
});

// Fetch Rate Names
export const fetchRateNames = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchRateNames", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(PATIENT_COMPANY_RATE_NAME_API, {
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
    return rejectWithValue(error.message || "Failed to fetch rate names");
  }
});

// Fetch Companies
export const fetchCompanies = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(PATIENT_COMPANY_COMPANIES_API, {
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
    return rejectWithValue(error.message || "Failed to fetch companies");
  }
});

// Fetch Created By List
export const fetchCreatedByList = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchCreatedByList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_CREATED_BY_API, {
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
export const fetchModifiedByList = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchModifiedByList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_MODIFIED_BY_API, {
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

// Fetch Services
export const fetchServices = createAsyncThunk<
  ServicesResponse,
  { hospitalId: string },
  { rejectValue: string }
>("otServicePercentage/fetchServices", async ({ hospitalId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${OT_SERVICE_PERCENTAGE_SERVICES_API}?Hospid=${hospitalId}`, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as ServicesResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch services");
  }
});

// Fetch Billing Classes
export const fetchBillingClasses = createAsyncThunk<
  FilterOption[],
  void,
  { rejectValue: string }
>("otServicePercentage/fetchBillingClasses", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_BILLING_CLASSES_API, {
      method: "GET",
      headers: {
        "accept": "text/plain",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as FilterOption[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch billing classes");
  }
});

// Fetch Operation Categories
export const fetchOperationCategories = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>("otServicePercentage/fetchOperationCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OPERATION_CATEGORY_DROPDOWN_API, {
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
    return rejectWithValue(error.message || "Failed to fetch operation categories");
  }
});

// Save OT Service Percentage Request/Response types
export type RoomCategory = {
  roomCategoryId: string;
  amountorPercentage: number;
};

export type CappingRoomCategory = {
  cappingRoomCategoryId: string;
  cappingAmountorPercentage: number;
};

export type ServiceDetail = {
  serviceId: string;
  serviceCode: string;
  baseHours: number;
  cappingHours: number;
  isCapping: boolean;
  roomCategory: RoomCategory[];
  cappingRoomCategory: CappingRoomCategory[];
};

// Edit types with additional fields
export type RoomCategoryEdit = {
  detailID?: string;
  roomCategoryId: string;
  amountorPercentage: number;
};

export type CappingRoomCategoryEdit = {
  detailID?: string;
  cappingRoomCategoryId: string;
  cappingAmountorPercentage: number;
};

export type ServiceDetailEdit = {
  servicePercentageId?: string;
  serviceId: string;
  serviceCode: string;
  baseHours: number;
  cappingHours: number;
  isCapping: boolean;
  roomCategory: RoomCategoryEdit[];
  cappingRoomCategory: CappingRoomCategoryEdit[];
};

export type OTServicePercentageSaveRequest = {
  model: {
    hospitalId: string;
    categoryId: string;
    rateNameId: string;
    companyId: string;
    departmentId: string;
    percentage: boolean;
    isCathlabApplicable: boolean;
    servicesDetail: ServiceDetail[];
  };
};

export type OTServicePercentageUpdateRequest = {
  model: {
    otServicePercentageId: string;
    hospitalId: string;
    categoryId: string;
    rateNameId: string;
    companyId: string;
    departmentId: string;
    isPercentage: boolean;
    isCathlabApplicable: boolean;
    servicesDetail: ServiceDetailEdit[];
  };
};

export type OTServicePercentageDeleteRequest = {
  model: {
    ids: string[];
  };
};

export type OTServicePercentageDeleteResponse = {
  data: any;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

export type OTServicePercentageSaveResponse = {
  data: any;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

// Get OT Service Percentage by ID types
export type RoomCategoryResponse = {
  roomCategoryId: string;
  roomCategoryName: string;
  amountorPercentage: number;
  detailID?: string;
};

export type CappingRoomCategoryResponse = {
  cappingRoomCategoryId: string;
  cappingRoomCategoryName: string;
  cappingAmountorPercentage: number;
  detailID?: string;
};

export type ServiceDetailResponse = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  baseHours: number;
  cappingHours: number;
  isCapping: boolean;
  servicePercentageId?: string;
  roomCategorys: RoomCategoryResponse[];
  cappingRoomCategorys: CappingRoomCategoryResponse[];
};

export type OTServicePercentageDetail = {
  id: string;
  hospitalId: string;
  categoryId: string;
  otServiceNameId: string;
  rateNameId: string;
  companyId: string;
  departmentId: string;
  percentage: boolean;
  isCathlabApplicable: boolean;
  servicesDetails: ServiceDetailResponse[];
};

export type OTServicePercentageGetResponse = {
  data: OTServicePercentageDetail;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any | null;
  errorCode: string | null;
};

// Save OT Service Percentage
export const saveOTServicePercentage = createAsyncThunk<
  OTServicePercentageSaveResponse,
  OTServicePercentageSaveRequest,
  { rejectValue: string }
>("otServicePercentage/save", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_SAVE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API returned an error in the response body
    if (data.isError) {
      throw new Error(data.errorMessage || "API returned an error");
    }
    
    return data as OTServicePercentageSaveResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to save OT Service Percentage");
  }
});

// Update OT Service Percentage
export const updateOTServicePercentage = createAsyncThunk<
  OTServicePercentageSaveResponse,
  OTServicePercentageUpdateRequest,
  { rejectValue: string }
>("otServicePercentage/update", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_UPDATE_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API returned an error in the response body
    if (data.isError) {
      throw new Error(data.errorMessage || "API returned an error");
    }
    
    return data as OTServicePercentageSaveResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update OT Service Percentage");
  }
});

// Delete OT Service Percentage
export const deleteOTServicePercentage = createAsyncThunk<
  OTServicePercentageDeleteResponse,
  OTServicePercentageDeleteRequest,
  { rejectValue: string }
>("otServicePercentage/delete", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_DELETE_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API returned an error in the response body
    if (data.isError) {
      throw new Error(data.errorMessage || "API returned an error");
    }
    
    return data as OTServicePercentageDeleteResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete OT Service Percentage");
  }
});

// Export OT Service Percentage to Excel
export const exportOTServicePercentageExcel = createAsyncThunk<
  Blob,
  void,
  { rejectValue: string }
>("otServicePercentage/exportExcel", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(OT_SERVICE_PERCENTAGE_EXPORT_EXCEL_API, {
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
    return rejectWithValue(error.message || "Failed to export OT Service Percentage to Excel");
  }
});

// Fetch OT Service Percentage by ID
export const fetchOTServicePercentageById = createAsyncThunk<
  OTServicePercentageGetResponse,
  { id: string },
  { rejectValue: string }
>("otServicePercentage/fetchById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${OT_SERVICE_PERCENTAGE_GET_BY_ID_API}/${id}`, {
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
    return data as OTServicePercentageGetResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch OT Service Percentage");
  }
});
