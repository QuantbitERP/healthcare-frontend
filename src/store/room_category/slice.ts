import { createSlice } from "@reduxjs/toolkit";
import { deleteRoomCategory, fetchAllRoomCategoryFilters, fetchAllRoomCategoryList, fetchRoomCategoriesWithFilters, fetchRoomCategoryById, saveRoomCategory, updateRoomCategory } from "./thunk";
import { DeleteRoomCategoryState, fetchRoomCategoriesWithFiltersType, GetRoomCategoryState, RoomCategoryFilterState, RoomCategoryListState, RoomCategoryUpdateState, SaveRoomCategoryState } from "./types";


const roomCategoryAddNewInitialState: RoomCategoryListState = {
  hospitals: {
    data:{
      items:[],
      },
      isError: false,
      errorMessage: null,
      validationErrors: null,
    errorCode: null,
  },
  loading: false,
  error: null,
};
export const roomCategoryAddNewSlice = createSlice({
  name: 'roomCategoryList',
  initialState:roomCategoryAddNewInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoomCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoomCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload.hospitals;
      })
      .addCase(fetchAllRoomCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


//filter list
const roomCategoryFilterInitialState: RoomCategoryFilterState = {
  hospitals: {
   data:{
    items:[],
   },
   isError: false,
   errorMessage: null,
   validationErrors: null,
   errorCode: null,
  },
  roomCategoryStatus: null,
  createdBy: null,
  modifiedBy: null,
  loading: false,
  error: null,
};

export const roomCategoryFilterSlice = createSlice({
  name: 'roomCategoryFilter',
  initialState:roomCategoryFilterInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoomCategoryFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoomCategoryFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload.hospitals;
        state.roomCategoryStatus = action.payload.roomCategoryStatus;
        state.createdBy = action.payload.createdBy;
        state.modifiedBy = action.payload.modifiedBy;
      })
      .addCase(fetchAllRoomCategoryFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// save room category

const initialSaveRoomCategoryState: SaveRoomCategoryState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};
export const saveRoomCategorySlice = createSlice({
  name: 'saveRoomCategory',
  initialState:initialSaveRoomCategoryState,
  reducers: {
    resetSaveRoomCategoryState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRoomCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveRoomCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Check for API-level errors
        if (action.payload?.isError) {
          state.error = action.payload.errorMessage || 'An error occurred';
          state.success = false;
        } else {
          state.success = true;
          state.error = null;
        }
      })
      .addCase(saveRoomCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetSaveRoomCategoryState } = saveRoomCategorySlice.actions;

//delete Room Category


const initialDeleteRoomCategoryState: DeleteRoomCategoryState = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

export const deleteRoomCategorySlice = createSlice({
  name: 'deleteRoomCategory',
  initialState:initialDeleteRoomCategoryState,
  reducers: {
    resetDeleteRoomCategoryState: (state) => {
      state.data = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteRoomCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteRoomCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(deleteRoomCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetDeleteRoomCategoryState } = deleteRoomCategorySlice.actions;

//fetch with filters

const initialfetchRoomCategoriesWithFiltersState: fetchRoomCategoriesWithFiltersType = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

export const fetchRoomCategoriesWithFiltersSlice = createSlice({
  name: 'roomCategoryWithFilter',
  initialState:initialfetchRoomCategoriesWithFiltersState,
  reducers: {
    resetRoomCategoryFilterState: (state) => {
      state.data = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomCategoriesWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchRoomCategoriesWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(fetchRoomCategoriesWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

//update room category

const initialRoomCategoryUpdateState: RoomCategoryUpdateState = {
    loading: false,
    error: null,
    roomCategory: null,
};


export const roomCategoryUpdateSlice = createSlice({
    name: 'roomCategoryUpdate',
    initialState:initialRoomCategoryUpdateState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateRoomCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRoomCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.roomCategory = action.payload;
                // Check for API-level errors
                if (action.payload?.isError) {
                    state.error = action.payload.errorMessage || 'An error occurred';
                } else {
                    state.error = null;
                }
            })
            .addCase(updateRoomCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

//get room category by id


const getRoomCategoryInitialState: GetRoomCategoryState = {
    data: null,
    loading: false,
    error: null,
};

export const getRoomCategorySlice = createSlice({
    name: "roomCategory",
    initialState:getRoomCategoryInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchRoomCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
