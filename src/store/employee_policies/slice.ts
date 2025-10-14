import { createSlice } from "@reduxjs/toolkit";
import { PolicyState, ScoreState, FiltersState } from "./types";
import {
  fetchScores,
  fetchPolicyTableData,
  fetchFilterOptions,
  fetchEmployeePolicySubCategories,
  fetchPrefix,
  fetchEmployeePolicyById,
  fetchDependentRelations,
} from "./thunks";

const ScoreInitialState: ScoreState = {
  data: [],
  loading: false,
  error: null,
};

export const scoreSlice = createSlice({
  name: "score",
  initialState: ScoreInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

const TableInitialState: PolicyState = {
  data: [],
  policyData: null,
  loading: false,
  error: null,
};

export const policyTableSlice = createSlice({
  name: "policyTable",
  initialState: TableInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicyTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyTableData.fulfilled, (state, action: any) => {
        state.data = action.payload?.data || [];
        state.loading = false;
      })
      .addCase(fetchPolicyTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load policy data";
      })

      .addCase(fetchEmployeePolicyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeePolicyById.fulfilled, (state, action: any) => {
        state.policyData = action.payload?.data || [];
        state.loading = false;
      })
      .addCase(fetchEmployeePolicyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch policy data";
      })

  },
});

const initialState: FiltersState = {
  data: {
    employeeCategories: [],
    subCategories: [],
    years: [],
    createdBy: [],
    modifiedBy: [],
    category: [],
  },
  prefix: [],
  dependentRelations: [],
  loading: false,
  error: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch filter options";
      })
      .addCase(fetchEmployeePolicySubCategories.fulfilled, (state, action) => {
        state.data.subCategories = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchPrefix.fulfilled, (state, action) => {
        state.prefix = action.payload?.items || [];
        state.loading = false;
      })
      .addCase(fetchDependentRelations.fulfilled, (state, action) => {
        // Transform the API response to match the expected format
        const relations = action.payload?.items || [];
        state.dependentRelations = relations.map((item: any) => ({
          key: item.key || item.id,
          value: item.value || item.name || item.label,
        }));
        state.loading = false;
      })
      .addCase(fetchDependentRelations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dependent relations";
      });
  },
});
