import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClaimCheckListService, CompanyWiseCheckListService } from "@/services/api-client";
import type { 
  ClaimCheckListRequestDto, 

  CompanyWiseClaimCheckListRequestDto,
  CompanyWiseClaimCheckListSaveRequestDto
} from "@/services/api-client";

const API_VERSION = "1";

export const fetchClaimCheckList = createAsyncThunk(
  "claimCheckList/fetchAll",
  async (
    {
      tenant,
      filters,
    }: { tenant?: string; filters?: ClaimCheckListRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const res = await ClaimCheckListService.postApiVClaimCheckListFilterSearchList(
        API_VERSION,
        tenant,
        filters
      );
      return res?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const createClaimCheckList = createAsyncThunk(
  "claimCheckList/create",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await ClaimCheckListService.postApiVClaimCheckListSave(
        API_VERSION,
        tenant,
        payload
      );
      
      // Check if the response indicates an error (nested under result for create)
      if (res?.result?.isError) {
        return rejectWithValue(res.result.errorMessage || "An error occurred");
      }
      
      // Also check direct isError for backward compatibility
      if (res?.isError) {
        return rejectWithValue(res.errorMessage || "An error occurred");
      }
      
      return res?.data || res?.result?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const updateClaimCheckList = createAsyncThunk(
  "claimCheckList/update",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await ClaimCheckListService.putApiVClaimCheckList(
        API_VERSION,
        tenant,
        payload
      );
      
      // Check if the response indicates an error
      if (res?.isError) {
        return rejectWithValue(res.errorMessage || "An error occurred");
      }
      
      return res?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const deleteClaimCheckList = createAsyncThunk(
  "claimCheckList/delete",
  async (
    { tenant, ids }: { tenant?: string; ids: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await ClaimCheckListService.deleteApiVClaimCheckList(
        API_VERSION,
        tenant,
        { 
          model: { ids } 
        }
      );
      return res?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchClaimCheckListCreatedByUsers = createAsyncThunk(
  "claimCheckList/fetchCreatedByUsers",
  async (tenant: string | undefined, { rejectWithValue }) => {
    try {
      const res = await ClaimCheckListService.getApiVClaimCheckListGetCreatedBy(
        API_VERSION,
        tenant
      );
      return res?.data?.items ?? [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchClaimCheckListModifiedByUsers = createAsyncThunk(
  "claimCheckList/fetchModifiedByUsers",
  async (tenant: string | undefined, { rejectWithValue }) => {
    try {
      const res = await ClaimCheckListService.getApiVClaimCheckListGetModifiedBy(
        API_VERSION,
        tenant
      );
      return res?.data?.items ?? [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchClaimCheckListById = createAsyncThunk(
  "claimCheckList/fetchById",
  async (
    { tenant, id }: { tenant?: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await ClaimCheckListService.getApiVClaimCheckList(
        id,
        API_VERSION,
        tenant
      );
      // Extract data from the response wrapper
      return res?.data ?? null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const fetchCompanyWiseClaimCheckList = createAsyncThunk(
  "companyWiseClaimCheckList/fetchAll",
  async (
    {
      tenant,
      filters,
    }: { tenant?: string; filters?: CompanyWiseClaimCheckListRequestDto & { company?: string; pageNumber?: number; pageSize?: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await CompanyWiseCheckListService.getApiVCompanyWiseclaimCheckListFilterSearchList(
        API_VERSION,
        tenant,
        filters
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const createCompanyWiseClaimCheckList = createAsyncThunk(
  "companyWiseClaimCheckList/create",
  async (
    {
      tenant,
      payload,
    }: { tenant?: string; payload: CompanyWiseClaimCheckListSaveRequestDto },
    { rejectWithValue }
  ) => {
    try {
      const res = await CompanyWiseCheckListService.postApiVCompanyWiseclaimCheckList(
        API_VERSION,
        tenant,
        payload
      );
      return res?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchCompanyWiseClaimCheckListById = createAsyncThunk(
  "companyWiseClaimCheckList/fetchById",
  async (
    { tenant, id }: { tenant?: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await CompanyWiseCheckListService.getApiVCompanyWiseclaimCheckList(
        id,
        API_VERSION,
        tenant
      );
      return res ?? null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
