// thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PatientCategoryTypeService } from "@/api-client/services/PatientCategoryTypeService";
import {
  PatientCategoryTypeRequestDto,
  PatientCategotyTypeSearchRequestDto,
} from "@/api-client";

export const fetchPatientCategoryTypes = createAsyncThunk(
  "patientCategoryType/fetchAll",
  async ({ version, tenant }: { version: string; tenant?: string }) => {
    return await PatientCategoryTypeService.getApiVPatientCategoryTypeGetPatientCategoryType(
      version,
      tenant
    );
  }
);

export const createPatientCategoryType = createAsyncThunk(
  "patientCategoryType/create",
  async ({
    version,
    tenant,
    data,
  }: {
    version: string;
    tenant?: string;
    data: PatientCategoryTypeRequestDto;
  }) => {
    return await PatientCategoryTypeService.postApiVPatientCategoryType(
      version,
      tenant,
      data
    );
  }
);

export const updatePatientCategoryType = createAsyncThunk(
  "patientCategoryType/update",
  async ({
    version,
    tenant,
    data,
  }: {
    version: string;
    tenant?: string;
    data: PatientCategoryTypeRequestDto;
  }) => {
    return await PatientCategoryTypeService.putApiVPatientCategoryType(
     // id,
      version,
      tenant,
      data
    );
  }
);

export const deletePatientCategoryType = createAsyncThunk(
  "patientCategoryType/delete",
  async ({
    version,
    tenant,
    ids,
  }: {
    version: string;
    tenant?: string;
    ids: string[];
  }) => {
    return await PatientCategoryTypeService.deleteApiVPatientCategoryType(
      version,
      tenant,
      ids
    );
  }
);

export const fetchCreatedByList = createAsyncThunk(
  "patientCategoryType/fetchCreatedByList",
  async ({ version, tenant }: { version: string; tenant?: string }) => {
    return await PatientCategoryTypeService.getApiVPatientCategoryTypeCreatedByList(
      version,
      tenant
    );
  }
);

export const fetchModifiedByList = createAsyncThunk(
  "patientCategoryType/fetchModifiedByList",
  async ({ version, tenant }: { version: string; tenant?: string }) => {
    return await PatientCategoryTypeService.getApiVPatientCategoryTypeGetServicemodifiedByList(
      version,
      tenant
    );
  }
);

export const fetchPatientCategoryTypeWithFilter = createAsyncThunk(
  "patientCategoryType/fetchWithFilter",
  async ({
    version,
    tenant,
    filter,
  }: {
    version: string;
    tenant?: string;
    filter: PatientCategotyTypeSearchRequestDto;
  }) => {
    return await PatientCategoryTypeService.postApiVPatientCategoryTypeGetPatientCategoryTypePageFilter(
      version,
      tenant,
      filter
    );
  }
);

export const fetchAllPatientTypeFilters = createAsyncThunk(
  "patienttypecategory/fetchAllServiceGroupFilters",
  async (
    { version, tenant }: { version: string; tenant: string },
    { rejectWithValue }
  ) => {
    try {
      const [patientTypes, createdByList, modifiedByList] = await Promise.all([
        PatientCategoryTypeService.getApiVPatientCategoryTypeGetPatientCategoryType(
          version,
          tenant
        ),
        PatientCategoryTypeService.getApiVPatientCategoryTypeCreatedByList(
          version,
          tenant
        ),
        PatientCategoryTypeService.getApiVPatientCategoryTypeCreatedByList(
          version,
          tenant
        ),
      ]);

      return {
        patientTypes,
        createdByList,
        modifiedByList,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch service filters"
      );
    }
  }
);

export const fetchPatientCategoryTypeById = createAsyncThunk(
  "patientCategoryType/fetchById",
  async ({
    id,
    version,
    tenant,
  }: {
    id: string;
    version: string;
    tenant?: string;
  }) => {
    return await PatientCategoryTypeService.getApiVPatientCategoryTypeById(
      id,
      version,
      tenant
    );
  }
);
