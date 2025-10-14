import { createAsyncThunk } from "@reduxjs/toolkit";
import { IpdService } from "@/api-client/services/IpdService";
import {
  IpdBillDetailsResponse,
  SearchServicesResponse,
  IpdFinalizeRequest,
  IpdSaveDraftRequest,
  PatientVisitDetailsResponse,
} from "./types";

export const fetchIpdBillDetailsByDraftBillId = createAsyncThunk<
  IpdBillDetailsResponse,
  { version: string; draftBillId: string; tenant?: string },
  { rejectValue: string }
>(
  "ipdBillDetails/fetchByDraftBillId",
  async ({ version, draftBillId, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.postApiVIpdGetIpdDraftBillDetailsByBillId(version, tenant, {
        billId: draftBillId,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch IPD bill details by draft bill id");
    }
  }
);

export const fetchIpdBillDetails = createAsyncThunk<
  IpdBillDetailsResponse,
  { version: string; billId: string; tenant?: string },
  { rejectValue: string }
>(
  "ipdBillDetails/fetch",
  async ({ version, billId, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.postApiVIpdBillId(version, tenant, {
        billId,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch IPD bill details"
      );
    }
  }
);

export const searchServices = createAsyncThunk<
  SearchServicesResponse,
  {
    version: string;
    hospitalId: string;
    searchterm: string;
    page?: number;
    pageSize?: number;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "ipdBillDetails/searchServices",
  async (
    { version, hospitalId, searchterm, page = 1, pageSize = 100, tenant },
    { rejectWithValue }
  ) => {
    try {
      const response = await IpdService.postApiVIpdSearchServiceslist(
        version,
        tenant,
        {
          hospitalId,
          searchterm,
          page,
          pageSize,
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to search services");
    }
  }
);

export const finalizeIpdBill = createAsyncThunk<
  any,
  {
    version: string;
    request: IpdFinalizeRequest;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "ipdBillDetails/finalize",
  async ({ version, request, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.postApiVIpdIpdBillsSaveFinal(
        version,
        tenant,
        request
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to finalize IPD bill");
    }
  }
);

export const saveIpdDraft = createAsyncThunk<
  any,
  {
    version: string;
    request: IpdSaveDraftRequest;
    tenant?: string;
  },
  { rejectValue: string }
>(
  "ipdBillDetails/saveDraft",
  async ({ version, request, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.postApiVIpdIpdBillsSaveDraft(
        version,
        tenant,
        request
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to save IPD draft");
    }
  }
);

export const fetchPatientVisitDetails = createAsyncThunk<
  PatientVisitDetailsResponse,
  { version: string; patientId: string; visitId?: string; tenant?: string },
  { rejectValue: string }
>(
  "ipdBillDetails/fetchPatientVisitDetails",
  async ({ version, patientId, visitId, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.getApiVIpdVisitDetails(
        version,
        patientId,
        visitId,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch patient visit details"
      );
    }
  }
);
