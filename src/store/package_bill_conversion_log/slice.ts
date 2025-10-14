import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPackageBillConversionLogChangeType,
  fetchPackageBillConversionLogModifiedBy,
  fetchPackageBillConversionLogSourcePackage,
  fetchPackageBillConversionLogTargetPackage,
  fetchPackageBillConversionLogFilterSearchList,
} from "./thunks";
import {
  KVPairListResultModelResultModel,
  PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel,
} from "@/services/api-client";

interface PackageBillConversionLogState {
  changeType: KVPairListResultModelResultModel | null;
  modifiedBy: KVPairListResultModelResultModel | null;
  sourcePackage: KVPairListResultModelResultModel | null;
  targetPackage: KVPairListResultModelResultModel | null;
  filterSearchList: PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackageBillConversionLogState = {
  changeType: null,
  modifiedBy: null,
  sourcePackage: null,
  targetPackage: null,
  filterSearchList: null,
  loading: false,
  error: null,
};

const packageBillConversionLogSlice = createSlice({
  name: "packageBillConversionLog",
  initialState,
  reducers: {
    resetPackageBillConversionLogState: () => initialState,
  },
  extraReducers: (builder) => {
    // ChangeType
    builder
      .addCase(fetchPackageBillConversionLogChangeType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageBillConversionLogChangeType.fulfilled, (state, action) => {
        state.loading = false;
        state.changeType = action.payload;
      })
      .addCase(fetchPackageBillConversionLogChangeType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ModifiedBy
    builder
      .addCase(fetchPackageBillConversionLogModifiedBy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageBillConversionLogModifiedBy.fulfilled, (state, action) => {
        state.loading = false;
        state.modifiedBy = action.payload;
      })
      .addCase(fetchPackageBillConversionLogModifiedBy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // SourcePackage
    builder
      .addCase(fetchPackageBillConversionLogSourcePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageBillConversionLogSourcePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.sourcePackage = action.payload;
      })
      .addCase(fetchPackageBillConversionLogSourcePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // TargetPackage
    builder
      .addCase(fetchPackageBillConversionLogTargetPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageBillConversionLogTargetPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.targetPackage = action.payload;
      })
      .addCase(fetchPackageBillConversionLogTargetPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // FilterSearchList
    builder
      .addCase(fetchPackageBillConversionLogFilterSearchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageBillConversionLogFilterSearchList.fulfilled, (state, action) => {
        state.loading = false;
        state.filterSearchList = action.payload;
      })
      .addCase(fetchPackageBillConversionLogFilterSearchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPackageBillConversionLogState } = packageBillConversionLogSlice.actions;
export default packageBillConversionLogSlice.reducer;
