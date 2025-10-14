// src/store/slices/associateSchemeCompanySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCreatedBy,
  fetchModifiedBy,
  fetchStatusList,
  fetchAssociateCompanies,
  fetchAssociateCompanyList,
  createAssociateSchemeCompany,
  updateAssociateSchemeCompany,
  deleteAssociateSchemeCompany,
  fetchAssociateCompanyById,
} from './thunk';

import {
  KVPairListResultModelResultModel,
  AssociateCompanyListResponseDtoListResultModelResultModel,
  KVPairListResultModel,
  AssociateCompanyByIdDtoResultModel,
} from '@/api-client';

// ✅ Define our slice state
export interface AssociateSchemeCompanyState {
  list:  AssociateCompanyListResponseDtoListResultModelResultModel   ; 
  createdBy: never[] | KVPairListResultModel | any[] ;
  modifiedBy: KVPairListResultModel | never[] | any[];
  statusList: KVPairListResultModel | never[] | any[];
  associateCompanies: KVPairListResultModel | never[] | any[];
  fetchAssociateCompany: AssociateCompanyByIdDtoResultModel | never;
  loading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: AssociateSchemeCompanyState = {
  fetchAssociateCompany:{

  },
  list: {
    data: {
      items: [],
      metadata: {
        page: {
          currentPage: 1,
          pageSize: 1,
          totalPages: 1,
        },
      },
    },
  
  },
 
  createdBy: [],
  modifiedBy: [],
  statusList: [],
  associateCompanies: [],
  loading: false,
  error: null,
};

const associateSchemeCompanySlice = createSlice({
  name: 'associateSchemeCompany',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Fetch list
    builder.addCase(fetchAssociateCompanyList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAssociateCompanyList.fulfilled,
      (
        state,
        action: PayloadAction<AssociateCompanyListResponseDtoListResultModelResultModel>
      ) => {
        state.loading = false;
        state.list = action.payload ?? [];
      }
    );
    builder.addCase(fetchAssociateCompanyList.rejected, (state, action) => {
      state.loading = false;
      state.error = String(action.payload || 'Failed to fetch list');
    });

    // ✅ Created By
    builder.addCase(
      fetchCreatedBy.fulfilled,
      (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
        state.createdBy = action.payload?.data?.items ?? [];
      }
    );

    // ✅ Modified By
    builder.addCase(
      fetchModifiedBy.fulfilled,
      (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
        state.modifiedBy = action.payload?.data?.items ?? [];
      }
    );

    // ✅ Status List
    builder.addCase(
      fetchStatusList.fulfilled,
      (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
        state.statusList = action.payload?.data?.items ?? [];
      }
    );

    // ✅ Associate Companies
    builder.addCase(
      fetchAssociateCompanies.fulfilled,
      (state, action: PayloadAction<KVPairListResultModelResultModel>) => {
        state.associateCompanies = action.payload?.data?.items ?? [];
      }
    );

    // ✅ Create
    builder.addCase(
      createAssociateSchemeCompany.fulfilled,
      (state, ) => {
        state.loading = false
      }
    );

    // ✅ Update
    builder.addCase(
      updateAssociateSchemeCompany.fulfilled,
      (state, ) => {
        state.loading = false
        // const updated = action.payload?.data as any;
        // if (updated?.id) {
        //   state.list = state.list.map((item: any) =>
        //     item.id === updated.id ? updated : item
        //   );
        // }
      }
    );

    // ✅ Delete
    builder.addCase(
      deleteAssociateSchemeCompany.fulfilled,
      (state, ) => {
        state.loading = false
        // const deletedIds = action.payload?.data?.map((item: any) => item.id) ?? [];
        // state.list = state.list.filter((item: any) => !deletedIds.includes(item.id));
      }
    );

    // ✅ Fetch by Id
    builder.addCase(fetchAssociateCompanyById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAssociateCompanyById.fulfilled,
      (state, action: PayloadAction<AssociateCompanyByIdDtoResultModel>) => {
        state.fetchAssociateCompany = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(fetchAssociateCompanyById.rejected, (state, action) => {
      state.loading = false;
      state.error = String(action.payload || 'Failed to fetch by id');
    });
  },
});

export default associateSchemeCompanySlice;
