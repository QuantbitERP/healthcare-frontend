// src/store/wardSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WardDto } from "@/services/api-client/";
import { GenderDto } from "@/services/api-client/";
import type { KVPairListResultModelResultModel } from "@/services/api-client/";
import { fetchWardList , fetchGenderList, fetchCreatedByList, fetchModifiedByList } from "./thunks";

interface WardState {
  wards: WardDto[];
  loading: boolean;
  error: string | null;
}

const initialState: WardState = {
  wards: [],
  loading: false,
  error: null,
};

const wardSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {
    clearWardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWardList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWardList.fulfilled, (state, action: PayloadAction<WardDto[]>) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(fetchWardList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

interface GenderState {
  genders: GenderDto[];
  loading: boolean;
  error: string | null;
}

const initialGenderState: GenderState = {
  genders: [],
  loading: false,
  error: null,
};

export const genderSlice = createSlice({
  name: "gender",
  initialState: initialGenderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGenderList.fulfilled,
        (state, action: PayloadAction<GenderDto[]>) => {
          state.loading = false;
          state.genders = action.payload;
        }
      )
      .addCase(fetchGenderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface CreatedByState {
  createdByList: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialCreatedByState: CreatedByState = {
  createdByList: null,
  loading: false,
  error: null,
};

export const createdBySlice = createSlice({
  name: "createdBy",
  initialState: initialCreatedByState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatedByList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCreatedByList.fulfilled,
        (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
          state.loading = false;
          state.createdByList = action.payload;
        }
      )
      .addCase(fetchCreatedByList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface ModifiedByState {
  modifiedByList: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialModifiedByState: ModifiedByState = {
  modifiedByList: null,
  loading: false,
  error: null,
};

export const modifiedBySlice = createSlice({
  name: "modifiedBy",
  initialState: initialModifiedByState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModifiedByList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchModifiedByList.fulfilled,
        (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
          state.loading = false;
          state.modifiedByList = action.payload;
        }
      )
      .addCase(fetchModifiedByList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWardError } = wardSlice.actions;
export const wardReducer = wardSlice.reducer;
export const genderReducer = genderSlice.reducer;
export const createdByReducer = createdBySlice.reducer;
export const modifiedByReducer = modifiedBySlice.reducer;