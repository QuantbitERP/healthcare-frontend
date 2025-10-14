import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoicingFiltersState {
  searchTerm: string;
  billStatus: string[];
  billType: string[];
  company: string[];
  associateCompany: string[];
  meMode: boolean;
  startDate?: string;
  endDate?: string;
  priorAuthDoneBy?: string;
  billFinalizedBy?: string;
  isCoverLetterAvailable?: boolean;
  pageNumber: number;
  pageSize: number;
}

const initialState: InvoicingFiltersState = {
  searchTerm: '',
  billStatus: [],
  billType: [],
  company: [],
  associateCompany: [],
  meMode: false,
  startDate: undefined,
  endDate: undefined,
  priorAuthDoneBy: undefined,
  billFinalizedBy: undefined,
  isCoverLetterAvailable: true,
  pageNumber: 1,
  pageSize: 100,
};

const invoicingFiltersSlice = createSlice({
  name: 'invoicingFilters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<InvoicingFiltersState>>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setMeMode: (state, action: PayloadAction<boolean>) => {
      state.meMode = action.payload;
      if (action.payload) {
        state.priorAuthDoneBy = 'Me';
        state.billFinalizedBy = 'Me';
      } else {
        state.priorAuthDoneBy = undefined;
        state.billFinalizedBy = undefined;
      }
    },
    setDateRange: (state, action: PayloadAction<{ startDate?: string; endDate?: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setFilters, resetFilters, setSearchTerm, setMeMode, setDateRange } = invoicingFiltersSlice.actions;
export default invoicingFiltersSlice.reducer;
