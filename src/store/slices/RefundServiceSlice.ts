import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RefundsService } from "@/services/api-client/services/RefundsService";
import { ServiceDetail } from "@/services/api-client/models/RefundsDto";
interface RefundServiceState {
  data: ServiceDetail[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: RefundServiceState = {
  data:[],
  loading: false,
  error: null,
};

export const fetchBillServiceDetails = createAsyncThunk<
Array<ServiceDetail>,
  string,
  { rejectValue: string }
>(
  "refundService/fetchBillServiceDetails",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await RefundsService.getBillByserviceDetails(billId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch bill service details");
    }
  }
);

const refundServiceSlice = createSlice({
  name: "refundService",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillServiceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillServiceDetails.fulfilled, (state, action: PayloadAction<ServiceDetail[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBillServiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching bill service details";
      });
  },
});

export default refundServiceSlice.reducer;
