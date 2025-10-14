import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ModeOfPaymentService } from '@/services/api-client/services/ModeOfPaymentService';
import { ModeOfPaymentListRequestDto, ModeOfPaymentListResponseDtoResultModel } from '@/services/api-client';
import { t } from '@/utils/languages';

interface ModeOfPaymentState {
  totalCount: number;
  item: any | null;
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ModeOfPaymentState = {
  totalCount: 0,
  item: null,
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

export const fetchModeOfPayments = createAsyncThunk<ModeOfPaymentListResponseDtoResultModel, ModeOfPaymentListRequestDto>(
  'modeOfPayment/fetchModeOfPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ModeOfPaymentService.postApiVModeOfPaymentModeOfPaymentTypeByFilterWithSearch('v1', '', params);
     
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || t("error.modeOfPaymentFetchFailed"));
    }
  }
);

export const fetchModeOfPaymentById = createAsyncThunk(
  'modeOfPayment/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ModeOfPaymentService.getApiVModeOfPayment(id, "1", "");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteModeOfPayments = createAsyncThunk(
  'modeOfPayment/deleteModeOfPayments',
  async (ids: string[], { rejectWithValue }) => {
    try {
      return await ModeOfPaymentService.deleteApiVModeOfPayment("1", "", ids);
    } catch (error: any) {
      return rejectWithValue(error.message || t("error.modeOfPaymentDeleteFailed"));
    }
  }
);

const modeOfPaymentSlice = createSlice({
  name: 'modeOfPayment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModeOfPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeOfPayments.fulfilled, (state, action: PayloadAction<ModeOfPaymentListResponseDtoResultModel>) => {
        state.loading = false;
        state.item = action.payload.data || null;
      })
      .addCase(fetchModeOfPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || t("error.modeOfPaymentFetchFailed");
      })
      .addCase(deleteModeOfPayments.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteModeOfPayments.fulfilled, (state, _action) => {
        state.deleteLoading = false;
        state.deleteError = null;
      })
      .addCase(deleteModeOfPayments.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string || t("error.modeOfPaymentDeleteFailed");
      });
  },
});

const modeOfPaymentByIdSlice = createSlice({
  name: 'modeOfPaymentById',
  initialState: {
    data: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModeOfPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchModeOfPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchModeOfPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || t("error.modeOfPaymentFetchFailed");
      });
  },
});

export const modeOfPaymentSliceReducer = modeOfPaymentSlice.reducer; 
export const modeOfPaymentByIdSliceReducer = modeOfPaymentByIdSlice.reducer;