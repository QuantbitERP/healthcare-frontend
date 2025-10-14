import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOperationCategoryList,
  fetchOperationCategoryById,
  createOperationCategory,
  updateOperationCategory,
  deleteOperationCategory,
  fetchOperationCategories,
  fetchOperationCategoryStatus,
  fetchOperationCategoryCreatedBy,
  fetchOperationCategoryModifiedBy
} from './thunk';
import {
  OperationCategoryState,
  OperationCategoryListState,
  OperationCategoryByIdState,
  OperationCategoryCreateState,
  OperationCategoryUpdateState,
  OperationCategoryDeleteState,
  OperationCategoryDropdownState
} from './types';

// Initial states
const initialOperationCategoryState:OperationCategoryState  =
{
  list:{
data:{
items:[],
metadata:{
  
}
}
  },
  error:"",
  loading:false,
};

const initialOperationCategoryListState: OperationCategoryListState = {
  operationCategories: [],
  loading: false,
  error: null,
};

const initialOperationCategoryByIdState: OperationCategoryByIdState = {
  data: null,
  loading: false,
  error: null,
};

const initialOperationCategoryCreateState: OperationCategoryCreateState = {
  loading: false,
  error: null,
  success: false,
};

const initialOperationCategoryUpdateState: OperationCategoryUpdateState = {
  loading: false,
  error: null,
  success: false,
};

const initialOperationCategoryDeleteState: OperationCategoryDeleteState = {
  loading: false,
  error: null,
  success: false,
};

const initialDropdownState: OperationCategoryDropdownState = {
  status: [],
  createdBy: [],
  modifiedBy: [],
  loading: false,
  error: null,
};

// Main Operation Category Slice
export const operationCategorySlice = createSlice({
  name: 'operationCategory',
  initialState: {
    ...initialOperationCategoryState,
    dropdowns: initialDropdownState,
  },
  reducers: {
    resetOperationCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      //state.selectedItem = null;
    },
    clearOperationCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchOperationCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload
      })
      .addCase(fetchOperationCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch operation category list';
      })

      // Fetch by ID
      .addCase(fetchOperationCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationCategoryById.fulfilled, (state) => {
        state.loading = false;
       // state.selectedItem = action.payload;
      })
      .addCase(fetchOperationCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch operation category';
      })

      // Create
      .addCase(createOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOperationCategory.fulfilled, (state) => {
        state.loading = false;
        // Optionally refresh the list
      })
      .addCase(createOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create operation category';
      })

      // Update
      .addCase(updateOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOperationCategory.fulfilled, (state) => {
        state.loading = false;
        // Optionally refresh the list or update selected item
      })
      .addCase(updateOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update operation category';
      })

      // Delete
      .addCase(deleteOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOperationCategory.fulfilled, (state) => {
        state.loading = false;
        // Optionally refresh the list
      })
      .addCase(deleteOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete operation category';
      })

      // Status Dropdown
      .addCase(fetchOperationCategoryStatus.pending, (state) => {
        state.dropdowns.loading = true;
        state.dropdowns.error = null;
      })
      .addCase(fetchOperationCategoryStatus.fulfilled, (state, action) => {
        state.dropdowns.status = action.payload.data?.items || [];
        state.dropdowns.loading = false;
      })
      .addCase(fetchOperationCategoryStatus.rejected, (state, action) => {
        state.dropdowns.loading = false;
        state.dropdowns.error = action.payload || 'Failed to fetch status list';
      })
      // Created By Dropdown
      .addCase(fetchOperationCategoryCreatedBy.pending, (state) => {
        state.dropdowns.loading = true;
        state.dropdowns.error = null;
      })
      .addCase(fetchOperationCategoryCreatedBy.fulfilled, (state, action) => {
        state.dropdowns.createdBy = action.payload.data?.items || [];
        state.dropdowns.loading = false;
      })
      .addCase(fetchOperationCategoryCreatedBy.rejected, (state, action) => {
        state.dropdowns.loading = false;
        state.dropdowns.error = action.payload || 'Failed to fetch created by list';
      })
      // Modified By Dropdown
      .addCase(fetchOperationCategoryModifiedBy.pending, (state) => {
        state.dropdowns.loading = true;
        state.dropdowns.error = null;
      })
      .addCase(fetchOperationCategoryModifiedBy.fulfilled, (state, action) => {
        state.dropdowns.modifiedBy = action.payload.data?.items || [];
        state.dropdowns.loading = false;
      })
      .addCase(fetchOperationCategoryModifiedBy.rejected, (state, action) => {
        state.dropdowns.loading = false;
        state.dropdowns.error = action.payload || 'Failed to fetch modified by list';
      });
  },
});

// Operation Category List Slice (for dropdown)
export const operationCategoryListSlice = createSlice({
  name: 'operationCategoryList',
  initialState: initialOperationCategoryListState,
  reducers: {
    resetOperationCategoryListState: (state) => {
      state.loading = false;
      state.error = null;
      state.operationCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperationCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.operationCategories = action.payload;
      })
      .addCase(fetchOperationCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch operation categories';
      });
  },
});

// Operation Category by ID Slice
export const operationCategoryByIdSlice = createSlice({
  name: 'operationCategoryById',
  initialState: initialOperationCategoryByIdState,
  reducers: {
    resetOperationCategoryByIdState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperationCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOperationCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch operation category';
      });
  },
});

// Operation Category Create Slice
export const operationCategoryCreateSlice = createSlice({
  name: 'operationCategoryCreate',
  initialState: initialOperationCategoryCreateState,
  reducers: {
    resetOperationCategoryCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOperationCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create operation category';
        state.success = false;
      });
  },
});

// Operation Category Update Slice
export const operationCategoryUpdateSlice = createSlice({
  name: 'operationCategoryUpdate',
  initialState: initialOperationCategoryUpdateState,
  reducers: {
    resetOperationCategoryUpdateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOperationCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update operation category';
        state.success = false;
      });
  },
});

// Operation Category Delete Slice
export const operationCategoryDeleteSlice = createSlice({
  name: 'operationCategoryDelete',
  initialState: initialOperationCategoryDeleteState,
  reducers: {
    resetOperationCategoryDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOperationCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOperationCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteOperationCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete operation category';
        state.success = false;
      });
  },
});

// Export actions
export const {
  resetOperationCategoryState,
  clearOperationCategoryError,
} = operationCategorySlice.actions;

export const { resetOperationCategoryListState } = operationCategoryListSlice.actions;
export const { resetOperationCategoryByIdState } = operationCategoryByIdSlice.actions;
export const { resetOperationCategoryCreateState } = operationCategoryCreateSlice.actions;
export const { resetOperationCategoryUpdateState } = operationCategoryUpdateSlice.actions;
export const { resetOperationCategoryDeleteState } = operationCategoryDeleteSlice.actions;
