import { createSlice } from '@reduxjs/toolkit';
import {
  fetchConcessionGivenBy,
  fetchPaymentModes,
  searchPaymentReceivedByName,
  fetchCountSummary,
  fetchPaymentReceipts,
  postPaymentReceived,
  deletePaymentReceived,
  updatePaymentReceived,
  fetchPaymentTypes,
  fetchCompanyList,
  fetchPatientList,
  fetchPaymentReceivedById,
  fetchVisitTypes,
  fetchCreatedByList,
} from './thunks'; 

import type { ConcessionGivenByDto } from '@/services/api-client/models/ConcessionGivenByDto';
import type { PaymentModeListDto } from '@/services/api-client/models/PaymentModeListDto';
import type { PaymentReceivedDto } from '@/services/api-client/models/PaymentReceivedDto';
import type { PaymentReceivedCountSummeryDto } from '@/services/api-client/models/PaymentReceivedCountSummeryDto';
import type { PaymentTypeListDto } from '@/services/api-client/models/PaymentTypeListDto';
import type { CompanyListDto } from '@/services/api-client/models/CompanyListDto';
import type { PatientListDto } from '@/services/api-client/models/PatientListDto';
import type { PaymentReceivedResponseDtoResultModel } from '@/services/api-client/models/PaymentReceivedResponseDtoResultModel';

interface PaymentReceivedState {
  concessionGivenBy: {
    data: ConcessionGivenByDto | null;
    loading: boolean;
    error: string | null;
  };
  paymentModes: {
    data: PaymentModeListDto | null;
    loading: boolean;
    error: string | null;
  };
  paymentSearchResult: {
    data: PaymentReceivedDto | null;
    loading: boolean;
    error: string | null;
  };
  countSummary: {
    data: PaymentReceivedCountSummeryDto | null;
    loading: boolean;
    error: string | null;
  };
  paymentReceipts: {
    data: any;
    loading: boolean;
    error: string | null;
  };
  postPaymentResult: {
    data: any;
    loading: boolean;
    error: string | null;
  };
  deletePaymentResult: {
    data: any;
    loading: boolean;
    error: string | null;
  };
  updatePaymentResult: {
    data: any;
    loading: boolean;
    error: string | null;
  };
  paymentTypes: {
    data: PaymentTypeListDto[] | null;
    loading: boolean;
    error: string | null;
  };
  companyList: {
    data: CompanyListDto | null;
    loading: boolean;
    error: string | null;
  };
  patientList: {
    data: PatientListDto | null;
    loading: boolean;
    error: string | null;
  };
  paymentReceivedById: {
    data: PaymentReceivedResponseDtoResultModel | null;
    loading: boolean;
    error: string | null;
  };
  visitTypes: {
    data: PaymentModeListDto[] | null;
    loading: boolean;
    error: string | null;
  };
  createdByList: {
    data: PaymentModeListDto[] | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: PaymentReceivedState = {
  concessionGivenBy: { data: null, loading: false, error: null },
  paymentModes: { data: null, loading: false, error: null },
  paymentSearchResult: { data: null, loading: false, error: null },
  countSummary: { data: null, loading: false, error: null },
  paymentReceipts: { data: null, loading: false, error: null },
  postPaymentResult: { data: null, loading: false, error: null },
  deletePaymentResult: { data: null, loading: false, error: null },
  updatePaymentResult: { data: null, loading: false, error: null },
  paymentTypes: { data: null, loading: false, error: null },
  companyList: { data: null, loading: false, error: null },
  patientList: { data: null, loading: false, error: null },
  paymentReceivedById: { data: null, loading: false, error: null },
  visitTypes: { data: null, loading: false, error: null },
  createdByList: { data: null, loading: false, error: null },
};

export const paymentReceivedSlice = createSlice({
  name: 'paymentReceived',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Concession Given By
    builder
      .addCase(fetchConcessionGivenBy.pending, (state) => {
        state.concessionGivenBy.loading = true;
        state.concessionGivenBy.error = null;
      })
      .addCase(fetchConcessionGivenBy.fulfilled, (state, action) => {
        state.concessionGivenBy.loading = false;
        state.concessionGivenBy.data = action.payload;
      })
      .addCase(fetchConcessionGivenBy.rejected, (state, action) => {
        state.concessionGivenBy.loading = false;
        state.concessionGivenBy.error = action.error.message ?? 'Failed to fetch';
      });

    // Payment Modes
    builder
      .addCase(fetchPaymentModes.pending, (state) => {
        state.paymentModes.loading = true;
        state.paymentModes.error = null;
      })
      .addCase(fetchPaymentModes.fulfilled, (state, action) => {
        state.paymentModes.loading = false;
        state.paymentModes.data = action.payload;
      })
      .addCase(fetchPaymentModes.rejected, (state, action) => {
        state.paymentModes.loading = false;
        state.paymentModes.error = action.error.message ?? 'Failed to fetch';
      });

    // Payment Search
    builder
      .addCase(searchPaymentReceivedByName.pending, (state) => {
        state.paymentSearchResult.loading = true;
        state.paymentSearchResult.error = null;
      })
      .addCase(searchPaymentReceivedByName.fulfilled, (state, action) => {
        state.paymentSearchResult.loading = false;
        state.paymentSearchResult.data = action.payload;
      })
      .addCase(searchPaymentReceivedByName.rejected, (state, action) => {
        state.paymentSearchResult.loading = false;
        state.paymentSearchResult.error = action.error.message ?? 'Failed to search';
      });

    // Count Summary
    builder
      .addCase(fetchCountSummary.pending, (state) => {
        state.countSummary.loading = true;
        state.countSummary.error = null;
      })
      .addCase(fetchCountSummary.fulfilled, (state, action) => {
        state.countSummary.loading = false;
        state.countSummary.data = action.payload;
      })
      .addCase(fetchCountSummary.rejected, (state, action) => {
        state.countSummary.loading = false;
        state.countSummary.error = action.error.message ?? 'Failed to fetch';
      });

    // Payment Receipts
    builder
      .addCase(fetchPaymentReceipts.pending, (state) => {
        state.paymentReceipts.loading = true;
        state.paymentReceipts.error = null;
      })
      .addCase(fetchPaymentReceipts.fulfilled, (state, action) => {
        state.paymentReceipts.loading = false;
        state.paymentReceipts.data = action.payload;
      })
      .addCase(fetchPaymentReceipts.rejected, (state, action) => {
        state.paymentReceipts.loading = false;
        state.paymentReceipts.error = action.error.message ?? 'Failed to fetch';
      });

    // Post Payment
    builder
      .addCase(postPaymentReceived.pending, (state) => {
        state.postPaymentResult.loading = true;
        state.postPaymentResult.error = null;
      })
      .addCase(postPaymentReceived.fulfilled, (state, action) => {
        state.postPaymentResult.loading = false;
        state.postPaymentResult.data = action.payload;
      })
      .addCase(postPaymentReceived.rejected, (state, action) => {
        state.postPaymentResult.loading = false;
        state.postPaymentResult.error = action.error.message ?? 'Failed to post';
      });

    // Delete Payment
    builder
      .addCase(deletePaymentReceived.pending, (state) => {
        state.deletePaymentResult.loading = true;
        state.deletePaymentResult.error = null;
      })
      .addCase(deletePaymentReceived.fulfilled, (state, action) => {
        state.deletePaymentResult.loading = false;
        state.deletePaymentResult.data = action.payload;
      })
      .addCase(deletePaymentReceived.rejected, (state, action) => {
        state.deletePaymentResult.loading = false;
        state.deletePaymentResult.error = action.error.message ?? 'Failed to delete';
      });

    // Update Payment
    builder
      .addCase(updatePaymentReceived.pending, (state) => {
        state.updatePaymentResult.loading = true;
        state.updatePaymentResult.error = null;
      })
      .addCase(updatePaymentReceived.fulfilled, (state, action) => {
        state.updatePaymentResult.loading = false;
        state.updatePaymentResult.data = action.payload;
      })
      .addCase(updatePaymentReceived.rejected, (state, action) => {
        state.updatePaymentResult.loading = false;
        state.updatePaymentResult.error = action.error.message ?? 'Failed to update';
      });

    // Payment Types
    builder
      .addCase(fetchPaymentTypes.pending, (state) => {
        state.paymentTypes.loading = true;
        state.paymentTypes.error = null;
      })
      .addCase(fetchPaymentTypes.fulfilled, (state, action) => {
        state.paymentTypes.loading = false;
        state.paymentTypes.data = action.payload;
      })
      .addCase(fetchPaymentTypes.rejected, (state, action) => {
        state.paymentTypes.loading = false;
        state.paymentTypes.error = action.error.message ?? 'Failed to fetch';
      });

    // Company List
    builder
      .addCase(fetchCompanyList.pending, (state) => {
        state.companyList.loading = true;
        state.companyList.error = null;
      })
      .addCase(fetchCompanyList.fulfilled, (state, action) => {
        state.companyList.loading = false;
        state.companyList.data = action.payload;
      })
      .addCase(fetchCompanyList.rejected, (state, action) => {
        state.companyList.loading = false;
        state.companyList.error = action.error.message ?? 'Failed to fetch';
      });

    // Patient List
    builder
      .addCase(fetchPatientList.pending, (state) => {
        state.patientList.loading = true;
        state.patientList.error = null;
      })
      .addCase(fetchPatientList.fulfilled, (state, action) => {
        state.patientList.loading = false;
        state.patientList.data = action.payload;
      })
      .addCase(fetchPatientList.rejected, (state, action) => {
        state.patientList.loading = false;
        state.patientList.error = action.error.message ?? 'Failed to fetch';
      });

    // Payment Received By Id
    builder
      .addCase(fetchPaymentReceivedById.pending, (state) => {
        state.paymentReceivedById.loading = true;
        state.paymentReceivedById.error = null;
      })
      .addCase(fetchPaymentReceivedById.fulfilled, (state, action) => {
        state.paymentReceivedById.loading = false;
        state.paymentReceivedById.data = action.payload;
      })
      .addCase(fetchPaymentReceivedById.rejected, (state, action) => {
        state.paymentReceivedById.loading = false;
        state.paymentReceivedById.error = action.error.message ?? 'Failed to fetch';
      });

    // Visit Types
    builder
      .addCase(fetchVisitTypes.pending, (state) => {
        state.visitTypes.loading = true;
        state.visitTypes.error = null;
      })
      .addCase(fetchVisitTypes.fulfilled, (state, action) => {
        state.visitTypes.loading = false;
        state.visitTypes.data = action.payload;
      })
      .addCase(fetchVisitTypes.rejected, (state, action) => {
        state.visitTypes.loading = false;
        state.visitTypes.error = action.error.message ?? 'Failed to fetch';
      });

    // Created By List
    builder
      .addCase(fetchCreatedByList.pending, (state) => {
        state.createdByList.loading = true;
        state.createdByList.error = null;
      })
      .addCase(fetchCreatedByList.fulfilled, (state, action) => {
        state.createdByList.loading = false;
        state.createdByList.data = action.payload;
      })
      .addCase(fetchCreatedByList.rejected, (state, action) => {
        state.createdByList.loading = false;
        state.createdByList.error = action.error.message ?? 'Failed to fetch';
      });
  },
});

