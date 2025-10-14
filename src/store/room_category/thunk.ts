import { createAsyncThunk } from "@reduxjs/toolkit";
import { CancelRoomCategoryDtoResultModel, CreateRoomCategoryCommand, HospitalService, KVPairListResultModelResultModel, RoomCategoriesWithSearchAndFilterResponseDtoResultModel, RoomCategoryListRequestDto, RoomCategoryMasterDtoResultModel, RoomCategoryResponceDTOResultModel, RoomCategorySaveRequestDTOResultModel, RoomCategoryService, UpdateRoomCategoryCommand } from "@/services/api-client";
import { CommonResponseDto } from "@/services/api-client/models/RateListDto";
import { FetchRoomCategoryArgs } from "./types";

//fetch all list add new 
export const fetchAllRoomCategoryList = createAsyncThunk<
  {
    hospitals:CommonResponseDto;
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/fetchAllRoomCategoryList',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [
        hospitals
      ] = await Promise.all([
        HospitalService.getApiVHospitalHospitals(version, tenant),
      ]);

      return {
        hospitals

      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch service filters');
    }
  }
);

export const fetchAllRoomCategoryFilters = createAsyncThunk<
  {
    hospitals:CommonResponseDto;
    roomCategoryStatus: KVPairListResultModelResultModel;
    createdBy: KVPairListResultModelResultModel;
    modifiedBy: KVPairListResultModelResultModel;
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/fetchAllRoomCategoryFilters',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [
        hospitals,
        roomCategoryStatus,
        createdBy,
        modifiedBy,
      ] = await Promise.all([
        HospitalService.getApiVHospitalHospitals(version, tenant),
        RoomCategoryService.getApiVRoomCategoryRoomcategoryStatus(version, tenant),
        RoomCategoryService.getApiVRoomCategoryGetCreatedby(version, tenant),
        RoomCategoryService.getApiVRoomCategoryGetModifiedby(version, tenant),
      ]);

      return {
        hospitals,
        roomCategoryStatus,
        createdBy,
        modifiedBy,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch service filters';
      return rejectWithValue(message);
    }
  }
);
//add new or save
export const saveRoomCategory = createAsyncThunk<
  RoomCategorySaveRequestDTOResultModel,
  { version: string; tenant?: string; data: CreateRoomCategoryCommand },
  { rejectValue: string }
>(
  'roomCategory/saveRoomCategory',
  async ({ version, tenant, data }, { rejectWithValue }) => {
    try {
      const response = await RoomCategoryService.postApiVRoomCategorySave(version, tenant, data);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save room category';
      return rejectWithValue(message);
    }
  }
);

//Delete Room category
export const deleteRoomCategory = createAsyncThunk<
  CancelRoomCategoryDtoResultModel,
  { ids: string[]; version: string; tenant?: string },
  { rejectValue: string }
>(
  'roomCategory/deleteRoomCategory',
  async ({ ids, version, tenant }, { rejectWithValue }) => {
    try {
      const result = await RoomCategoryService.deleteApiVRoomCategoryDelete(version, tenant, ids);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete room category';
      return rejectWithValue(message);
    }
  }
);

//fetch Room category with filters
export const fetchRoomCategoriesWithFilters = createAsyncThunk<
  RoomCategoriesWithSearchAndFilterResponseDtoResultModel,
  {
    version: string;
    tenant?: string;
    requestBody?: RoomCategoryListRequestDto;
  },
  { rejectValue: string }
>(
  'roomCategory/fetchRoomCategoriesWithFilters',
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response =
        await RoomCategoryService.postApiVRoomCategoryRoomCategoryByFilterWithSearch(
          version,
          tenant,
          requestBody
        );
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch filtered room categories';
      return rejectWithValue(message);
    }
  }
);

//update room category
export const updateRoomCategory = createAsyncThunk<
    RoomCategoryResponceDTOResultModel,
    { version: string; tenant?: string; requestBody?: UpdateRoomCategoryCommand },
    { rejectValue: string }
>(
    'roomCategory/update',
    async (
        { version, tenant, requestBody }: { version: string; tenant?: string; requestBody?: UpdateRoomCategoryCommand },
        { rejectWithValue }
    ) => {
        try {
            const response = await RoomCategoryService.putApiVRoomCategoryUpdate(version, tenant, requestBody);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update room category';
            return rejectWithValue(message);
        }
    }
);

//get roomcategory by id

export const fetchRoomCategoryById = createAsyncThunk<
    RoomCategoryMasterDtoResultModel,
    FetchRoomCategoryArgs
>(
    "roomCategory/fetchById",
    async ({ id, version, tenant }, { rejectWithValue }) => {
        try {
            const response = await RoomCategoryService.getApiVRoomCategoryRoomCategory(
                id,
                version,
                tenant
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch room category");
        }
    }
);