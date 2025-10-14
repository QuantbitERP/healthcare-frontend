import { RoomCategoryListRequestDto } from "@/services/api-client";

export const getDefaultRoomCategoryFilters = (): RoomCategoryListRequestDto => ({
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  createdByList: [],
  modifiedByList: [],
  hospitalIdList: [],
  status: [],
  searchTerm: '',
});