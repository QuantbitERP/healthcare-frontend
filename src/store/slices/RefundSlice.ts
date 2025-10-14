import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RefundsService } from '../../services/api-client/services/RefundsService';
import { RefundsListDto, RefundsListRequestDto, RefundsListResponseDto } from '../../services/api-client/models/RefundsDto';

// State type
interface RefundState {
  items: RefundsListDto[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: RefundState = {
  items: [],
  totalCount: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching refunds
export const fetchRefunds = createAsyncThunk<RefundsListResponseDto, RefundsListRequestDto>(
  'refunds/fetchRefunds',
  async (params, { rejectWithValue }) => {
    try {
      const response = await RefundsService.postApiV1Refunds(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch refunds');
    }
  }
);

const refundSlice = createSlice({
  name: 'refunds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefunds.fulfilled, (state, action: PayloadAction<RefundsListResponseDto>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch refunds';
      });
  },
});

// Selectors (RootState type must be updated after adding to rootReducer)
// Example: (state: RootState) => state.refunds.refunds

export default refundSlice.reducer;

