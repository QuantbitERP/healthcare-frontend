import {
  DeleteEmployeeTransferringLimitCommand,
  DeleteEmployeeTransferringLimitResponseDtoListResultModel,
  EmployeeTransferringLimitService,
  EmployeePolicyService,
} from "@/services2/api-client";
import {
  CreateEmployeeTransferringLimitCommand,
  EmployeeTransferingLimitsListRequestDto,
} from "@/services2/api-client";
import { createAsyncThunk } from "@reduxjs/toolkit";

// --- Fetch Employee Transferring Limits List ---
export const fetchTransferTableData = createAsyncThunk(
  "transferTable/fetch",
  async (
    {
      version,
      tenant,
      request,
    }: {
      version: string;
      tenant?: string;
      request?: EmployeeTransferingLimitsListRequestDto;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log('🔍 fetchTransferTableData - Request payload:', request);
      console.log('📊 Filters being sent to API:', {
        startDate: request?.startDate,
        endDate: request?.endDate,
        searchTerm: request?.searchTerm,
        categoryList: request?.categoryList,
        designationList: request?.designationList,
        createdByList: request?.createdByList,
        modifiedByList: request?.modifiedByList,
        pageNumber: request?.pageNumber,
        pageSize: request?.pageSize,
      });
      
      const res =
        await EmployeeTransferringLimitService.postApiVEmployeeTransferringLimitList(
          version,
          tenant,
          request
        );
      return res?.data ?? [];
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to fetch transfer table data"
      );
    }
  }
);

// --- Fetch Fund Transfer (single EmployeeTransferingLimit by ID) ---
export const fetchFundTransferTableData = createAsyncThunk(
  "fundTransferTable/fetch",
  async (
    { id, version, tenant }: { id: string; version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await EmployeeTransferringLimitService.getApiVEmployeeTransferringLimit(
          id,
          version,
          tenant
        );
      return res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to fetch fund transfer data"
      );
    }
  }
);

// save
export const updateTransferLimit = createAsyncThunk(
  "transferTable/updateTransferLimit",
  async (
    {
      version,
      tenant,
      request,
    }: {
      version: string;
      tenant?: string;
      request?: CreateEmployeeTransferringLimitCommand;
    },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await EmployeeTransferringLimitService.postApiVEmployeeTransferringLimit(
          version,
          tenant,
          request
        );
      return res?.data ?? []; // adjust depending on API response structure
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// --- Fetch Category Change Table (CreatedBy / ModifiedBy enums) ---
export const fetchCategoryChangeTableData = createAsyncThunk(
  "categoryChangeTable/fetch",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      const [createdBy, modifiedBy] = await Promise.all([
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitGetCreatedby(
          version,
          tenant
        ),
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitGetModifiedby(
          version,
          tenant
        ),
      ]);
      return {
        createdBy: createdBy?.data ?? [],
        modifiedBy: modifiedBy?.data ?? [],
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to fetch category change data"
      );
    }
  }
);

// --- Fetch Filter Options for Employee Transfers ---
export const fetchEmployeeTransferFilters = createAsyncThunk(
  "filters/fetchEmployeeTransferFilters",
  async (
    { version, tenant }: { version: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      // Fetch all filter options in parallel
      const [
        createdByResponse,
        modifiedByResponse,
        designationResponse,
        transferToResponse,
        categoryResponse
      ] = await Promise.all([
        // Created By API
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitGetCreatedby(
          version,
          tenant
        ),
        // Modified By API
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitGetModifiedby(
          version,
          tenant
        ),
        // Designation API
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitEmployeeDesignationEnum(
          version,
          tenant
        ),
        // Transfer To API (for future use)
        EmployeeTransferringLimitService.getApiVEmployeeTransferringLimitEmployeeLimitTransferToEnum(
          version,
          tenant
        ),
        // Category API - Using EmployeePolicy API as requested
        EmployeePolicyService.getApiVEmployeePolicyCategory(
          version,
          tenant
        )
      ]);

      // Return structured filter options
      return {
        createdBy: createdByResponse?.data?.items ?? [],
        modifiedBy: modifiedByResponse?.data?.items ?? [],
        designation: designationResponse?.data?.items ?? [],
        transferToOptions: transferToResponse?.data?.items ?? [],
        category: categoryResponse?.data?.items ?? [],
        subCategory: [], // Empty initially - will be populated when category is selected
        referredDoctor: [], // Empty for now
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to fetch employee transfer filters"
      );
    }
  }
);

// --- Fetch SubCategory Options based on Category ---
export const fetchSubCategoryOptions = createAsyncThunk(
  "filters/fetchSubCategoryOptions",
  async (
    { version, categoryId, tenant }: { version: string; categoryId: string; tenant?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🔍 Fetching subcategories for category:', categoryId);
      
      const subCategoryResponse = await EmployeePolicyService.getApiVEmployeePolicySubCategory(
        version,
        categoryId,
        tenant
      );
      
      console.log('📊 SubCategory response:', subCategoryResponse?.data?.items);
      
      return subCategoryResponse?.data?.items ?? [];
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to fetch subcategory options"
      );
    }
  }
);

export const deleteEmployeeTransferring = createAsyncThunk<
  DeleteEmployeeTransferringLimitResponseDtoListResultModel,
  {
    version: string;
    tenant?: string;
    payload: DeleteEmployeeTransferringLimitCommand;
  }
>(
  "employeeTransferringLimit/delete",
  async ({ version, tenant, payload }, { rejectWithValue }) => {
    try {
      const response =
        await EmployeeTransferringLimitService.deleteApiVEmployeeTransferringLimitDelete(
          version,
          tenant,
          payload
        );
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err?.body ?? err.message ?? "Something went wrong"
      );
    }
  }
);
