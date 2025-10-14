// src/store/slices/serviceGroupSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DepartmentListDto,
  ServiceGroupListResponseDtoListResultModelResultModel,
  ServiceGroupRequestDto,
  ServiceGroupListResponseDto,
} from "@/api-client";
import {
  createServiceGroup,
  deleteServiceGroups,
  fetchAllServiceGroupFilters,
  fetchSequenceNoList,
  fetchServiceGroups,
  getServiceGroup,
  updateServiceGroup,
} from "./thunk";
import { CommonResponseDto } from "@/api-client/models/DepartmentListDto";

interface MetaData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  sortId: string;
  sortType: "asc" | "desc";
}

interface ServiceGroupState {
  list: ServiceGroupListResponseDto[]; // Using the response DTO type from API
  selected: ServiceGroupRequestDto | null;
  sequenceNumbers: CommonResponseDto;
  loading: boolean;
  meta?: MetaData;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

const initialState: ServiceGroupState = {
  list: [],
  selected: null,
  sequenceNumbers: {
    data: {
      items: [],
    },
  },
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  meta: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    sortId: "modifiedOn",
    sortType: "asc",
  },
};

const serviceGroupSlice = createSlice({
  name: "serviceGroup",
  initialState,
  reducers: {
    resetServiceGroupState: () => initialState,
  },
  extraReducers: (builder) => {
    /**
     * Fetch paginated list of service groups
     */
    builder
      .addCase(fetchServiceGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServiceGroups.fulfilled,
        (state, action: PayloadAction<ServiceGroupListResponseDtoListResultModelResultModel>) => {
          state.loading = false;
          const listData = action.payload.data;
          state.list = listData?.items || [];
          state.meta = {
            pageSize: action.payload?.data?.metadata?.page?.pageSize ?? 10,
            currentPage: action.payload?.data?.metadata?.page?.currentPage ?? 1,
            totalPages: action.payload?.data?.metadata?.page?.totalPages ?? 1,
            sortId: "modifiedOn",
            sortType: "asc",
          };
        }
      )
      .addCase(fetchServiceGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching list";
      });

    /**
     * Get single service group by ID
     */
    builder
      .addCase(getServiceGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getServiceGroup.fulfilled,
        (state) => {
          state.loading = false;
        }
      )
      .addCase(getServiceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching item";
      });

    /**
     * Create new service group
     */
    builder
      .addCase(createServiceGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createServiceGroup.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      .addCase(createServiceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error creating";
      });

    /**
     * Update existing service group
     */
    builder
      .addCase(updateServiceGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateServiceGroup.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateServiceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error updating";
      });

    /**
     * Delete service groups
     */
    builder
      .addCase(deleteServiceGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteServiceGroups.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteServiceGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error deleting";
      });

    /**
     * Fetch sequence numbers
     */
    builder
      .addCase(fetchSequenceNoList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSequenceNoList.fulfilled,
        (state, action: PayloadAction<CommonResponseDto>) => {
          state.loading = false;
          state.sequenceNumbers = action.payload;
        }
      )
      .addCase(fetchSequenceNoList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching sequence no";
      });
  },
});

export const { resetServiceGroupState } = serviceGroupSlice.actions;
export default serviceGroupSlice;

//
// Filters Slice
//

interface ServiceGroupFilterState {
  loading: boolean;
  error: any | null;
  departments: DepartmentListDto;
  createdByList: CommonResponseDto;
  modifiedByList: CommonResponseDto;
  sequenceNoList: CommonResponseDto;
}

const initialServiceGroupFilterState: ServiceGroupFilterState = {
  loading: false,
  error: null,
  departments: {
    data: {
      items: [],
    },
  },
  createdByList: {
    data: {
      items: [],
    },
  },
  modifiedByList: {
    data: {
      items: [],
    },
  },
  sequenceNoList: {
    data: {
      items: [],
    },
  },
};

export const serviceGroupFiltersSlice = createSlice({
  name: "serviceGroupFilters",
  initialState: initialServiceGroupFilterState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServiceGroupFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServiceGroupFilters.fulfilled, (state, action) => {
        const { departments, createdByList, modifiedByList, sequenceNoList } =
          action.payload;
        state.departments = departments;
        state.createdByList = createdByList;
        state.modifiedByList = modifiedByList;
        state.sequenceNoList = sequenceNoList;
        state.loading = false;
      })
      .addCase(fetchAllServiceGroupFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});
