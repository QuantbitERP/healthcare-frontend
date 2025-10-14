import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRateTypes,
  fetchRateNames,
  fetchApplicableFrom,
  fetchBillingClasses,
  fetchRateListStatus,
  fetchServiceGroups,
  fetchHospitals,
  fetchDepartments,
  fetchRateListSummary,
  fetchRateListById,
  fetchRateList,
  saveRateList,
  updateRateList,
  deleteRateList,
  uploadRateListExcel,
  downloadRateListPdf,
} from "./thunks";
import { RateListDto } from "@/services/api-client";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

type ListDto = RateListDto[];

interface RateListState {
  rateTypes: AsyncState<any[]>;
  rateNames: AsyncState<any[]>;
  applicableFrom: AsyncState<any[]>;
  billingClasses: AsyncState<any[]>;
  rateListStatus: AsyncState<any[]>;
  serviceGroups: AsyncState<any[]>;
  hospitals: AsyncState<any[]>;
  departments: AsyncState<any[]>;
  summary: AsyncState<ListDto>;
  rateListById: AsyncState<RateListDto | null>;
  rateList: AsyncState<ListDto>;
  save: AsyncState<any>;
  update: AsyncState<any>;
  delete: AsyncState<any>;
  upload: AsyncState<any>;
  download: AsyncState<boolean>;
}

const initialAsyncState = <T>(defaultData: T): AsyncState<T> => ({
  data: defaultData,
  loading: false,
  error: null,
});

const initialState: RateListState = {
  rateTypes: initialAsyncState([]),
  rateNames: initialAsyncState([]),
  applicableFrom: initialAsyncState([]),
  billingClasses: initialAsyncState([]),
  rateListStatus: initialAsyncState([]),
  serviceGroups: initialAsyncState([]),
  hospitals: initialAsyncState([]),
  departments: initialAsyncState([]),
  summary: initialAsyncState([]),
  rateListById: initialAsyncState(null),
  rateList: initialAsyncState([]),
  save: initialAsyncState(null),
  update: initialAsyncState(null),
  delete: initialAsyncState(null),
  upload: initialAsyncState(null),
  download: initialAsyncState(false),
};

export const rateSlice = createSlice({
  name: "rateList",
  initialState,
  reducers: {
    resetRateListState: () => initialState,
  },
  extraReducers: (builder) => {
    const handlePending = (stateSlice: AsyncState<any>) => {
      stateSlice.loading = true;
      stateSlice.error = null;
    };

    const handleFulfilled = (stateSlice: AsyncState<any>, payload: any) => {
      stateSlice.loading = false;
      stateSlice.data = payload;
    };

    const handleRejected = (stateSlice: AsyncState<any>, error: any) => {
      stateSlice.loading = false;
      stateSlice.error = error?.message || "Unknown error";
    };

    builder
      .addCase(fetchRateTypes.pending, (state) =>
        handlePending(state.rateTypes)
      )
      .addCase(fetchRateTypes.fulfilled, (state, { payload }) =>
        handleFulfilled(state.rateTypes, payload)
      )
      .addCase(fetchRateTypes.rejected, (state, { error }) =>
        handleRejected(state.rateTypes, error)
      )

      .addCase(fetchRateNames.pending, (state) =>
        handlePending(state.rateNames)
      )
      .addCase(fetchRateNames.fulfilled, (state, { payload }) =>
        handleFulfilled(state.rateNames, payload)
      )
      .addCase(fetchRateNames.rejected, (state, { error }) =>
        handleRejected(state.rateNames, error)
      )

      .addCase(fetchApplicableFrom.pending, (state) =>
        handlePending(state.applicableFrom)
      )
      .addCase(fetchApplicableFrom.fulfilled, (state, { payload }) =>
        handleFulfilled(state.applicableFrom, payload)
      )
      .addCase(fetchApplicableFrom.rejected, (state, { error }) =>
        handleRejected(state.applicableFrom, error)
      )

      .addCase(fetchBillingClasses.pending, (state) =>
        handlePending(state.billingClasses)
      )
      .addCase(fetchBillingClasses.fulfilled, (state, { payload }) =>
        handleFulfilled(state.billingClasses, payload)
      )
      .addCase(fetchBillingClasses.rejected, (state, { error }) =>
        handleRejected(state.billingClasses, error)
      )

      .addCase(fetchRateListStatus.pending, (state) =>
        handlePending(state.rateListStatus)
      )
      .addCase(fetchRateListStatus.fulfilled, (state, { payload }) =>
        handleFulfilled(state.rateListStatus, payload)
      )
      .addCase(fetchRateListStatus.rejected, (state, { error }) =>
        handleRejected(state.rateListStatus, error)
      )

      .addCase(fetchServiceGroups.pending, (state) =>
        handlePending(state.serviceGroups)
      )
      .addCase(fetchServiceGroups.fulfilled, (state, { payload }) =>
        handleFulfilled(state.serviceGroups, payload)
      )
      .addCase(fetchServiceGroups.rejected, (state, { error }) =>
        handleRejected(state.serviceGroups, error)
      )

      .addCase(fetchHospitals.pending, (state) =>
        handlePending(state.hospitals)
      )
      .addCase(fetchHospitals.fulfilled, (state, { payload }) =>
        handleFulfilled(state.hospitals, payload)
      )
      .addCase(fetchHospitals.rejected, (state, { error }) =>
        handleRejected(state.hospitals, error)
      )

      .addCase(fetchDepartments.pending, (state) =>
        handlePending(state.departments)
      )
      .addCase(fetchDepartments.fulfilled, (state, { payload }) =>
        handleFulfilled(state.departments, payload)
      )
      .addCase(fetchDepartments.rejected, (state, { error }) =>
        handleRejected(state.departments, error)
      )

      .addCase(fetchRateListSummary.pending, (state) =>
        handlePending(state.summary)
      )
      .addCase(fetchRateListSummary.fulfilled, (state, { payload }) =>
        handleFulfilled(state.summary, payload)
      )
      .addCase(fetchRateListSummary.rejected, (state, { error }) =>
        handleRejected(state.summary, error)
      )

      .addCase(fetchRateListById.pending, (state) =>
        handlePending(state.rateListById)
      )
      .addCase(fetchRateListById.fulfilled, (state, { payload }) =>
        handleFulfilled(state.rateListById, payload)
      )
      .addCase(fetchRateListById.rejected, (state, { error }) =>
        handleRejected(state.rateListById, error)
      )

      .addCase(fetchRateList.pending, (state) => handlePending(state.rateList))
      .addCase(fetchRateList.fulfilled, (state, { payload }) =>
        handleFulfilled(state.rateList, payload)
      )
      .addCase(fetchRateList.rejected, (state, { error }) =>
        handleRejected(state.rateList, error)
      )

      .addCase(saveRateList.pending, (state) => handlePending(state.save))
      .addCase(saveRateList.fulfilled, (state, { payload }) =>
        handleFulfilled(state.save, payload)
      )
      .addCase(saveRateList.rejected, (state, { error }) =>
        handleRejected(state.save, error)
      )

      .addCase(updateRateList.pending, (state) => handlePending(state.update))
      .addCase(updateRateList.fulfilled, (state, { payload }) =>
        handleFulfilled(state.update, payload)
      )
      .addCase(updateRateList.rejected, (state, { error }) =>
        handleRejected(state.update, error)
      )

      
      .addCase(deleteRateList.pending, (state) => handlePending(state.delete))
      .addCase(deleteRateList.fulfilled, (state, { payload }) =>
        handleFulfilled(state.delete, payload)
      )
      .addCase(deleteRateList.rejected, (state, { error }) =>
        handleRejected(state.delete, error)
      )

      
      .addCase(uploadRateListExcel.pending, (state) =>
        handlePending(state.upload)
      )
      .addCase(uploadRateListExcel.fulfilled, (state, { payload }) =>
        handleFulfilled(state.upload, payload)
      )
      .addCase(uploadRateListExcel.rejected, (state, { error }) =>
        handleRejected(state.upload, error)
      )

     
      .addCase(downloadRateListPdf.pending, (state) =>
        handlePending(state.download)
      )
      .addCase(downloadRateListPdf.fulfilled, (state, { payload }) =>
        handleFulfilled(state.download, payload)
      )
      .addCase(downloadRateListPdf.rejected, (state, { error }) =>
        handleRejected(state.download, error)
      );
  },
});

export const { resetRateListState } = rateSlice.actions;
