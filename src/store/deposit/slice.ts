import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDepositBankList,
  fetchDepositCreatedBy,
  deleteDeposit,
  updateDeposit,
  fetchDepositModifiedBy,
  fetchDepositList,
  createDeposit,
  fetchDepositDetails,
  fetchDepositBlockingType,
  fetchDepositFilterData,
  fetchDepositTypes,
  fetchDepositConversionLog,
  fetchPaymentMode,
  fetchPatientDepositInfo,
  fetchPatientDeposits,
  fetchDepositTypesNew,
  fetchDepositBlockingTypeNew,
} from "./thunk";
import { KVPairListResultModel } from "@/api-client";

interface DepositState {
  list: any[];
  totalCount: number;
  details: any | null;
  bankList: any[];
  createdByOptions: any[];
  modifiedByOptions: any[];
  blockingTypeOptions: any[];
  depositTypes: any;
  loading: boolean;
  error: string | null;
  createdByList: any | never[] | KVPairListResultModel;
  modifiedByList: any | KVPairListResultModel;
  depositBlockingTypes: any | never[] | KVPairListResultModel;
  conversionLog: any;
  paymentModes: any[];
  patientDepositInfo: any;
  patientDeposits: any[];
  depositTypesNew: any[];
  depositBlockingTypesNew: any[];
  paginationMeta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

const initialState: DepositState = {
  list: [],
  totalCount: 0,
  details: null,
  bankList: [],
  createdByOptions: [],
  modifiedByOptions: [],
  blockingTypeOptions: [],
  depositTypes: [],
  loading: false,
  error: null,
  createdByList: [],
  modifiedByList: [],
  depositBlockingTypes: [],
  conversionLog: [],
  paymentModes: [],
  patientDepositInfo: null,
  patientDeposits: [],
  depositTypesNew: [],
  depositBlockingTypesNew: [],
  paginationMeta: {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 10,
  },
};

export const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    clearDepositDetails: (state) => {
      state.details = null;
    },
    clearDepositList: (state) => {
      state.list = [];
      state.totalCount = 0;
      state.paginationMeta = {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepositList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchDepositList.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.list = action.payload?.data?.items || [];
        state.totalCount = action.payload?.data?.totalCount || action.payload?.data?.items?.length || 0;
        
        // Set pagination metadata
        state.paginationMeta = {
          current_page: action.payload?.data?.metadata?.page?.currentPage || action.payload?.data?.currentPage || 1,
          total_pages: action.payload?.data?.metadata?.page?.totalPages || action.payload?.data?.totalPages || 1,
          total_count: action.payload?.data?.totalCount || action.payload?.data?.items?.length || 0,
          per_page: action.payload?.data?.metadata?.page?.pageSize || action.payload?.data?.pageSize || 10,
        };
      }
    );
    builder.addCase(fetchDepositList.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchDepositDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchDepositDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
      
        state.details = action.payload;
      }
    );
    builder.addCase(fetchDepositDetails.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(
      fetchDepositBankList.fulfilled,
      (state, action: PayloadAction<any>) => {
       
        state.bankList = action.payload || [];
        
      }
    );

    builder.addCase(
      fetchPatientDepositInfo.fulfilled,
      (state, action: PayloadAction<any>) => {
       
        state.patientDepositInfo = action.payload;
      }
    );

    builder.addCase(
      fetchDepositTypes.fulfilled,
      (state, action: PayloadAction<any>) => {
      
        const depositTypesData = action.payload?.data?.items || action.payload?.data;
        state.depositTypes = Array.isArray(depositTypesData) ? depositTypesData : [];
      }
    );

    builder.addCase(
      fetchDepositCreatedBy.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.createdByOptions = action.payload?.data || [];
      }
    );

    builder.addCase(
      fetchDepositModifiedBy.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.modifiedByOptions = action.payload?.data || [];
      }
    );

    builder.addCase(
      fetchDepositBlockingType.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.blockingTypeOptions = action.payload?.data.items || [];
      }
    );

    builder.addCase(
      fetchDepositTypesNew.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        
        // Try different data extraction patterns based on your API structure
        state.depositTypesNew = action.payload?.data?.items || action.payload?.data || action.payload?.items || [];
      }
    );

    builder.addCase(
      fetchDepositBlockingTypeNew.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        // Try different data extraction patterns based on your API structure
        state.depositBlockingTypesNew = action.payload?.data?.items || action.payload?.data || action.payload?.items || [];
      }
    );

    builder.addCase(createDeposit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDeposit.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createDeposit.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateDeposit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDeposit.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateDeposit.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteDeposit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDeposit.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteDeposit.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchDepositFilterData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDepositFilterData.fulfilled, (state, action) => {
      state.loading = false;
      
      
      state.createdByList = action.payload.createdByList;
      state.modifiedByList = action.payload.modifiedByList;
      state.depositTypes = action.payload.depositTypes;
      state.depositBlockingTypes = action.payload.depositBlockingTypes;
      
      
      
      
    });
    builder.addCase(fetchDepositFilterData.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchDepositConversionLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDepositConversionLog.fulfilled, (state, action) => {
    
      state.conversionLog = action.payload?.data || [];
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchDepositConversionLog.rejected, (state, action) => {
      state.conversionLog = [];
      state.loading = false;
      state.error = action.payload as string | null;
    });
    builder.addCase(fetchPaymentMode.fulfilled, (state, action) => {
      state.paymentModes = action.payload?.data?.items || [];
    });
    
    builder.addCase(fetchPatientDeposits.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPatientDeposits.fulfilled, (state, action) => {
      state.loading = false;
      state.patientDeposits = action.payload?.data?.items || [];
      state.error = null;
    });
    builder.addCase(fetchPatientDeposits.rejected, (state, action) => {
      state.loading = false;
      state.patientDeposits = [];
      state.error = action.payload as string | null;
    });
    
  },
});

export const { clearDepositDetails, clearDepositList } = depositSlice.actions;
export default depositSlice;
