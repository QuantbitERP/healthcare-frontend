import { createSlice } from "@reduxjs/toolkit";
import type { ScoreItem } from "./types";
import {
  fetchScoreCard,
  fetchBills,
  fetchDraftOpdBill,
  fetchAllOpdFilters,
  fetchCancelReasons,
  cancelOpdBill,
  cancelDraftOpdBill,
  exportOpdBillsWord,
  fetchBillDetailsById,
  fetchPatientDuesDetails, downloadCasePaperPdf, exportToWord,
  fetchPackages,
  fetchServiceRate,
  fetchOpdBillingClass,
  fetchPatientCategoryList,
  fetchVisitTypeList,
  fetchConsultantDoctors,
  fetchGenderList,
  fetchEstimationTypes,
} from "./thunks";
import { GetBillsResponseDtoListResultModelResultModel } from "@/services/api-client/models/GetBillsResponseDtoListResultModelResultModel";
import { KVPairListResultModelResultModel } from "@/services/api-client/models/KVPairListResultModelResultModel";
import type { CancelBillReasonDTO } from "@/services/api-client/models/CancelBillReasonDTO";
import { CancelBillResponseDtoListResultModelResultModel } from "@/services/api-client/models/CancelBillResponseDtoListResultModelResultModel";
import { CancelDraftBillResponseDtoResultModel } from "@/services/api-client/models/CancelDraftBillResponseDtoResultModel";
import type { GetBillDetailsDTOResultModel } from "@/services/api-client/models/GetBillDetailsDTOResultModel";
import { VisitTypeEnumDtoListResultModelResultModel } from "@/services/api-client/models/VisitTypeEnumDtoListResultModelResultModel";
import type { PackageDto } from "@/services/api-client/models/PackageDto";
import { ServiceRateAndMediclaimResponseResultModel } from "@/services/api-client/models/ServiceRateAndMediclaimResponseResultModel";
import type { GetDraftBillByIdResponseDTOResultModel } from "@/services/api-client/models/GetDraftBillByIdResponseDTOResultModel";
import { KVPairResultModel } from "@/services/api-client";
// Score Card Slice

export interface ScoreCardState {
  data: ScoreItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoreCardState = {
  data: [],
  loading: false,
  error: null,
};

export const scoreCardSlice = createSlice({
  name: "scoreCard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScoreCard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchScoreCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Bills Slice

export interface BillsState {
  data: GetBillsResponseDtoListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialBillsState: BillsState = {
  data: null,
  loading: false,
  error: null,
};

export const billsSlice = createSlice({
  name: "opdBills",
  initialState: initialBillsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface OpdFiltersState {
  statusList: KVPairListResultModelResultModel | null;
  createdByList: KVPairListResultModelResultModel | null;
  patientCategories: KVPairListResultModelResultModel | null;
  schemeCompanies: KVPairListResultModelResultModel | null;
  visitTypes: VisitTypeEnumDtoListResultModelResultModel | null;
  referredDoctors: KVPairListResultModelResultModel | null;
  paymentModes: KVPairListResultModelResultModel | null;
  genderList: Array<{ genderId: number; genderName: string }> | null;
  estimationTypes: KVPairListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialFiltersState: OpdFiltersState = {
  statusList: null,
  createdByList: null,
  patientCategories: null,
  schemeCompanies: null,
  visitTypes: null,
  referredDoctors: null,
  paymentModes: null,
  genderList: null,
  estimationTypes: null,
  loading: false,
  error: null,
};

export const opdFiltersSlice = createSlice({
  name: "opdFilters",
  initialState: initialFiltersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOpdFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOpdFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.statusList = action.payload.statusList;
        state.createdByList = action.payload.createdByList;
        state.patientCategories = action.payload.patientCategories;
        state.schemeCompanies = action.payload.schemeCompanies;
        state.visitTypes = action.payload.visitTypes;
        state.referredDoctors = action.payload.referredDoctors;
        state.paymentModes = action.payload.paymentModes;
      })
      .addCase(fetchAllOpdFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch filters";
      })
      // New thunk handlers
      .addCase(fetchPatientCategoryList.fulfilled, (state, action) => {
        state.patientCategories = action.payload;
      })
      .addCase(fetchVisitTypeList.fulfilled, (state, action) => {
        state.visitTypes = action.payload;
      })
      .addCase(fetchConsultantDoctors.fulfilled, (state, action) => {
        state.referredDoctors = action.payload;
      })
      .addCase(fetchGenderList.fulfilled, (state, action) => {
        state.genderList = action.payload;
      })
      .addCase(fetchEstimationTypes.fulfilled, (state, action) => {
        state.estimationTypes = action.payload;
      });
  },
});

export interface CancelReasonsState {
  cancelReasons: CancelBillReasonDTO[];
  isLoading: boolean;
  error: string | null;
}

const initialCancelState: CancelReasonsState = {
  cancelReasons: [],
  isLoading: false,
  error: null,
};

export const cancelReasonsSlice = createSlice({
  name: "cancelReasons",
  initialState: initialCancelState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCancelReasons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCancelReasons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cancelReasons = action.payload;
      })
      .addCase(fetchCancelReasons.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch cancel reasons";
      });
  },
});

interface OpdBillsState {
  cancelResponse: CancelBillResponseDtoListResultModelResultModel | null;
  isCancelling: boolean;
  cancelError: any;
}

const initialCancelNonDraftBillsState: OpdBillsState = {
  cancelResponse: null,
  isCancelling: false,
  cancelError: null,
};

export const cancelNonDraftOpdBillsSlice = createSlice({
  name: "cancelNonDraftOpdBills",
  initialState: initialCancelNonDraftBillsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cancelOpdBill.pending, (state) => {
        state.isCancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelOpdBill.fulfilled, (state, action) => {
        state.isCancelling = false;
        state.cancelResponse = action.payload;
      })
      .addCase(cancelOpdBill.rejected, (state, action) => {
        state.isCancelling = false;
        state.cancelError = action.payload;
      });
  },
});


interface CancelDraftOpdBillsState {
  cancelDraftResponse: CancelDraftBillResponseDtoResultModel | null;
  isCancellingDraft: boolean;
  cancelDraftError: any;
}

const initialCancelDraftState: CancelDraftOpdBillsState = {
  cancelDraftResponse: null,
  isCancellingDraft: false,
  cancelDraftError: null,
};

export const cancelDraftOpdBillsSlice = createSlice({
  name: "cancelDraftOpdBills",
  initialState: initialCancelDraftState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cancelDraftOpdBill.pending, (state) => {
        state.isCancellingDraft = true;
        state.cancelDraftError = null;
      })
      .addCase(cancelDraftOpdBill.fulfilled, (state, action) => {
        state.isCancellingDraft = false;
        state.cancelDraftResponse = action.payload;
      })
      .addCase(cancelDraftOpdBill.rejected, (state, action) => {
        state.isCancellingDraft = false;
        state.cancelDraftError = action.payload;
      });
  },
});


type ExportState = {
  loading: boolean;
  error: string | null;
  data: Blob | null;
};

const initialExportState: ExportState = {
  loading: false,
  error: null,
  data: null,
};

export const opdExportSlice = createSlice({
  name: "opdExport",
  initialState: initialExportState,
  reducers: {
    resetExportState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportOpdBillsWord.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(exportOpdBillsWord.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(exportOpdBillsWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



interface OpdBillDetailsState {
  data: GetBillDetailsDTOResultModel | null;
  loading: boolean;
  error: any;
}

const initialBillByIdState: OpdBillDetailsState = {
  data: null,
  loading: false,
  error: null,
};

export const opdBillDetailsByIdSlice = createSlice({
  name: "opdBillDetails",
  initialState: initialBillByIdState,
  reducers: {
    clearBillDetails: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBillDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

interface PatientBillingState {
  loading: boolean;
  duesDetails: any[];
  error: string | null;
}

const initialPatientBillingState: PatientBillingState = {
  loading: false,
  duesDetails: [],
  error: null,
};
export const patientBillingSlice = createSlice({
  name: "patientBilling",
  initialState: initialPatientBillingState,
  reducers: {},
  extraReducers: (builder) => {
    // Patient dues details
    builder
      .addCase(fetchPatientDuesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDuesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.duesDetails = action.payload;
      })
      .addCase(fetchPatientDuesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Case paper & Word export (we only set loading flags since they are downloads)
    builder
      .addCase(downloadCasePaperPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadCasePaperPdf.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadCasePaperPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(exportToWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportToWord.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportToWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


interface PackagesState {
  loading: boolean;
  data: Array<PackageDto>;
  error: string | null;
}

const initialPackageState: PackagesState = {
  loading: false,
  data: [],
  error: null,
};


export const packagesSlice = createSlice({
  name: "packages",
  initialState: initialPackageState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface ServiceRateState {
  data: ServiceRateAndMediclaimResponseResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialServiceRateState: ServiceRateState = {
  data: null,
  loading: false,
  error: null,
};

export const opdServiceRateSlice = createSlice({
  name: "opdServiceRate",
  initialState: initialServiceRateState,
  reducers: {
    clearServiceRate(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServiceRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

interface OpdDraftBillState {
  data: GetDraftBillByIdResponseDTOResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialDraftOPdState: OpdDraftBillState = {
  data: null,
  loading: false,
  error: null,
};

export const opdDraftBillSlice = createSlice({
  name: "opdDraftBill",
  initialState: initialDraftOPdState,
  reducers: {
    clearDraftBill(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftOpdBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftOpdBill.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDraftOpdBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



interface OpdBillingState {
  data: KVPairResultModel | null;
  loading: boolean;
  error: string | null;
}

const initialBillingClassState: OpdBillingState = {
  data: null,
  loading: false,
  error: null,
};

export const opdBillingSlice = createSlice({
  name: 'opdBilling',
  initialState: initialBillingClassState,
  reducers: {
    clearOpdBillingState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpdBillingClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpdBillingClass.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOpdBillingClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { clearOpdBillingState } = opdBillingSlice.actions;


export const { clearDraftBill } = opdDraftBillSlice.actions;


export const { clearBillDetails } = opdBillDetailsByIdSlice.actions;
export const { resetExportState } = opdExportSlice.actions;