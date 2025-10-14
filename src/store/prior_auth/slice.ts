import { combineReducers, createSlice } from "@reduxjs/toolkit";
import type { KVPair, PriorAuthorizationRequestDto, SuggestServicesGetByIdResponseDtoResultModel } from "@/services/api-client";
import {
  fetchPriorAuthList,
  createPriorAuth,
  getPriorAuthById,
  updatePriorAuth,
  deletePriorAuth,
  getPriorAuthCreatedByList,
  getPriorAuthModifiedByList,
  getPriorAuthStatusEnum,
  getPriorAuthVisitTypeList,
  getPriorAuthPatientCategoryList,
  getPriorAuthPatientCompanyList,
  getSuggestServicesById,
  exportPriorAuthExcel,
} from "./thanuk";
import { priorAuthDto } from "@/services/api-client/models/PriorAuthorizationRequestDto";
export interface Metadata {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface PriorAuthState {
  list: PriorAuthorizationRequestDto[];
  meta: Metadata;
  loading: boolean;
  error: string | null;
  exportLoading: boolean;
  exportError: string | null;
}

const initialState: PriorAuthState = {
  list: [],
  loading: false,
  error: null,
  exportLoading: false,
  exportError: null,
  meta: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  },
};

const priorAuthSlice = createSlice({
  name: "priorAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Prior Auth List
    builder
      .addCase(fetchPriorAuthList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorAuthList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data?.items || [];
        state.meta = {
          pageNumber: action.payload?.data?.metadata?.page?.currentPage || 1,
          pageSize: action.payload?.data?.metadata?.page?.pageSize || 10,
          totalPages: action.payload?.data?.metadata?.page?.totalPages || 0,
        };
        state.error = null;
      })
      .addCase(fetchPriorAuthList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch prior auth list";
      });
    // Delete Prior Auth
    builder
      .addCase(deletePriorAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePriorAuth.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePriorAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete prior auth request";
      });

    // Get Prior Auth Created By List
    builder
      .addCase(getPriorAuthCreatedByList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPriorAuthCreatedByList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get prior auth created by list";
      });

    // Export Excel
    builder
      .addCase(exportPriorAuthExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportPriorAuthExcel.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportError = null;
      })
      .addCase(exportPriorAuthExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || "Failed to export prior auth to Excel";
      });
  },
});

interface PriorFilterState {
  createdByList: KVPair[];
  modifiedByList: KVPair[];
  statusEnumList: KVPair[];
  visitTypeList: KVPair[];
  patientCategoryList: KVPair[];
  patientCompanyList: KVPair[];
}
interface PriorAuthByIdState {
  data: priorAuthDto | null;
  loading: boolean;
  error: string | null;
}
const initialPriorAuthByIdState: PriorAuthByIdState = {
  data: null,
  loading: false,
  error: null,
};
const priorAuthByIdSlice = createSlice({
  name: "priorAuthById",
  initialState: initialPriorAuthByIdState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPriorAuthById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPriorAuthById.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getPriorAuthById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch prior auth request";
    });
  },
});
interface PriorAuthApiResponse {
  data: {
    priorAuthorizationSavedId: string;
  };
  isError: boolean;
  errorMessage: string;
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
  errorCode: string;
}

interface PriorAuthSaveState {
  data: PriorAuthApiResponse | null;
  error: string | null;
  loading: boolean;
}
interface PriorAuthUpdateState {
  data: PriorAuthApiResponse | null;
  error: string | null;
  loading: boolean;
}

const initialPriorAuthSaveState: PriorAuthSaveState = {
  data: null,
  error: null,
  loading: false,
};
const priorAuthSaveSlice = createSlice({
  name: "priorAuthSave",
  initialState: initialPriorAuthSaveState,
  reducers: {
    resetPriorAuthSave: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPriorAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPriorAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(createPriorAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create prior auth request";
    });
  },
});

const initialPriorAuthUpdateState: PriorAuthUpdateState = {
  data: null,
  error: null,
  loading: false,
};
const priorAuthUpdateSlice = createSlice({
  name: "priorAuthUpdate",
  initialState: initialPriorAuthUpdateState,
  reducers: {
  resetPriorAuthUpdate: (state) => {
    state.data = null;
    state.error = null;
    state.loading = false;
  },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePriorAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePriorAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(updatePriorAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update prior auth request";
    });
  },
 
});

const initialFilterState: PriorFilterState = {
  createdByList: [],
  modifiedByList: [],
  statusEnumList: [],
  visitTypeList: [],
  patientCategoryList: [],
  patientCompanyList: [],
};

const priorFilterSlice = createSlice({
  name: "priorFilter",
  initialState: initialFilterState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPriorAuthCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload;
      })
      .addCase(getPriorAuthModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload;
      })
      .addCase(getPriorAuthStatusEnum.fulfilled, (state, action) => {
        state.statusEnumList = action.payload;
      })
      .addCase(getPriorAuthVisitTypeList.fulfilled, (state, action) => {
        state.visitTypeList = action.payload;
      })
      .addCase(getPriorAuthPatientCategoryList.fulfilled, (state, action) => {
        state.patientCategoryList = action.payload;
      })
      .addCase(getPriorAuthPatientCompanyList.fulfilled, (state, action) => {
        state.patientCompanyList = action.payload;
      });
  },
});

export interface InitialSuggestServicesState {
  suggestServices: SuggestServicesGetByIdResponseDtoResultModel|null;
  loading: boolean;
  error: string | null;
}

const initialSuggestServicesState: InitialSuggestServicesState = {
  suggestServices: null,
  loading: false,
  error: null,
};

export const priorAuthSuggestServicesSlice = createSlice({
  name: "priorAuthSuggestServices",
  initialState: initialSuggestServicesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuggestServicesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuggestServicesById.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestServices = action.payload;
      })
      .addCase(getSuggestServicesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get suggest services by id";
      });
  },
});
export const { resetPriorAuthSave } = priorAuthSaveSlice.actions;
export const { resetPriorAuthUpdate } = priorAuthUpdateSlice.actions;

export const priorAuthReducer = combineReducers({
  priorAuthSave: priorAuthSaveSlice.reducer,
  priorAuthUpdate: priorAuthUpdateSlice.reducer,
  priorAuth: priorAuthSlice.reducer,
  priorFilter: priorFilterSlice.reducer,
  priorAuthSuggestServices: priorAuthSuggestServicesSlice.reducer,
  priorAuthById: priorAuthByIdSlice.reducer,
});
