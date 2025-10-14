import { createAsyncThunk } from "@reduxjs/toolkit";
import { DepositConversionService } from "../../services/api-client";
import { API_VERSION, API_TENANT } from "../../utils/constants";
import type { DepositConversionListRequestDto } from "../../services/api-client/models/DepositConversionDto";

// Fetch table data with filters
export const fetchDepositConversionWithFilter = createAsyncThunk(
  "depositConversion/fetchWithFilter",
  async (payload: {
    page: number;
    pageSize: number;
    transferTo?: string | string[];
    depositType?: string | string[];
    createdByList?: string[];
    modifiedByList?: string[];
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
  }, { rejectWithValue }) => {
    try {
      // Set default date range if not provided (last 30 days)
      const endDate = payload.endDate || new Date().toISOString();
      const startDate = payload.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const requestBody: DepositConversionListRequestDto = {
        startDate,
        endDate,
        pageNumber: payload.page,
        pageSize: payload.pageSize,
        searchTerm: payload.searchTerm || "",
        transferedToList: (Array.isArray(payload.transferTo) 
          ? payload.transferTo.map(item => Number(item)) 
          : (payload.transferTo ? [Number(payload.transferTo)] : [])) as any,
        depositeTypeList: Array.isArray(payload.depositType) ? payload.depositType : (payload.depositType ? [payload.depositType] : []),
        createdByList: payload.createdByList || [],
        modifiedByList: payload.modifiedByList || [],
      };

      const response = await DepositConversionService.postApiVDepositConversionList(
        requestBody,
        API_VERSION,
        API_TENANT
      );

      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to fetch data");
      }

      // Transform the API response to match our expected structure
      const transformedItems = response.data?.items?.map(item => ({
        id: item.id,
        patientName: item.patientName,
        uhid: item.uhid,
        transferTo: item.transferedTo,
        depositType: item.depositeType,
        receiptNo: item.recieptNo,
        receiptDateTime: item.recieptDateandTime,
        depositAmountRequired: item.securityDepositeAmount,
        cashAmount: 0, // Not provided by API
        otherPaymentAmount: 0, // Not provided by API
        transferCashAmount: 0, // Not provided by API
        transferOtherPaymentAmount: item.transferedPayAmount,
        modifiedOn: item.transactedDate,
        modifiedBy: item.transactedBy,
        createdOn: item.createdOn,
        createdBy: item.createdBy,
      })) || [];

      return {
        data: {
          items: transformedItems,
          meta: {
            page: {
              currentPage: response.data?.metadata?.page?.currentPage || payload.page,
              pageSize: response.data?.metadata?.page?.pageSize || payload.pageSize,
              totalPages: response.data?.metadata?.page?.totalPages || 1,
              totalItems: transformedItems.length,
            },
          },
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch deposit conversions");
    }
  }
);

// Fetch dropdown filter options from real API endpoints
export const fetchDepositConversionFilters = createAsyncThunk(
  "depositConversion/fetchFilters",
  async (requestBody: number[], { rejectWithValue }) => {
    try {
      // Fetch deposit types using the service
      const depositTypesResponse = await DepositConversionService.postApiVDepositConversionGetDepositTypeList(
        requestBody,
        API_VERSION,
        API_TENANT
      );

      if (depositTypesResponse.isError) {
        throw new Error(depositTypesResponse.errorMessage || "Failed to fetch deposit types");
      }

      // Fetch transfer to enum using the service
      const transferToResponse = await DepositConversionService.getApiVDepositConversionTransferToEnum(
        API_VERSION,
        API_TENANT
      );

      if (transferToResponse.isError) {
        throw new Error(transferToResponse.errorMessage || "Failed to fetch transfer to enum");
      }

      // Fetch created by list using the service
      const createdByResponse = await DepositConversionService.getApiVDepositConversionGetCreatedByList(
        API_VERSION,
        API_TENANT
      );

      if (createdByResponse.isError) {
        throw new Error(createdByResponse.errorMessage || "Failed to fetch created by list");
      }

      // Fetch modified by list using the service
      const modifiedByResponse = await DepositConversionService.getApiVDepositConversionGetModifiedByList(
        API_VERSION,
        API_TENANT
      );

      if (modifiedByResponse.isError) {
        throw new Error(modifiedByResponse.errorMessage || "Failed to fetch modified by list");
      }

      // Transform the data to match our expected format
      // For transferToList, we need to map the enum values correctly
      const transferToList = transferToResponse.data?.items?.filter((item: any) => item.key !== "0").map((item: any) => ({
        label: item.value,
        value: item.key, // Use the key (0, 1, 2) for API requests
      })) || [];

      const depositTypeList = depositTypesResponse.data?.items?.map((item: any) => ({
        label: item.value,
        value: item.key, // Use the key (UUID) for API requests
      })) || [];

      const createdByList = createdByResponse.data?.items?.map((item: any) => ({
        label: item.value,
        value: item.value, // Use the value instead of key to match room category pattern
      })) || [];

      const modifiedByList = modifiedByResponse.data?.items?.map((item: any) => ({
        label: item.value,
        value: item.value, // Use the value instead of key to match room category pattern
      })) || [];

      return {
        data: {
          transferToList,
          depositTypeList,
          createdByList,
          modifiedByList,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch filter options");
    }
  }
);

export const createDepositConversion = createAsyncThunk(
  "depositConversion/create",
  async (formState: any, { rejectWithValue }) => {
    try {
      // Transform the form data to match the API structure
      const requestBody = {
        model: [
          {
            billRecieptId: formState.billReceiptId, // We'll need to get this from receipt details
            transferedTo: formState.transferTo, // This should be the enum value (0, 1, 2)
            depositTypeId: formState.depositType, // This should be the UUID from deposit type
            transferedAmount: formState.transferCashAmount || 0,
            remark: formState.remark || "",
          },
        ],
      };

      const response = await DepositConversionService.postApiVDepositConversionSave(
        requestBody,
        API_VERSION,
        API_TENANT
      );

      if (response.isError) {
        return rejectWithValue(response.errorMessage || "Failed to create deposit conversion");
      }

      return {
        data: {
          id: response.data?.id || String(Date.now()),
          ...formState,
          ...response.data,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create deposit conversion");
    }
  }
);

// Update deposit conversion
export const updateDepositConversion = createAsyncThunk(
  "depositConversion/update",
  async ({ id, data }: { id: string; data: any }) => {
    // TODO: Implement actual API call when update endpoint is available
    const updatedItem = {
      id,
      ...data,
    };

    return {
      data: updatedItem,
    };
  }
);

// Delete deposit conversion
export const deleteDepositConversion = createAsyncThunk(
  "depositConversion/delete",
  async (id: string) => {
    // TODO: Implement actual API call when delete endpoint is available
    return {
      data: { id },
    };
  }
);
