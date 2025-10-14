// src/store/scheduleofChargeType/slices.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createScheduleofChargeType,
  updateScheduleofChargeType,
  deleteScheduleofChargeType,
  getScheduleofChargeTypeFilterType,
  getScheduleofChargeTypeCreatedBy,
  searchScheduleofChargeType,
  getScheduleofChargeTypeById,
  fetchScheduleofChargeTypeHospitalNames,
  fetchScheduleofChargeTypeList,
  fetchScheduleofChargeTypeCreatedBy,
} from "./thunk";

interface ScheduleofChargeTypeItem {
  id?: string;
  [key: string]: any;
}

interface MetaData {
  currentPage: number;
  totalPages: number;
  sortId: string;
  sortType: "asc" | "desc";
  pageSize: number;
}

interface ScheduleofChargeTypeState {
  list: ScheduleofChargeTypeItem[];
  selected: ScheduleofChargeTypeItem | null;
  sequenceNumbers: any[];
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  meta: MetaData;
  hospitalList: any[];
  typeList:any[];
  createdByList:any[];
}

const initialState: ScheduleofChargeTypeState = {
  list: [],
  selected: null,
  sequenceNumbers: [],
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  meta: {
    currentPage: 1,
    totalPages: 2,
    sortId: "modifiedOn",
    sortType: "asc",
    pageSize:10
  },
  hospitalList: [],
  typeList:[],
  createdByList:[]
};

export const scheduleofChargeTypeSlice = createSlice({
  name: "scheduleofChargeType",
  initialState,
  reducers: {
    resetScheduleofChargeTypeState: () => initialState,
  },
  extraReducers: (builder) => {
    // ✅ SEARCH / LIST FETCH
    builder
      .addCase(searchScheduleofChargeType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchScheduleofChargeType.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.list = action.payload?.data.items ?? [];
          state.meta = {
            currentPage: action.payload?.data.metadata?.page.currentPage ?? 1,
            totalPages: action.payload?.data.metadata?.page.totalPages ?? 1,
            pageSize: action.payload?.data.metadata?.page.pageSize ?? 10,
            sortType:"desc",
            sortId:"modifiedOn"
          };
        }
      )
      .addCase(
        searchScheduleofChargeType.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload ?? "Failed to fetch list";
        }
      );

    // ✅ GET BY ID (DETAILS)
    builder
      .addCase(getScheduleofChargeTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(
        getScheduleofChargeTypeById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selected = action.payload?.data ?? action.payload;
        }
      )
      .addCase(
        getScheduleofChargeTypeById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload ?? "Failed to fetch details";
        }
      );

    // ✅ CREATE
    builder
      .addCase(createScheduleofChargeType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(
        createScheduleofChargeType.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          
          // Check if API response indicates an error (lowercase isError for 200 status)
          if (action.payload?.isError) {
            state.createSuccess = false;
            state.error = action.payload.errorMessage || 'Failed to create rate name';
            return;
          }
          
          state.createSuccess = true;
          state.error = null;
          // Optionally push new record into list
          if (action.payload?.data) {
            state.list.unshift(action.payload.data);
          }
        }
      )
      .addCase(
        createScheduleofChargeType.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.createSuccess = false;
          state.error = action.payload ?? "Failed to create";
        }
      );

    // ✅ UPDATE
    builder
      .addCase(updateScheduleofChargeType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(
        updateScheduleofChargeType.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.updateSuccess = true;
          // Optionally update in list
          const updated = action.payload?.data;
          if (updated && updated.id) {
            state.list = state.list.map((item) =>
              item.id === updated.id ? updated : item
            );
          }
        }
      )
      .addCase(
        updateScheduleofChargeType.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.updateSuccess = false;
          state.error = action.payload ?? "Failed to update";
        }
      );

    // ✅ DELETE
    builder
      .addCase(deleteScheduleofChargeType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(
        deleteScheduleofChargeType.fulfilled,
        (_state, _action: PayloadAction<any>) => {
          //   state.loading = false;
          //   state.deleteSuccess = true;
          //   const deletedId = action.meta.arg?.data?.id;
          //   if (deletedId) {
          //     state.list = state.list.filter((item) => item.id !== deletedId);
          //   }
        }
      )
      .addCase(
        deleteScheduleofChargeType.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.deleteSuccess = false;
          state.error = action.payload ?? "Failed to delete";
        }
      );

    // ✅ FILTERS
    builder.addCase(
      getScheduleofChargeTypeFilterType.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.sequenceNumbers = action.payload?.data ?? [];
        state.createdByList = action.payload?.data ?? [];
      }
    );

    // ✅ CREATED BY LIST
    builder.addCase(
      getScheduleofChargeTypeCreatedBy.fulfilled,
      (state, action: PayloadAction<any>) => {
        // If you want to merge into sequenceNumbers or keep separate
        state.sequenceNumbers = action.payload?.data ?? [];
      }
    );

    builder.addCase(
      fetchScheduleofChargeTypeCreatedBy.fulfilled,
      (state, action) => {
        state.createdByList = action.payload?.createdByList ?? [];
      }
    );
    builder.addCase(
      fetchScheduleofChargeTypeHospitalNames.fulfilled,
      (state, action) => {
        state.hospitalList = action.payload.hospitalList.data?.items || [];
      }
    );
    builder.addCase(
      fetchScheduleofChargeTypeList.fulfilled,
      (state, action) => {
        state.typeList = action.payload.typeList;
      }
    );
    

    
  },
});

export const { resetScheduleofChargeTypeState } =
  scheduleofChargeTypeSlice.actions;

export default scheduleofChargeTypeSlice;
