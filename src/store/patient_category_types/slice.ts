// slices.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPatientCategoryTypes,
  createPatientCategoryType,
  updatePatientCategoryType,
  deletePatientCategoryType,
  fetchCreatedByList,
  fetchModifiedByList,
  fetchPatientCategoryTypeWithFilter,
  fetchAllPatientTypeFilters,
  fetchPatientCategoryTypeById,
} from "./thunk";
import { KVPair } from "@/api-client";

interface MetaData {
  page:{
  currentPage: number;
  totalPages: number;
  sortId: string;
  sortType: "asc" | "desc";
  pageSize: number;
  }
}
interface PatientCategoryTypeState {
  list: {
    data:{items:any[]},
  };
  meta?: MetaData;
  createdByList: KVPair[];
  patientTypes: KVPair[];
  modifiedByList: KVPair[];
  filteredList: any | null;
  selectedItem: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientCategoryTypeState = {
  list: {
    data: {
      items: [],
    },
  },
  createdByList: [],
  patientTypes: [],
  modifiedByList: [],
  filteredList: null,
  selectedItem: null,
  loading: false,
  error: null,
  meta: {
    page:{ currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    sortId: "modifiedOn",
    sortType: "asc",
    }
  },
};

const patientCategoryTypeSlice = createSlice({
  name: "patientCategoryType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPatientCategoryTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientCategoryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.items = action.payload.data.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPatientCategoryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching data";
      })

      // Create
      .addCase(createPatientCategoryType.fulfilled, (state, action) => {
        state.list.data.items.push(action.payload);
      })

      // Update
      .addCase(updatePatientCategoryType.fulfilled, (state, action) => {
        const index = state.list.data.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Delete
      .addCase(deletePatientCategoryType.fulfilled, (state, action) => {
        state.list.data.items = state.list.data.items.filter(
          (item) => !action.meta.arg.ids.includes(item.id)
        );
      })

      // Created By List
      .addCase(fetchCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload?.data?.items;
      })

      // Modified By List
      .addCase(fetchModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload?.data?.items;
      })

      // Filtered
      .addCase(fetchPatientCategoryTypeWithFilter.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPatientCategoryTypeWithFilter.fulfilled,
        (state, action) => {
          state.filteredList = action.payload;
          state.loading = false;
           state.meta = {
             page: {
              pageSize: action.payload?.data?.metadata?.page?.pageSize ?? 10,
              currentPage: action.payload?.data?.metadata?.page?.currentPage ?? 1,
              totalPages: action.payload?.data?.metadata?.page?.totalPages ?? 1,
             sortId: "modifiedOn",
             sortType: "asc",
             }
           };
        }
      )

      .addCase(fetchAllPatientTypeFilters.fulfilled, (state, action) => {
        const { patientTypes, createdByList, modifiedByList } = action.payload;
        state.patientTypes = patientTypes?.data?.items;
        state.createdByList = createdByList?.data?.items;
        state.modifiedByList = modifiedByList?.data?.items;

        state.loading = false;
      })
      .addCase(fetchAllPatientTypeFilters.rejected, (state, action) => {
        state.filteredList = action.payload;
      })

      // Fetch By ID
      .addCase(fetchPatientCategoryTypeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientCategoryTypeById.fulfilled, (state, action) => {
        state.loading = false;
        // Extract data from the response wrapper
        const fetchedData = action.payload?.data || action.payload;
        state.selectedItem = fetchedData;
      })
      .addCase(fetchPatientCategoryTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching item";
      });
  },
});

export default patientCategoryTypeSlice;
