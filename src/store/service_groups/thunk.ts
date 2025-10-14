// src/store/thunks/serviceGroupThunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetServiceGroupListRequestDto,
  ServiceGroupRequestDto,
  DepartmentListDto,
  ServiceGroupListResponseDtoListResultModelResultModel,
  ServiceGroupByIdDtoResultModel,
  CancelServiceGroupDtoResultModel,
  CreateServiceGroupCommand,
} from "@/api-client";
import {
  ServiceGroupService,
  DepartmentsService,
} from "@/api-client";
import { CommonResponseDto } from "@/api-client/models/DepartmentListDto";

/**
 * Fetch paginated list of service groups
 */
export const fetchServiceGroups = createAsyncThunk<
  ServiceGroupListResponseDtoListResultModelResultModel,
  {
    version: string;
    tenant?: string;
    requestBody?: GetServiceGroupListRequestDto;
  },
  { rejectValue: string }
>(
  "serviceGroup/fetchServiceGroups",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      return await ServiceGroupService.postApiVServiceGroupList(
        version,
        tenant,
        requestBody
      );
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch list");
    }
  }
);

/**
 * Get a single service group by ID
 */
export const getServiceGroup = createAsyncThunk<
  ServiceGroupByIdDtoResultModel,
  { id: string; version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceGroup/getServiceGroup",
  async ({ id, version, tenant }, { rejectWithValue }) => {
    try {
      return await ServiceGroupService.getApiVServiceGroup(id, version, tenant);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch group");
    }
  }
);

/**
 * Create a new service group
 */
export const createServiceGroup = createAsyncThunk<
  any,
  { version: string; tenant?: string; requestBody?: CreateServiceGroupCommand },
  { rejectValue: any }
>(
  "serviceGroup/createServiceGroup",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await ServiceGroupService.postApiVServiceGroupSave(
        version,
        tenant,
        requestBody
      );
      
      // Check if the response indicates an error
      if (response?.isError === true) {
        return rejectWithValue(response);
      }
      
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err?.body?.errors || err.message || "Failed to create service group"
      );
    }
  }
);

/**
 * Update an existing service group
 */
export const updateServiceGroup = createAsyncThunk<
  any,
  {
    id: string;
    version: string;
    tenant?: string;
    requestBody?: ServiceGroupRequestDto;
  },
  { rejectValue: any }
>(
  "serviceGroup/updateServiceGroup",
  async ({ id, version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await ServiceGroupService.putApiVServiceGroup(
        id,
        version,
        tenant,
        requestBody
      );
      
      // Check if the response indicates an error
      if (response?.isError === true) {
        return rejectWithValue(response);
      }
      
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update service group");
    }
  }
);

/**
 * Delete service groups (bulk delete by IDs)
 */
export const deleteServiceGroups = createAsyncThunk<
  CancelServiceGroupDtoResultModel,
  { version: string; tenant?: string; requestBody?: string[] },
  { rejectValue: any }
>(
  "serviceGroup/deleteServiceGroups",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await ServiceGroupService.deleteApiVServiceGroupDelete(
        version,
        tenant,
        requestBody
      );
      
      // Check if the response indicates an error
      if (response?.isError === true) {
        return rejectWithValue(response);
      }
      
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete service groups");
    }
  }
);

/**
 * Fetch sequence numbers for service groups
 */
export const fetchSequenceNoList = createAsyncThunk<
  CommonResponseDto,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceGroup/fetchSequenceNoList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      return await ServiceGroupService.getApiVServiceGroupSequenceNoList(
        version,
        tenant
      );
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch sequence numbers");
    }
  }
);

/**
 * Fetch all filters needed for service group filter dialog
 */
export const fetchAllServiceGroupFilters = createAsyncThunk<
  {
    departments: DepartmentListDto;
    createdByList: CommonResponseDto;
    modifiedByList: CommonResponseDto;
    sequenceNoList: CommonResponseDto;
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "serviceGroup/fetchAllServiceGroupFilters",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [departments, createdByList, modifiedByList, sequenceNoList] =
        await Promise.all([
          DepartmentsService.getApiVDepartmentsDepartments(version, tenant),
          // ServiceGroupService.getApiVServiceMasterCreatedByList(
          //   version,
          //   tenant
          // ),
           ServiceGroupService.getApiVServiceMasterCreatedByList(
             version,
            tenant
           ),
        //  UserService.getApiVUserModifiedByList(version, tenant),
          ServiceGroupService.getApiVUserModifiedByList(version, tenant),
          ServiceGroupService.getApiVServiceGroupSequenceNoList(
            version,
            tenant
          ),
        ]);

      return {
        departments,
        createdByList,
        modifiedByList,
        sequenceNoList,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch service group filters"
      );
    }
  }
);
