import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TaxService } from '@/services/api-client/services/TaxService';
import { TaxByIdResponse,} from '@/services/api-client/models/TaxDto';

export const fetchTaxById = createAsyncThunk<
  TaxByIdResponse, // Return type
  string,  // Argument type (taxId)
  { rejectValue: string }
>(
  'taxById/fetchTaxById',
  async (taxId, { rejectWithValue }) => {
    try {
      const response = await TaxService.getApiVTaxById(taxId,"1");
    
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tax by ID');
    }
  }
);

type TaxByIdState = {
  data: TaxByIdResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: TaxByIdState = {
  data: null,
  loading: false,
  error: null,
};

const taxByIdSlice = createSlice({
  name: 'taxById',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTaxById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tax by ID';
      });
  },
});

export default taxByIdSlice.reducer;
export { taxByIdSlice }; 