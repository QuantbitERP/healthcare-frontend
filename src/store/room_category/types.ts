import { CancelRoomCategoryDtoResultModel, KVPairListResultModelResultModel, RoomCategoriesWithSearchAndFilterResponseDtoResultModel, RoomCategoryMasterDtoResultModel, RoomCategoryResponceDTOResultModel, RoomCategorySaveRequestDTOResultModel,  } from "@/services/api-client";
import { RoomCategoryFull } from "./data";
import { CommonResponseDto } from "@/services/api-client/models/RateListDto";

export interface RoomCategoryState {
  list: RoomCategoryFull[];
  loading: boolean;
  error: string | null;
}

export interface RoomCategoryListState {
  hospitals: CommonResponseDto;
  loading: boolean;
  error: string | null;
}

export interface RoomCategoryFilterState {
  hospitals: CommonResponseDto;
  roomCategoryStatus: KVPairListResultModelResultModel | null;
  createdBy: KVPairListResultModelResultModel | null;
  modifiedBy: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

export interface SaveRoomCategoryState {
  data: RoomCategorySaveRequestDTOResultModel | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface DeleteRoomCategoryState {
  data: CancelRoomCategoryDtoResultModel | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface fetchRoomCategoriesWithFiltersType {
  data: RoomCategoriesWithSearchAndFilterResponseDtoResultModel | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface RoomCategoryUpdateState {
    loading: boolean;
    error: string | null;
    roomCategory: RoomCategoryResponceDTOResultModel | null;
}

export interface FetchRoomCategoryArgs {
    id: string;
    version: string;
    tenant?: string;
}

export interface GetRoomCategoryState {
    data: RoomCategoryMasterDtoResultModel | null;
    loading: boolean;
    error: string | null;
}