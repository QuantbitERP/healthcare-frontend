import { OpdBillService } from "@/services/api-client";
import { RefundsService } from "@/services/api-client/services/RefundsService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface LabelValue {
  label: string;
  value: string;
}
export interface ItemValue {
  id: string;
  name: string;
}
export interface RefundFilterOptionsState {
    loading: boolean;
    error: string | null;
    ApporvedByList: LabelValue[];
    RefundTypes: LabelValue[];
    RefundScopes:LabelValue[];
    RefundStatus:LabelValue[];
    Paymodes:LabelValue[];

  }

  
const initialState:RefundFilterOptionsState ={
  loading: false,
  error:  null,
  ApporvedByList: [],
  RefundTypes: [],
  RefundScopes:[],
  RefundStatus:[],
  Paymodes:[]
}
export const fetchRefundFilterOptions = createAsyncThunk("RefundFilterOptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [ApporvedByList, RefundStatus,RefundTypes,RefundScopes,Paymodes] = await Promise.all([
        RefundsService.postApiV1RefundApporvedBy(),
        RefundsService.postApiV1RefundsStatus(),
        RefundsService.postApiV1RefundType(),
        RefundsService.postApiV1RefundScope(),
        OpdBillService.getApiVOpdBillOpdbillsPaymentsMode("1","")
      ]);
      return {
        ApporvedByList: ApporvedByList.map((item) => ({
          value: item.approvedById ?? "",
          label: item.approvedByName ?? "",
        })) ?? [],
        RefundStatus: RefundStatus.map((item) => ({
          value: item.statusId ?? "",
          label: item.statusName ?? "",
        })) ?? [],
        RefundTypes: RefundTypes.map((item) => ({
          value: item.refundTypeId ?? "",
          label: item.refundTypeName ?? "",
        })) ?? [],
        RefundScopes:RefundScopes.map((item)=>({
          value:item.refundScopeId,
          label:item.refundScopeName
        }))??[],
        Paymodes:Paymodes.data?.items?.map((item)=>({
          value:item.key ?? " ",
          label:item.value ?? " "
        }))??[],
      };
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch filter options");
    }
  }
);
const RefundFilterOptionsSlice = createSlice({
  name: "RefundFilterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefundFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        
        state.ApporvedByList = action.payload.ApporvedByList;
        state.RefundScopes = action.payload.RefundScopes;
        state.RefundStatus = action.payload.RefundStatus;
        state.RefundTypes = action.payload.RefundTypes;
        state.Paymodes = action.payload.Paymodes;
      })
      .addCase(fetchRefundFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default RefundFilterOptionsSlice.reducer;
