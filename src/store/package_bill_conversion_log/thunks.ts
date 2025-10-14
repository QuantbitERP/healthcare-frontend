import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  KVPairListResultModelResultModel,
  PackageBillConversionLogSerachFilterRequestDto,
  PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel
} from "@/services/api-client/";
import { PackageBillConversionLogService } from "@/services/api-client/";

// Thunk: Fetch Change Type
export const fetchPackageBillConversionLogChangeType = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string }
>(
  "packageBillConversionLog/fetchChangeType",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      return await PackageBillConversionLogService.getApiVPackageBillConversionLogChangetype(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch Change Type");
    }
  }
);

// Thunk: Fetch Modified By
export const fetchPackageBillConversionLogModifiedBy = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string }
>(
  "packageBillConversionLog/fetchModifiedBy",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      return await PackageBillConversionLogService.getApiVPackageBillConversionLogModifieddBy(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch Modified By");
    }
  }
);

// Thunk: Fetch Source Package
export const fetchPackageBillConversionLogSourcePackage = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string }
>(
  "packageBillConversionLog/fetchSourcePackage",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      return await PackageBillConversionLogService.getApiVPackageBillConversionLogSourcepackage(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch Source Package");
    }
  }
);

// Thunk: Fetch Target Package
export const fetchPackageBillConversionLogTargetPackage = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string }
>(
  "packageBillConversionLog/fetchTargetPackage",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      return await PackageBillConversionLogService.getApiVPackageBillConversionLogTargetpackage(version, tenant);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch Target Package");
    }
  }
);

// Thunk: Filter Search List
export const fetchPackageBillConversionLogFilterSearchList = createAsyncThunk<
  PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel,
  { version: string; tenant?: string; requestBody?: PackageBillConversionLogSerachFilterRequestDto }
>(
  "packageBillConversionLog/fetchFilterSearchList",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      return await PackageBillConversionLogService.postApiVPackageBillConversionLogFilterSearchList(
        version,
        tenant,
        requestBody
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch Filter Search List");
    }
  }
);
