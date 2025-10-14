import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FinanceAuthorityService } from "@/api-client";
import { ConcessionCategoryService } from "@/services/api-client/services/ConcessionCategoryService";
import type { KVPairListResultModelResultModel } from '@/services/api-client/models/KVPairListResultModelResultModel';
import { ConcessionCategoryTypeByIdDtoResultModel } from "@/services/api-client/models/ConcessionCategoryTypeByIdDtoResultModel";

interface ConcessionState {
  data: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConcessionState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchConcessionGivenBy = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "finance/fetchConcessionGivenBy",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await FinanceAuthorityService.getApiVFinanceAuthorityConcessionGivenBy(
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch concession list"
      );
    }
  }
);

export const concessionSlice = createSlice({
  name: "financeConcession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConcessionGivenBy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionGivenBy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConcessionGivenBy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

interface ConcessionCategoryState {
  data: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialCategoryState: ConcessionCategoryState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchConcessionCategoryTypes = createAsyncThunk<
KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "concessionCategory/fetchConcessionCategoryTypes",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await ConcessionCategoryService.getApiVConcessionCategoryConcessionCategoryTypes(
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch concession category types"
      );
    }
  }
);

export const concessionCategorySlice = createSlice({
  name: "concessionCategory",
  initialState: initialCategoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConcessionCategoryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionCategoryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConcessionCategoryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Something went wrong";
      });
  },
});

export const fetchConcessionCategoryTypeById = createAsyncThunk<
  ConcessionCategoryTypeByIdDtoResultModel,
  { id: string; version: string; tenant?: string },
  { rejectValue: string }
>(
  "concessionCategory/fetchConcessionCategoryTypeById",
  async ({ id, version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await ConcessionCategoryService.getApiVConcessionCategory(
          id,
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch category type by ID"
      );
    }
  }
);

interface ConcessionCategoryTypeByIdState {
  data: ConcessionCategoryTypeByIdDtoResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialCategoryByIdState: ConcessionCategoryTypeByIdState = {
  data: null,
  loading: false,
  error: null,
};

export const concessionCategoryTypeByIdSlice = createSlice({
  name: "concessionCategoryTypeById",
  initialState: initialCategoryByIdState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConcessionCategoryTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConcessionCategoryTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConcessionCategoryTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});
