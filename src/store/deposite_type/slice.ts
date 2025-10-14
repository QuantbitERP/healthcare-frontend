// src/store/slices/depositTypeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { DepositTypeListResponseDto, DepositTypeByIdDto } from "@/api-client";
import {
  fetchDepositTypes,
  fetchDepositTypeById,
  createDepositType,
  updateDepositType,
  deleteDepositTypes,
  fetchDepositTypeCreatedByList,
  fetchDepositTypeModifiedByList,
  fetchDepositTypeStatus,
  fetchDepositTypeApplicableForList,
} from "./thunk";
import { CommonResponseDto } from "@/services/api-client/models/RateListDto";
import { MetaData } from "@/services/api-client/models/RoomCategoriesWithSearchAndFilterResponseDtoResultModel";

interface DepositTypeState {
  list: DepositTypeListResponseDto[];
  metaData: MetaData;
  selected?: DepositTypeByIdDto | null;
  createdByList: CommonResponseDto;
  modifiedByList: CommonResponseDto;
  statusList:CommonResponseDto;
  applicableForList:CommonResponseDto;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

const initialState: DepositTypeState = {
  list: [],
  metaData: {},
  selected: null,
  createdByList:{
    data:{
      items:[]
    },
    isError: false,
    errorMessage: "",
    validationErrors: "",
    errorCode: "",
  },
  modifiedByList: {
    data:{
      items:[]
    },
    isError: false,
    errorMessage: "",
    validationErrors: "",
    errorCode: "",
  },
  statusList:{
    data:{
      items:[]
    },
    isError: false,
    errorMessage: "",
    validationErrors: "",
    errorCode: "",
  },
  loading: false,
  error: null,
  applicableForList: {
  data:{
    items:[]
  },
  isError: false,
  errorMessage: "",
  validationErrors: "",
  errorCode: "",
  },
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

export const depositTypeSlice = createSlice({
  name: "depositType",
  initialState,
  reducers: {
    resetDepositTypeFlags(state) {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ FETCH LIST
      .addCase(fetchDepositTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepositTypes.fulfilled, (state, action) => {
        state.loading = false;
        const dataList = action.payload as any;
        state.list = dataList?.data?.items || [];
        state.metaData = dataList?.data?.metadata || {};
      })
      .addCase(fetchDepositTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ FETCH SINGLE BY ID
      .addCase(fetchDepositTypeById.fulfilled, (state, action) => {
        state.selected = action.payload?.data;
      })

      // ✅ CREATE
      .addCase(createDepositType.fulfilled, (state, action) => {
        if(action.payload?.isError ){  
          state.error = action.payload.errorMessage as string;
          state.createSuccess = false;   
          return;
        }
        else{
          state.createSuccess = true;
          state.error = null;
        }
      })
      .addCase(createDepositType.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ✅ UPDATE
      .addCase(updateDepositType.fulfilled, (state) => {
        state.updateSuccess = true;
      })
      .addCase(updateDepositType.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ✅ DELETE
      .addCase(deleteDepositTypes.fulfilled, (state) => {
        state.deleteSuccess = true;
      })
      .addCase(deleteDepositTypes.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ✅ CREATED BY LIST
      .addCase(fetchDepositTypeCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload || [];
      })

      // ✅ MODIFIED BY LIST
      .addCase(fetchDepositTypeModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload || [];
      })

      // ✅ STATUS LIST
      .addCase(fetchDepositTypeStatus.fulfilled, (state, action) => {
        state.statusList = action.payload || {
          data:{
            items:[]
          },
          isError: false,
          errorMessage: "",
          validationErrors: "",
          errorCode: "",
        };
      })

      // ✅ APPLICABLE FOR LIST
      .addCase(fetchDepositTypeApplicableForList.fulfilled, (state, action) => {
        state.applicableForList = action.payload || {
          data:{
            items:[]
          },
          isError: false,
          errorMessage: "",
          validationErrors: "",
          errorCode: "",
        };
      })
      .addCase(fetchDepositTypeApplicableForList.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetDepositTypeFlags } = depositTypeSlice.actions;
export default depositTypeSlice;
