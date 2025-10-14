import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RefundsService } from '../../services/api-client/services/RefundsService';
import { RefundsDto } from '../../services/api-client/models/RefundsDto';

interface RefundByIdState {
  refund: RefundsDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: RefundByIdState = {
  refund: null,
  loading: false,
  error: null,
};

export const fetchRefundById = createAsyncThunk<RefundsDto, string>(
  'refundById/fetchRefundById',
  async (refundId, { rejectWithValue }) => {
    try {
      const response = await RefundsService.GetRefundById(refundId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch refund details');
    }
  }
);

const refundByIdSlice = createSlice({
  name: 'refundById',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.refund = null;
      })
      .addCase(fetchRefundById.fulfilled, (state, action: PayloadAction<RefundsDto>) => {
        state.loading = false;
        state.refund = action.payload;
      })
      .addCase(fetchRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch refund details';
      });
  },
});

export default refundByIdSlice.reducer; 