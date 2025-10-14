// src/store/emergency_charge_settings/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEmergencyChargeSettingsWithFilter,
  createEmergencyChargeSetting,
  updateEmergencyChargeSetting,
  deleteEmergencyChargeSettings,
  getEmergencyChargeSettingById,
  fetchEmergencyChargeSettingFilters,
} from "./thunk";

interface EmergencyChargeSettingsState {
  list: any[];
  meta: any;
  loading: boolean;
  error: string | null;
  selectedItem: any | null;
  filterOptions: {
    createdBy: any[];
    modifiedBy: any[];
  };
}

const initialState: EmergencyChargeSettingsState = {
  list: [],
  meta: {},
  loading: false,
  error: null,
  selectedItem: null,
  filterOptions: {
    createdBy: [],
    modifiedBy: [],
  },
};

const emergencyChargeSettingsSlice = createSlice({
  name: "emergencyChargeSettings",
  initialState,
  reducers: {
    resetSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ Fetch list with filter
      .addCase(fetchEmergencyChargeSettingsWithFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmergencyChargeSettingsWithFilter.fulfilled,
        (state, action) => {
          state.loading = false;
          const dataList  = action.payload as any;
          state.list = dataList?.items || [];
        //   state.meta = {
        //     totalPages: action.payload?.totalPages || 1,
        //     totalCount: action.payload?.totalCount || 0,
        //     sortId: action.payload?.sortId || "",
        //     sortType: action.payload?.sortType || "",
        //   };
        }
      )
      .addCase(
        fetchEmergencyChargeSettingsWithFilter.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      // ✅ Create
      .addCase(createEmergencyChargeSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmergencyChargeSetting.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createEmergencyChargeSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Update
      .addCase(updateEmergencyChargeSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmergencyChargeSetting.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmergencyChargeSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Delete
      .addCase(deleteEmergencyChargeSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmergencyChargeSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteEmergencyChargeSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Get by Id
      .addCase(getEmergencyChargeSettingById.pending, (state) => {
        state.loading = true;
        state.selectedItem = null;
      })
      .addCase(getEmergencyChargeSettingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(getEmergencyChargeSettingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Fetch filters
      .addCase(
        fetchEmergencyChargeSettingFilters.fulfilled,
        (state, action) => {
          state.filterOptions.createdBy = action.payload.createdBy || [];
          state.filterOptions.modifiedBy = action.payload.modifiedBy || [];
        }
      );
  },
});

export const { resetSelectedItem } = emergencyChargeSettingsSlice.actions;

export default emergencyChargeSettingsSlice;
