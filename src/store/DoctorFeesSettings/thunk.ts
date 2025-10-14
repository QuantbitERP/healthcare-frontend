import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  DoctorProfessionalFeeSettingService,
  DoctorBasicAmountSettingService,
  PaymentReceivedService,
  DoctorMasterService,
  DepartmentsService,
  PayoutAdjustmentMasterService,
  ExclusionSettingsService,
  DoctorWiseSettingService,
  ModeOfPaymentService,
} from "@/services/api-client";
import { API_TENANT } from "@/utils/constants";

function generateApiURL(url: string) {
  return process.env.NEXT_PUBLIC_BASEAPI_URL! + `/api/v1/` + url;
}
import {
  fetchDoctorWiseSettingsList,
  fetchCreatedByListForSettings,
  fetchModifiedByListForSettings,
  DoctorWiseSettingsListRequest,
  DoctorWiseSettingItem
} from "../actions/doctorWiseSettingsActions";

// Types for API requests and responses
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface DoctorBasicAmountSettingListRequest extends PaginationParams {
  doctorId?: string;
  modifiedByList?: string[];
  createdByList?: string[];
  status?: string;
}

export interface PayoutAdjustmentMasterListRequest extends PaginationParams {
  status?: number[];
  modifiedByList?: string[];
  createdByList?: string[];
}

// ==================== EXCLUSION SETTINGS INTERFACES ====================

// Doctor Type By Service
interface DoctorTypeByServiceListRequest extends PaginationParams {
  searchTerm?: string;
  createdByList?: string[];
  modifiedByList?: string[];
  pageNumber?: number;
}

// Category By Doctor Type  
interface CategoryByDoctorTypeListRequest extends PaginationParams {
  searchTerm?: string;
  categoryList?: string[];
  createdbyList?: string[];
  modifiedbyList?: string[];
}

// Doctor Type By Department
interface DoctorTypeByDepartmentListRequest extends PaginationParams {
  departmentIds?: string[];
  createdByIds?: string[];
  modifiedByIds?: string[];
  searchTerm?: string;
}

// Patient Type By Bill Type  
interface PatientTypeByBillTypeListRequest extends PaginationParams {
  searchTerm?: string;
  billTypeList?: string[];
  createdbyList?: string[];
  modifiedbyList?: string[];
}

// Patient Type By Service
interface PatientTypeByServiceListRequest extends PaginationParams {
  searchTerm?: string;
  createdByList?: string[];
  modifiedByList?: string[];
  pageNumber?: number;
}

// Version and tenant constants - these should ideally come from config
const API_VERSION = "1";
const TENANT = "1"; // This should be dynamic based on user context

// ==================== BASIC SETTINGS ====================

// Fetch Professional Fees Basic Settings
export const fetchProfessionalFeesBasicSettings = createAsyncThunk(
  "doctorFeesSettings/fetchProfessionalFeesBasicSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoctorProfessionalFeeSettingService.getApiVDoctorProfessionalFeeSetting(
        API_VERSION,
        TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch professional fees settings");
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch professional fees settings");
    }
  }
);

// Save Professional Fees Basic Settings
export const saveProfessionalFeesBasicSettings = createAsyncThunk(
  "doctorFeesSettings/saveProfessionalFeesBasicSettings",
  async (settingsData: any, { rejectWithValue }) => {
    try {
      const requestData = {
        model: {
          calculationOnDateID: settingsData.model.calculationOnDateID,
          paymentEligibilityID: settingsData.model.paymentEligibilityID,
          isIncludeEmployeeLimit: settingsData.model.isIncludeEmployeeLimit,
          isExcludeRefund: settingsData.model.isExcludeRefund,
          tds: settingsData.model.tds
        }
      };
      
      const response = await DoctorProfessionalFeeSettingService.postApiVDoctorProfessionalFeeSetting(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to save professional fees settings");
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to save professional fees settings");
    }
  }
);


// ==================== DROPDOWN OPTIONS ====================

// Fetch Doctor Options
export const fetchDoctorOptions = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorOptions",
  async (_, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: "",
        type: [],
        status: [],
        createdByList: [],
        modifiedByList: [],
        page: 1,
        pageSize: 10
      };

      const response = await DoctorMasterService.postApiVDoctorMasterList(
        API_VERSION,
        TENANT,
        requestData
      );

      // Transform the API response to match expected format
      if (response && response.items) {
        const transformed = response.items.map((item: any) => ({
          label: item.doctor || "Unknown Doctor",
          value: item.doctorId || ""
        }));
        
        // Filter out doctors with empty values to prevent Select component errors
        const validDoctors = transformed.filter(doctor => doctor.value && doctor.value.trim() !== "");
        
        return validDoctors;
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor options");
    }
  }
);

// Fetch Bill Type List
export const fetchBillTypeList = createAsyncThunk(
  "doctorFeesSettings/fetchBillTypeList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("Common/BillTypeEnum"), {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching bill type list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching bill type list');
    }
  }
);

// Fetch Patient Category List
export const fetchPatientCategoryList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/PatientCategoryType/getPatientCategoryType`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching patient category list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching patient category list');
    }
  }
);

// Fetch Definition Type List
export const fetchDefinitionTypeList = createAsyncThunk(
  "doctorFeesSettings/fetchDefinitionTypeList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/DoctorWiseSetting/DefinationTypeEnum`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching definition type list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching definition type list');
    }
  }
);

// Fetch Created By List
export const fetchCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchCreatedByList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const result = await dispatch(fetchCreatedByListForSettings());
      
      if (fetchCreatedByListForSettings.fulfilled.match(result)) {
        return result.payload.data.items.map((item: any) => ({
          label: item.value,
          value: item.key
        }));
      } else {
        return rejectWithValue(result.payload || "Failed to fetch created by list");
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch created by list");
    }
  }
);

// Fetch Modified By List
export const fetchModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchModifiedByList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const result = await dispatch(fetchModifiedByListForSettings());
      
      if (fetchModifiedByListForSettings.fulfilled.match(result)) {
        return result.payload.data.items.map((item: any) => ({
          label: item.value,
          value: item.key
        }));
      } else {
        return rejectWithValue(result.payload || "Failed to fetch modified by list");
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch modified by list");
    }
  }
);

// Fetch Modified By List for Basic Amount Settings
export const fetchModifiedByListForBasicAmount = createAsyncThunk(
  "doctorFeesSettings/fetchModifiedByListForBasicAmount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("DoctorMaster/getModifiedbyUser"), {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching modified by list');
    }
  }
);

// Fetch Created By List for Basic Amount Settings
export const fetchCreatedByListForBasicAmount = createAsyncThunk(
  "doctorFeesSettings/fetchCreatedByListForBasicAmount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("DoctorMaster/getCreatedBy"), {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching created by list');
    }
  }
);

// ==================== BASIC AMOUNT SETTINGS ====================

// Fetch individual doctor basic amount setting by ID
export const fetchDoctorBasicAmountSettingById = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorBasicAmountSettingById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await DoctorBasicAmountSettingService.getApiVDoctorBasicAmountSettingGetById(
        id,
        API_VERSION,
        TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch doctor basic amount setting");
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor basic amount setting");
    }
  }
);

export const fetchDoctorBasicAmountSettings = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorBasicAmountSettings",
  async (params: DoctorBasicAmountSettingListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        createdByList: params.createdByList || [],
        modifiedByList: params.modifiedByList || [],
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10
      };

      

      const response = await DoctorBasicAmountSettingService.postApiVDoctorBasicAmountSettingList(
        API_VERSION,
        TENANT,
        requestData
      );
      
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch doctor basic amount settings");
      }
      
      // Transform response to match expected format
      const transformedItems = response.data?.items?.map((item: any) => ({
        doctor: item.doctorName || "Unknown Doctor",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A",
        doctorId: item.doctorId
      })) || [];
      
      // Return both data and pagination metadata
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor basic amount settings");
    }
  }
);

// Save Doctor Basic Amount Settings
export const saveDoctorBasicAmountSettings = createAsyncThunk(
  "doctorFeesSettings/saveDoctorBasicAmountSettings",
  async (settingsData: {
    doctorId: string;
    paymentType: string;
    basicSalary: number;
    accountTransfer: number;
    payoutAdjustmentDetails: Array<{
      payoutAdjustmentId?: string;
      adjustmentHeadId: string;
      calculationMode: number;
      amountorPercentageValue: number;
      isPercentage: boolean;
    }>;
  }, { rejectWithValue }) => {
    try {
      // Transform the data to match the API payload structure
      const payload = {
        model: {
          doctorId: settingsData.doctorId,
          paymentType: settingsData.paymentType,
          basicSalary: settingsData.basicSalary,
          accountTransfer: settingsData.accountTransfer,
          payoutAdjustmentdetailsUpdateDTO: settingsData.payoutAdjustmentDetails.map(detail => ({
            payoutAdjustmentId: detail.payoutAdjustmentId,
            adjustmentHeadId: detail.adjustmentHeadId,
            calculationMode: detail.calculationMode,
            amountorPercentageValue: detail.amountorPercentageValue,
            isPercentage: detail.isPercentage
          }))
        }
      };

      const response = await fetch(generateApiURL("DoctorBasicAmountSetting"), {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'tenant': 'tenant', // Add tenant header as required by API
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while saving doctor basic amount settings');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while saving doctor basic amount settings');
    }
  }
);

// ==================== PAYOUT ADJUSTMENT MASTER ====================

export const fetchPayoutAdjustmentMaster = createAsyncThunk(
  "doctorFeesSettings/fetchPayoutAdjustmentMaster",
  async (params: PayoutAdjustmentMasterListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        status: params.status || [],
        createdByList: params.createdByList || [],
        modifiedByList: params.modifiedByList || [],
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10
      };

      const response = await PayoutAdjustmentMasterService.postApiVPayoutAdjustmentMasterList(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch payout adjustment master");
      }
      
      // Transform response to match expected format
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.headNameId, // This will be used for editing
        headNameId: item.headNameId,
        headName: item.headName || "Unknown Head",
        applicableAmount: item.applicableAmount || 0,
        status: item.status ? "Active" : "Inactive",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      // Return both data and pagination metadata
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch payout adjustment master");
    }
  }
);

// Save Payout Adjustment Master
export const savePayoutAdjustmentMaster = createAsyncThunk(
  "doctorFeesSettings/savePayoutAdjustmentMaster",
  async (payloadData: {
    headName: string;
    applicableSign: number;
    applicableAmount: number;
    deactive: boolean;
  }, { rejectWithValue }) => {
    try {
      const requestData = {
        model: {
          headName: payloadData.headName,
          applicableSign: payloadData.applicableSign,
          applicableAmount: payloadData.applicableAmount,
          deactive: payloadData.deactive
        }
      };
      
      
      const response = await PayoutAdjustmentMasterService.postApiVPayoutAdjustmentMaster(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to save payout adjustment master");
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to save payout adjustment master");
    }
  }
);

// Fetch Payout Adjustment Master Created By List
export const fetchPayoutAdjustmentCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPayoutAdjustmentCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PayoutAdjustmentMasterService.getApiVPayoutAdjustmentMasterGetCreatedBy(
        API_VERSION,
        TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch created by list");
      }
      
      // Transform response to match dropdown format
      return response.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch created by list");
    }
  }
);

// Fetch Payout Adjustment Master Modified By List
export const fetchPayoutAdjustmentModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPayoutAdjustmentModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PayoutAdjustmentMasterService.getApiVPayoutAdjustmentMasterGetModifiedBy(
        API_VERSION,
        TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch modified by list");
      }
      
      // Transform response to match dropdown format
      return response.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch modified by list");
    }
  }
);

// Fetch Payout Adjustment Master By ID
export const fetchPayoutAdjustmentById = createAsyncThunk(
  "doctorFeesSettings/fetchPayoutAdjustmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await PayoutAdjustmentMasterService.getApiVPayoutAdjustmentMasterGetById(
        id,
        API_VERSION,
        TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch payout adjustment");
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch payout adjustment");
    }
  }
);

// Update Payout Adjustment Master
export const updatePayoutAdjustmentMaster = createAsyncThunk(
  "doctorFeesSettings/updatePayoutAdjustmentMaster",
  async (payloadData: {
    payoutAdjustmentMasterId: string;
    headName: string;
    applicableSign: number;
    applicableAmount: number;
    deactive: boolean;
  }, { rejectWithValue }) => {
    try {
      const requestData = {
        model: {
          payoutAdjustmentMasterId: payloadData.payoutAdjustmentMasterId,
          headName: payloadData.headName,
          applicableSign: payloadData.applicableSign,
          applicableAmount: payloadData.applicableAmount,
          deactive: payloadData.deactive
        }
      };
      
      
      const response = await PayoutAdjustmentMasterService.putApiVPayoutAdjustmentMaster(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to update payout adjustment master");
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update payout adjustment master");
    }
  }
);

export const fetchDoctorWiseSettings = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorWiseSettings",
  async (params: DoctorWiseSettingsListRequest = {}, { rejectWithValue, dispatch }) => {
    try {
      
      const result = await dispatch(fetchDoctorWiseSettingsList(params));
      
      if (fetchDoctorWiseSettingsList.fulfilled.match(result)) {
       
        const apiData = result.payload.data.items;
        
        return apiData.map((item: DoctorWiseSettingItem) => {
         
          return {
            doctor: item.doctorName || "Unknown Doctor",
            applicableDate: new Date(item.applicableDate).toLocaleDateString('en-GB'),
            status: item.status,
            modifiedOn: new Date(item.modifiedOn).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            modifiedBy: item.modifiedBy,
            createdOn: new Date(item.createdOn).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            createdBy: item.createdBy,
            doctorID: item.doctorID
          };
        });
      } else {
        return rejectWithValue(result.payload || "Failed to fetch doctor wise settings");
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor wise settings");
    }
  }
);

export const fetchDoctorTypeByService = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByService",
  async (params: DoctorTypeByServiceListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        createdByList: params.createdByList || [],
        modifiedByList: params.modifiedByList || [],
        pageNumber: params.pageNumber || params.page || 1,
        pageSize: params.pageSize || 10
      };
      
      const response = await ExclusionSettingsService.postApiVExclusionSettingsDoctorTypeByServiceExclusionList(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch doctor type by service");
      }
      
      // Transform API response to match UI expectations
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.id,
        doctorType: item.doctorTypeName || "N/A",
        doctorTypeId: item.doctorTypeId ? String(item.doctorTypeId) : "",
        service: item.serviceName || "N/A",
        serviceId: item.serviceId || item.service || "",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      // Return both data and pagination metadata
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.pageNumber || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor type by service");
    }
  }
);

export const fetchDoctorTypeByDepartment = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByDepartment",
  async (params: DoctorTypeByDepartmentListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        departmentIds: params.departmentIds || [],
        createdByIds: params.createdByIds || [],
        modifiedByIds: params.modifiedByIds || [],
        searchTerm: params.searchTerm || "",
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
      
      const response = await ExclusionSettingsService.postApiVExclusionSettingsDoctorTypeByDepartmentlist(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch doctor type by department");
      }
      
      // Transform API response to match UI expectations
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.id,
        doctorType: item.doctorType || "N/A",
        doctorTypeId: item.doctorTypeId ? String(item.doctorTypeId) : "",
        department: item.departmentName || "N/A",
        departmentId: item.departmentId || item.department || "",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      // Return both data and pagination metadata
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor type by department");
    }
  }
);

export const fetchPatientTypeByBillType = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByBillType",
  async (params: PatientTypeByBillTypeListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        billTypeList: params.billTypeList || [],
        createdbyList: params.createdbyList || [],
        modifiedbyList: params.modifiedbyList || [],
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
      
      
      const response = await ExclusionSettingsService.postApiVExclusionSettingsPatientTypeByBillTypelist(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch patient type by bill type");
      }
      
      // Transform API response to match UI expectations
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.id,
        patientType: item.patientTypeName || item.schemeCompanyName || "N/A",
        patientTypeId: item.patientTypeId || item.patientType || "",
        billType: item.billTypeName || item.billType || "N/A",
        billTypeId: item.billTypeId || item.billType || "",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch patient type by bill type");
    }
  }
);

export const fetchPatientTypeByService = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByService",
  async (params: PatientTypeByServiceListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        createdByList: params.createdByList || [],
        modifiedByList: params.modifiedByList || [],
        pageNumber: params.pageNumber || params.page || 1,
        pageSize: params.pageSize || 10
      };
      
      
      const response = await ExclusionSettingsService.postApiVExclusionSettingsPatientTypeByServiceList(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch patient type by service");
      }
      
      // Transform API response to match UI expectations
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.id,
        patientType: item.schemeCompanyName || "N/A",
        patientTypeId: item.patientTypeId || item.patientType || "",
        service: item.servicename || "N/A",
        serviceId: item.serviceId || item.service || "",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch patient type by service");
    }
  }
);


export const fetchCategoryByDoctorType = createAsyncThunk(
  "doctorFeesSettings/fetchCategoryByDoctorType",
  async (params: CategoryByDoctorTypeListRequest = {}, { rejectWithValue }) => {
    try {
      const requestData = {
        searchTerm: params.searchTerm || "",
        categoryList: params.categoryList || [],
        createdbyList: params.createdbyList || [],
        modifiedbyList: params.modifiedbyList || [],
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
      
      const response = await ExclusionSettingsService.postApiVExclusionSettingsCategoryByDoctorTypelist(
        API_VERSION,
        TENANT,
        requestData
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch category by doctor type");
      }
      
      // Transform API response to match UI expectations
      const transformedItems = response.data?.items?.map((item: any) => ({
        id: item.id,
        doctorType: item.doctorTypeName || "N/A",
        doctorTypeId: item.doctorTypeId ? String(item.doctorTypeId) : "",
        category: item.categoryName || "N/A",
        categoryId: item.categoryId || item.category || "",
        modifiedOn: item.modifiedOn ? new Date(item.modifiedOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        modifiedBy: item.modifiedBy || "N/A",
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : "N/A",
        createdBy: item.createdBy || "N/A"
      })) || [];
      
      // Return both data and pagination metadata
      return {
        items: transformedItems,
        pagination: {
          currentPage: response.data?.metadata?.page?.currentPage || params.page || 1,
          pageSize: response.data?.metadata?.page?.pageSize || params.pageSize || 10,
          totalCount: response.data?.items?.length || transformedItems.length,
          totalPages: response.data?.metadata?.page?.totalPages || Math.ceil((response.data?.items?.length || transformedItems.length) / (params.pageSize || 10))
        }
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch category by doctor type");
    }
  }
);

// ==================== DROPDOWN SUPPORT FUNCTIONS ====================

// These functions provide dropdown options for various forms
export const fetchDepartmentList = createAsyncThunk(
  "doctorFeesSettings/fetchDepartmentList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DepartmentsService.getApiVDepartmentsDepartmentKVlist(
        API_VERSION,
        TENANT
      );

      // Transform the KVPair response to match expected format
      if (response && Array.isArray(response)) {
        return response.map((item: any) => ({
          label: item.value || item.key || "Unknown",
          value: item.key || item.value || ""
        }));
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch department list");
    }
  }
);

export const fetchServiceList = createAsyncThunk(
  "doctorFeesSettings/fetchServiceList",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { label: "Acetyl Cholinesterase Level [Blood - EDTA plasma] [A0010]", value: "A0010" },
        { label: "Blood Sugar Fasting [BSF]", value: "BSF001" },
        { label: "Complete Blood Count [CBC]", value: "CBC001" },
        { label: "Electrocardiogram [ECG]", value: "ECG001" },
        { label: "X-Ray Chest [CXR]", value: "CXR001" },
      ];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch service list");
    }
  }
);

export const fetchDoctorTypeList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeList",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { label: "Consulting", value: "consulting" },
        { label: "Visiting", value: "visiting" },
        { label: "Resident", value: "resident" },
        { label: "Delete Provision", value: "delete_provision" },
      ];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor type list");
    }
  }
);

export const fetchCategoryList = createAsyncThunk(
  "doctorFeesSettings/fetchCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { label: "Radiation Oncology", value: "radiation_oncology" },
        { label: "Cardiology", value: "cardiology" },
        { label: "Neurology", value: "neurology" },
        { label: "Orthopedics", value: "orthopedics" },
      ];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch category list");
    }
  }
);

// ==================== ADDITIONAL SUPPORT FUNCTIONS ====================

export const fetchPaymentTypeOptions = createAsyncThunk(
  "doctorFeesSettings/fetchPaymentTypeOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PaymentReceivedService.getApiVPaymentReceivedPaymentModes(
        API_VERSION,
        TENANT
      );

      // The API returns an array directly, not wrapped in a response object
      if (Array.isArray(response)) {
        return response.map((item: any) => ({
          label: item.paymentModeName || "Unknown",
          value: item.paymentModeId || ""
        }));
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch payment type options");
    }
  }
);

export const fetchAdjustmentHeadOptions = createAsyncThunk(
  "doctorFeesSettings/fetchAdjustmentHeadOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoctorBasicAmountSettingService.getApiVDoctorBasicAmountSettingGetAdjustmentHeads(
        API_VERSION,
        TENANT
      );

      // Transform the KVPair response to match expected format
      if (response && typeof response === 'object') {
        // If it's a single KVPair object
        if ('key' in response && 'value' in response) {
          return [{
            label: response.value || response.key || "Unknown",
            value: response.key || response.value || ""
          }];
        }
        // If it's an array of KVPair objects
        if (Array.isArray(response)) {
          return response.map((item: any) => ({
            label: item.value || item.key || "Unknown",
            value: item.key || item.value || ""
          }));
        }
        // If it's a response object with data property
        if (
          'data' in response &&
          response.data &&
          Array.isArray((response.data as any).items)
        ) {
          return (response.data as any).items.map((item: any) => ({
            label: item.value || item.key || "Unknown",
            value: item.key || item.value || ""
          }));
        }
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch adjustment head options");
    }
  }
);

export const fetchCalculationModeOptions = createAsyncThunk(
  "doctorFeesSettings/fetchCalculationModeOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoctorBasicAmountSettingService.getApiVDoctorBasicAmountSettingGetCalculationMode(
        API_VERSION,
        TENANT
      );

      // Transform the KVPair response to match expected format
      if (response && typeof response === 'object') {
        // If it's a single KVPair object
        if ('key' in response && 'value' in response) {
          return [{
            label: response.value || response.key || "Unknown",
            value: response.key || response.value || ""
          }];
        }
        // If it's an array of KVPair objects
        if (Array.isArray(response)) {
          return response.map((item: any) => ({
            label: item.value || item.key || "Unknown",
            value: item.key || item.value || ""
          }));
        }
        // If it's a response object with data property
        if (
          'data' in response &&
          response.data &&
          Array.isArray((response.data as any).items)
        ) {
          return (response.data as any).items.map((item: any) => ({
            label: item.value || item.key || "Unknown",
            value: item.key || item.value || ""
          }));
        }
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch calculation mode options");
    }
  }
);

export const fetchAdjustmentRows = createAsyncThunk(
  "doctorFeesSettings/fetchAdjustmentRows",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { label: "Row 1", value: "row1" },
        { label: "Row 2", value: "row2" },
        { label: "Row 3", value: "row3" },
      ];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch adjustment rows");
    }
  }
);

// Fetch Doctor List from Hospital API (alternative to fetchDoctorOptions)
export const fetchDoctorListFromHospital = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorListFromHospital",
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Hospital/HospitalDoctors/f1b0f4c7-9f66-48db-b94d-0f4ca190d477`;
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor list');
      }

      // Transform the API response to match expected format
      let doctors: any[] = [];
      
      // Handle different response formats
      if (result.data && Array.isArray(result.data.items)) {
        doctors = result.data.items;
      } else if (result.items && Array.isArray(result.items)) {
        doctors = result.items;
      } else if (Array.isArray(result)) {
        doctors = result;
      } else if (result && typeof result === 'object') {
        // If it's a single object, wrap it in an array
        doctors = [result];
      }

      const transformedDoctors = doctors.map((item: any) => ({
        label: item.value || item.doctorName || item.doctor || item.name || "Unknown Doctor",
        value: item.key || item.doctorId || item.id || ""
      }));
      
      // Filter out doctors with empty values to prevent Select component errors
      const validDoctors = transformedDoctors.filter(doctor => doctor.value && doctor.value.trim() !== "");
      
      return validDoctors;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return rejectWithValue('Request timed out. Please check your network connection.');
      }
      return rejectWithValue(error.message || 'An error occurred while fetching doctor list');
    }
  }
);

// Fetch Patient Type By Service Created By List
export const fetchPatientTypeByServiceCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByServiceCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceGetCreatedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching created by list');
    }
  }
);

// Fetch Patient Type By Service Modified By List
export const fetchPatientTypeByServiceModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByServiceModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceGetModifiedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching modified by list');
    }
  }
);

// Fetch Bill Type Enum
export const fetchBillTypeEnum = createAsyncThunk(
  "doctorFeesSettings/fetchBillTypeEnum",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Common/BillTypeEnum`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching bill type enum');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching bill type enum');
    }
  }
);

// Fetch Patient Type By Bill Type Created By List
export const fetchPatientTypeByBillTypeCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByBillTypeCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByBillTypeGetCreatedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching created by list');
    }
  }
);

// Fetch Patient Type By Bill Type Modified By List
export const fetchPatientTypeByBillTypeModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientTypeByBillTypeModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByBillTypeGetModifiedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching modified by list');
    }
  }
);

// Fetch Department KV List
export const fetchDepartmentKVList = createAsyncThunk(
  "doctorFeesSettings/fetchDepartmentKVList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("Departments/departmentKVlist"), {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching department KV list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching department KV list');
    }
  }
);

// Fetch Doctor Type By Department Created By List
export const fetchDoctorTypeByDepartmentCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByDepartmentCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByDepartmentGetCreatedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching created by list');
    }
  }
);

// Fetch Doctor Type By Department Modified By List
export const fetchDoctorTypeByDepartmentModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByDepartmentModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByDepartmentGetModifiedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching modified by list');
    }
  }
);

// Fetch Doctor KV List
export const fetchDoctorKVList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorKVList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("Common/doctorKVlist"), {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor KV list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching doctor KV list');
    }
  }
);

// Fetch Services List
export const fetchServicesList = createAsyncThunk(
  "doctorFeesSettings/fetchServicesList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Common/serviceNames`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching services list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching services list');
    }
  }
);

// Fetch Service Groups List
export const fetchServiceGroupsList = createAsyncThunk(
  "doctorFeesSettings/fetchServiceGroupsList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ServiceGroup/serviceGroups`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Service Groups API returns array directly, not wrapped in data.items
      const items = Array.isArray(result) ? result : [];

      // Transform response to match dropdown format
      return items.map((item: any) => ({
        label: item.serviceGroupName || "Unknown",
        value: item.serviceGroupId || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching service groups list');
    }
  }
);

// Fetch Departments List
export const fetchDepartmentsList = createAsyncThunk(
  "doctorFeesSettings/fetchDepartmentsList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Departments/departmentKVlist`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching departments list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching departments list');
    }
  }
);

// Fetch Service Group Categories for Category by Doctor Type Exclusions
export const fetchServiceGroupCategories = createAsyncThunk(
  "doctorFeesSettings/fetchServiceGroupCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ServiceGroup/serviceGroups`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching service group categories');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching service group categories');
    }
  }
);

// Fetch Doctor Type by Service Created By List
export const fetchDoctorTypeByServiceCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByServiceCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByServiceExclusionGetCreatedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor type by service created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching doctor type by service created by list');
    }
  }
);

// Fetch Doctor Type by Service Modified By List
export const fetchDoctorTypeByServiceModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorTypeByServiceModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByServiceExclusionGetModifiedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor type by service modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching doctor type by service modified by list');
    }
  }
);

// Create Doctor Wise Setting
export const createDoctorWiseSetting = createAsyncThunk(
  "doctorFeesSettings/createDoctorWiseSetting",
  async (data: {
    doctorId: string;
    applicableDate: string;
    deactivate: boolean;
    doctorWiseSettingDetails: Array<{
      billType: number;
      patientCategory: string;
      definationType: number;
      definationId: string;
      dr_Percentage: number;
      fixedAmount: number;
    }>;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          doctorId: data.doctorId,
          applicableDate: data.applicableDate,
          deactivate: data.deactivate,
          doctorWiseSettingDetails: data.doctorWiseSettingDetails
        }
      };

      const response = await DoctorWiseSettingService.postApiVDoctorWiseSetting(
        API_VERSION,
        TENANT,
        requestBody
      );

      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to create doctor wise setting");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error creating doctor wise setting:", error);
      return rejectWithValue(error?.message || "Failed to create doctor wise setting");
    }
  }
);

// Fetch Payment Types using ModeOfPayment service
export const fetchPaymentTypesFromModeOfPayment = createAsyncThunk(
  "doctorFeesSettings/fetchPaymentTypesFromModeOfPayment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ModeOfPaymentService.getApiVModeOfPaymentGetPaymentType(API_VERSION, TENANT);
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch payment types");
      }

      // Transform response to match dropdown format
      return response.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      console.error("Error fetching payment types:", error);
      return rejectWithValue(error?.message || "Failed to fetch payment types");
    }
  }
);

// Fetch Doctor Role List
export const fetchDoctorRoleList = createAsyncThunk(
  "doctorFeesSettings/fetchDoctorRoleList",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/DoctorMaster/DoctorRole`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
     
      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching doctor role list');
      }

      // Transform response to match dropdown format
      const transformedData = result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
      
     
      return transformedData;
    } catch (error: any) {
      console.error("❌ Doctor Role List Error:", error);
      return rejectWithValue(error.message || 'An error occurred while fetching doctor role list');
    }
  }
);

// Create Doctor Type by Service Exclusion
export const createDoctorTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/createDoctorTypeByServiceExclusion",
  async (data: {
    doctorTypeId: number;
    serviceId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            doctorTypeId: data.doctorTypeId,
            serviceId: data.serviceId
          }
        ]
      };

      const response = await ExclusionSettingsService.postApiVExclusionSettingsDoctorTypeByServiceExclusionSave(
        API_VERSION,
        TENANT,
        requestBody
      );

      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to create doctor type by service exclusion");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error creating doctor type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to create doctor type by service exclusion");
    }
  }
);

// Update Doctor Type by Service Exclusion
export const updateDoctorTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/updateDoctorTypeByServiceExclusion",
  async (data: {
    id: string;
    doctorTypeId: number;
    serviceId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            doctorTypeId: data.doctorTypeId,
            serviceId: data.serviceId
          }
        ]
      };

     
      const response = await ExclusionSettingsService.postApiVExclusionSettingsDoctorTypeByServiceExclusionSave(
        API_VERSION,
        TENANT,
        requestBody
      );

      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to update doctor type by service exclusion");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error updating doctor type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to update doctor type by service exclusion");
    }
  }
);

// Delete Doctor Type by Service Exclusion
export const deleteDoctorTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/deleteDoctorTypeByServiceExclusion",
  async (data: {
    ids: string[];
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          ids: data.ids
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByServiceExclusionDelete`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete doctor type by service exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error deleting doctor type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to delete doctor type by service exclusion");
    }
  }
);

// Create Doctor Type by Department Exclusion
export const createDoctorTypeByDepartmentExclusion = createAsyncThunk(
  "doctorFeesSettings/createDoctorTypeByDepartmentExclusion",
  async (data: {
    doctorType: number;
    service: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          doctorType: data.doctorType,
          service: data.service
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByDepartmentSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to create doctor type by department exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error creating doctor type by department exclusion:", error);
      return rejectWithValue(error?.message || "Failed to create doctor type by department exclusion");
    }
  }
);

// Update Doctor Type by Department Exclusion
export const updateDoctorTypeByDepartmentExclusion = createAsyncThunk(
  "doctorFeesSettings/updateDoctorTypeByDepartmentExclusion",
  async (data: {
    id: string;
    doctorType: number;
    service: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          id: data.id,
          doctorType: data.doctorType,
          service: data.service
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByDepartmentSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to update doctor type by department exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error updating doctor type by department exclusion:", error);
      return rejectWithValue(error?.message || "Failed to update doctor type by department exclusion");
    }
  }
);

// Delete Doctor Type by Department Exclusion
export const deleteDoctorTypeByDepartmentExclusion = createAsyncThunk(
  "doctorFeesSettings/deleteDoctorTypeByDepartmentExclusion",
  async (data: {
    ids: string[];
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          ids: data.ids
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/DoctorTypeByDepartmentDelete`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete doctor type by department exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error deleting doctor type by department exclusion:", error);
      return rejectWithValue(error?.message || "Failed to delete doctor type by department exclusion");
    }
  }
);

// Fetch Patient Companies List
export const fetchPatientCompaniesList = createAsyncThunk(
  "doctorFeesSettings/fetchPatientCompaniesList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/PatientCompanyMaster/patientcompanies`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching patient companies list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching patient companies list');
    }
  }
);

// Create Patient Type by Bill Type Exclusion
export const createPatientTypeByBillTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/createPatientTypeByBillTypeExclusion",
  async (data: {
    schemecompanyId: string;
    billTypeId: number;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            schemecompanyId: data.schemecompanyId,
            billTypeId: data.billTypeId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByBillTypeSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to create patient type by bill type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error creating patient type by bill type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to create patient type by bill type exclusion");
    }
  }
);

// Update Patient Type by Bill Type Exclusion
export const updatePatientTypeByBillTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/updatePatientTypeByBillTypeExclusion",
  async (data: {
    id: string;
    schemecompanyId: string;
    billTypeId: number;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            id: data.id,
            schemecompanyId: data.schemecompanyId,
            billTypeId: data.billTypeId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByBillTypeSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to update patient type by bill type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error updating patient type by bill type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to update patient type by bill type exclusion");
    }
  }
);

// Delete Patient Type by Bill Type Exclusion
export const deletePatientTypeByBillTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/deletePatientTypeByBillTypeExclusion",
  async (data: {
    ids: string[];
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          ids: data.ids
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceDelete`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete patient type by bill type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error deleting patient type by bill type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to delete patient type by bill type exclusion");
    }
  }
);

// Create Patient Type by Service Exclusion
export const createPatientTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/createPatientTypeByServiceExclusion",
  async (data: {
    schemeCompanyId: string;
    serviceId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            schemeCompanyId: data.schemeCompanyId,
            serviceId: data.serviceId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to create patient type by service exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error creating patient type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to create patient type by service exclusion");
    }
  }
);

// Update Patient Type by Service Exclusion
export const updatePatientTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/updatePatientTypeByServiceExclusion",
  async (data: {
    id: string;
    schemeCompanyId: string;
    serviceId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            id: data.id,
            schemeCompanyId: data.schemeCompanyId,
            serviceId: data.serviceId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to update patient type by service exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error updating patient type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to update patient type by service exclusion");
    }
  }
);

// Delete Patient Type by Service Exclusion
export const deletePatientTypeByServiceExclusion = createAsyncThunk(
  "doctorFeesSettings/deletePatientTypeByServiceExclusion",
  async (data: {
    ids: string[];
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          ids: data.ids
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/PatientTypeByServiceDelete`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete patient type by service exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error deleting patient type by service exclusion:", error);
      return rejectWithValue(error?.message || "Failed to delete patient type by service exclusion");
    }
  }
);

// Create Category by Doctor Type Exclusion
export const createCategoryByDoctorTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/createCategoryByDoctorTypeExclusion",
  async (data: {
    doctorTypeId: number;
    serviceGroupId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            doctorTypeId: data.doctorTypeId,
            serviceGroupId: data.serviceGroupId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/CategoryByDoctorTypeSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to create category by doctor type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error creating category by doctor type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to create category by doctor type exclusion");
    }
  }
);

// Update Category by Doctor Type Exclusion
export const updateCategoryByDoctorTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/updateCategoryByDoctorTypeExclusion",
  async (data: {
    id: string;
    doctorTypeId: number;
    serviceGroupId: string;
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: [
          {
            id: data.id,
            doctorTypeId: data.doctorTypeId,
            serviceGroupId: data.serviceGroupId
          }
        ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/CategoryByDoctorTypeSave`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to update category by doctor type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error updating category by doctor type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to update category by doctor type exclusion");
    }
  }
);

// Delete Category by Doctor Type Exclusion
export const deleteCategoryByDoctorTypeExclusion = createAsyncThunk(
  "doctorFeesSettings/deleteCategoryByDoctorTypeExclusion",
  async (data: {
    ids: string[];
  }, { rejectWithValue }) => {
    try {
      const requestBody = {
        model: {
          ids: data.ids
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/CategoryByDoctorTypeDelete`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete category by doctor type exclusion");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error deleting category by doctor type exclusion:", error);
      return rejectWithValue(error?.message || "Failed to delete category by doctor type exclusion");
    }
  }
);

// Fetch Adjustment Heads for Payout Adjustment Master
export const fetchAdjustmentHeadsForPayout = createAsyncThunk(
  "doctorFeesSettings/fetchAdjustmentHeadsForPayout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/DoctorBasicAmountSetting/GetAdjustmentHeads`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching adjustment heads');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.value || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching adjustment heads');
    }
  }
);

// ==================== REFRESH THUNKS FOR TAB COMPONENTS ====================

// Refresh Professional Fees Basic Settings
export const refreshProfessionalFeesData = createAsyncThunk(
  "doctorFeesSettings/refreshProfessionalFeesData",
  async (_, { dispatch }) => {
    await dispatch(fetchProfessionalFeesBasicSettings());
  }
);

// Refresh Doctor Basic Amount Settings
export const refreshBasicAmountData = createAsyncThunk(
  "doctorFeesSettings/refreshBasicAmountData",
  async (_, { dispatch }) => {
    await dispatch(fetchDoctorBasicAmountSettings({
      page: 1,
      pageSize: 10,
      searchTerm: "",
      createdByList: [],
      modifiedByList: []
    }));
  }
);

// Refresh Payout Adjustment Master
export const refreshPayoutAdjustmentData = createAsyncThunk(
  "doctorFeesSettings/refreshPayoutAdjustmentData",
  async (_, { dispatch }) => {
    await dispatch(fetchPayoutAdjustmentMaster({
      page: 1,
      pageSize: 10,
      searchTerm: "",
      status: [],
      createdByList: [],
      modifiedByList: []
    }));
  }
);

// Refresh Doctor Wise Settings
export const refreshDoctorWiseSettingsData = createAsyncThunk(
  "doctorFeesSettings/refreshDoctorWiseSettingsData",
  async (_, { dispatch }) => {
    await dispatch(fetchDoctorWiseSettings({
      page: 1,
      pageSize: 10,
      searchTerm: ""
    }));
  }
);

// Refresh Exclusion Settings Data
export const refreshExclusionSettingsData = createAsyncThunk(
  "doctorFeesSettings/refreshExclusionSettingsData",
  async (_, { dispatch }) => {
    // Refresh all exclusion settings data
    await Promise.all([
      dispatch(fetchDoctorTypeByService({
        page: 1,
        pageSize: 10,
        searchTerm: ""
      })),
      dispatch(fetchDoctorTypeByDepartment({
        page: 1,
        pageSize: 10,
        searchTerm: ""
      })),
      dispatch(fetchPatientTypeByBillType({
        page: 1,
        pageSize: 10,
        searchTerm: ""
      })),
      dispatch(fetchPatientTypeByService({
        page: 1,
        pageSize: 10,
        searchTerm: ""
      })),
      dispatch(fetchCategoryByDoctorType({
        page: 1,
        pageSize: 10,
        searchTerm: ""
      }))
    ]);
  }
);

// Fetch Category by Doctor Type Created By List
export const fetchCategoryByDoctorTypeCreatedByList = createAsyncThunk(
  "doctorFeesSettings/fetchCategoryByDoctorTypeCreatedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/CategoryByDoctorTypeGetCreatedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching category by doctor type created by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching category by doctor type created by list');
    }
  }
);

// Fetch Category by Doctor Type Modified By List
export const fetchCategoryByDoctorTypeModifiedByList = createAsyncThunk(
  "doctorFeesSettings/fetchCategoryByDoctorTypeModifiedByList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/ExclusionSettings/CategoryByDoctorTypeGetModifiedBy`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'An error occurred while fetching category by doctor type modified by list');
      }

      // Transform response to match dropdown format
      return result.data?.items?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching category by doctor type modified by list');
    }
  }
);

// Delete Doctor Basic Amount Setting
export const deleteDoctorBasicAmountSetting = createAsyncThunk(
  "doctorFeesSettings/deleteDoctorBasicAmountSetting",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await DoctorBasicAmountSettingService.deleteApiVDoctorBasicAmountSetting(
        API_VERSION,
        API_TENANT,
        {
          model: {
            doctorIds: [doctorId]
          }
        }
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to delete doctor basic amount setting");
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete doctor basic amount setting");
    }
  }
);

// Fetch Status List for Payout Adjustment Master
export const fetchStatusList = createAsyncThunk(
  "doctorFeesSettings/fetchStatusList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoctorBasicAmountSettingService.deleteApiVDoctorBasicAmountSetting(
        API_VERSION,
        API_TENANT
      );
      
      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch status list");
      }
      
      // Transform response to match dropdown format
      return response.data?.map((item: any) => ({
        label: item.value || "Unknown",
        value: item.key || ""
      })) || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch status list");
    }
  }
);

// Delete Payout Adjustment Master
export const deletePayoutAdjustmentMaster = createAsyncThunk(
  "doctorFeesSettings/deletePayoutAdjustmentMaster",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(generateApiURL("PayoutAdjustmentMaster"), {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'tenant': API_TENANT,
        },
        body: JSON.stringify({
          model: {
            ids: [id]
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.isError) {
        return rejectWithValue(result.errorMessage || "Failed to delete payout adjustment master");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete payout adjustment master");
    }
  }
);
