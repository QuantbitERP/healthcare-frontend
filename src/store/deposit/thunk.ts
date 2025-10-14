import { createAsyncThunk } from "@reduxjs/toolkit";
import { DepositService, OpdBillService, DepositTypeService } from "@/services/api-client";
import {
  CreateDepositCommand,
  UpdateDepositCommand,
  DeleteDepositIdCommand,
  DepositListRequestDto,
} from "@/api-client";
import { API_TENANT, API_VERSION } from "@/utils/constants";

export const fetchDepositBankList = createAsyncThunk(
  "deposit/fetchBankList",
  async () => {
    return await DepositService.getApiVDepositBankList(API_VERSION, API_TENANT);
  }
);

export const fetchPaymentMode = createAsyncThunk(
  "deposit/fetchPaymentMode",
  async () => {
    return await OpdBillService.getApiVOpdBillOpdbillsPaymentsMode(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositCreatedBy = createAsyncThunk(
  "deposit/fetchCreatedBy",
  async () => {
    return await DepositService.getApiVDepositGetCreatedby(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositModifiedBy = createAsyncThunk(
  "deposit/fetchModifiedBy",
  async () => {
    return await DepositService.getApiVDepositGetModifiedby(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositBlockingType = createAsyncThunk(
  "deposit/fetchBlockingType",
  async () => {
    return await DepositService.getApiVDepositGetDepositBlockingType(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositTypesNew = createAsyncThunk(
  "deposit/fetchDepositTypesNew",
  async () => {
    return await DepositService.getApiVDepositTypeDepositTypes(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositBlockingTypeNew = createAsyncThunk(
  "deposit/fetchDepositBlockingTypeNew",
  async () => {
    return await DepositService.getApiVDepositGetDepositBlockingType(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositTypes = createAsyncThunk(
  "deposit/fetchDepositTypes",
  async () => {
    return await DepositTypeService.getApiVDepositTypeApplicableForList(
      API_VERSION,
      API_TENANT
    );
  }
);

export const fetchDepositList = createAsyncThunk(
  "deposit/fetchList",
  async (requestBody: DepositListRequestDto) => {
    const response = await DepositService.postApiVDepositList(
      API_VERSION,
      API_TENANT,
      requestBody
    );
    return response;
  }
);

export const createDeposit = createAsyncThunk(
  "deposit/create",
  async (payload: CreateDepositCommand, { rejectWithValue }) => {
    try {
      
      
      return await DepositService.postApiVDepositSave(
        API_VERSION,
        API_TENANT,
        payload
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create deposit");
    }
  }
);

export const updateDeposit = createAsyncThunk(
  "deposit/update",
  async (payload: UpdateDepositCommand, { rejectWithValue }) => {
    try {
      return await DepositService.putApiVDeposit(
        API_VERSION,
        API_TENANT,
        payload
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update deposit");
    }
  }
);

export const deleteDeposit = createAsyncThunk(
  "deposit/delete",
  async (payload: DeleteDepositIdCommand, { rejectWithValue }) => {
    try {
      return await DepositService.deleteApiVDeposit(
        API_VERSION,
        API_TENANT,
        payload
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete deposit");
    }
  }
);

export const fetchDepositDetails = createAsyncThunk(
  "deposit/fetchDetails",
  async ({ receiptId }: { receiptId: string }, { rejectWithValue }) => {
    try {
    
      
    
      
      const response = await DepositService.getApiVDepositDeposit(
        receiptId,
        API_VERSION,
        API_TENANT
      );
      
    
      
      return response;
    } catch (error: any) {
      
      return rejectWithValue(error.message || "Failed to fetch deposit details");
    }
  }
);

export const fetchDepositConversionLog = createAsyncThunk(
  "deposit/fetchConversionLog",
  async (patientId: string, { rejectWithValue }) => {
    try {
      if (!patientId) {
        return rejectWithValue("No patientId provided");
      }
      
     
      
      const response = await DepositService.getApiVDepositDepositConversionLog(
        patientId,
        API_VERSION,
        API_TENANT
      );
      
   
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch patient deposits");
    }
  }
);

export const fetchPatientDepositInfo = createAsyncThunk(
  "deposit/fetchPatientDepositInfo",
  async (patientId: string) => {
    // You'll need to create this API endpoint in your backend
    // For now, I'll create a placeholder that you can replace with your actual API
    const response = await fetch(`/api/v1/Deposit/PatientDepositInfo/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'tenant': API_TENANT,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch patient deposit info');
    }
    
    return await response.json();
  }
);

export const fetchPatientDeposits = createAsyncThunk(
  "deposit/fetchPatientDeposits",
  async (patientId: string, { rejectWithValue }) => {
    try {
      if (!patientId) {
        return rejectWithValue("No patientId provided");
      }
      
      // Use the correct request body structure as per API specification
      const requestBody = {
        searchTerm: patientId,
        depositType: [], 
        depositBlockingType: [], // Empty array for all blocking types
        createdByList: [], // Empty array for all creators
        modifiedByList: [], // Empty array for all modifiers
        page: 1, // Changed from 0 to 1 to avoid negative offset
        pageSize: 100 // Get up to 100 deposits
      };
      
      const response = await DepositService.postApiVDepositList(
        API_VERSION,
        API_TENANT,
        requestBody
      );
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch patient deposits");
    }
  }
);

// Optional: Use this if you want to batch fetch filters in one thunk
export const fetchDepositFilterData = createAsyncThunk(
  "deposit/fetchFilterData",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch each API separately to identify which one is failing
      let createdByRes: any = { data: { items: [] } };
      try {
        createdByRes = await DepositService.getApiVDepositGetCreatedby(API_VERSION, API_TENANT);
      } catch {
        // Created by API failed, continue with empty data
      }
      
      let modifiedByRes: any = { data: { items: [] } };
      try {
        modifiedByRes = await DepositService.getApiVDepositGetModifiedby(API_VERSION, API_TENANT);
      } catch {
        // Modified by API failed, use created by as fallback
        modifiedByRes = createdByRes;
      }
      
      let depositBlockingTypesRes: any = { data: { items: [] } };
      try {
        depositBlockingTypesRes = await DepositService.getApiVDepositGetDepositBlockingType(API_VERSION, API_TENANT);
      } catch {
        // Deposit blocking types API failed, continue with empty data
      }
      
      // Try to fetch deposit types, but handle failure gracefully
      let depositTypesRes: any[] = [];
      try {
        depositTypesRes = await DepositTypeService.getApiVDepositTypeApplicableForList(API_VERSION, API_TENANT);
      } catch {
        // Use blocking types as fallback for deposit types
        depositTypesRes = depositBlockingTypesRes.data?.items || [];
      }

      const result = {
        createdByList: createdByRes.data?.items || [],
        modifiedByList: modifiedByRes.data?.items || [],
        depositTypes: depositTypesRes || [],
        depositBlockingTypes: depositBlockingTypesRes.data?.items || [],
      };
      
      return result;
      
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch filter data");
    }
  }
);
