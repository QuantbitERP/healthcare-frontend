import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RefundsService } from '../../services/api-client/services/RefundsService';
import { RefundScoreDto } from '../../services/api-client/models/RefundsDto';

// State type
type RefundScoreState = {
  data: RefundScoreDto | null;
  loading: boolean;
  error: string | null;
};

const initialState: RefundScoreState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for fetching refund score
type RefundScoreParams = { fromDate: string; toDate: string };
export const fetchRefundScore = createAsyncThunk<
  RefundScoreDto,
  RefundScoreParams
>(
  'refundScore/fetchRefundScore',
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await RefundsService.postApiV1RefundScore(fromDate, toDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch refund score');
    }
  }
);

const refundScoreSlice = createSlice({
  name: 'refundScore',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefundScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundScore.fulfilled, (state, action: PayloadAction<RefundScoreDto>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRefundScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch refund score';
      });
  },
});

export default refundScoreSlice.reducer;
