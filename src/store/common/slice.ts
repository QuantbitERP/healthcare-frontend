import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCountries,
  fetchStates,
  fetchDistricts,
  fetchCities,
} from "./thunk";

import { KVPair, KVPairListResultModel } from "@/api-client";

export interface CommonLocationState {
  countries: never[] | KVPairListResultModel | any[];
  states: KVPairListResultModel | never[] | any[];
  districts: KVPairListResultModel | never[] | any[];
  cities: KVPair[] | KVPairListResultModel | never[];
  statusList: any[];

  loading: boolean;
  error: string | null;
}

const initialState: CommonLocationState = {
  countries: [],
  states: [],
  districts: [],
  cities: [],
  statusList: [],

  loading: false,
  error: null,
};

export const commonLocationSlice = createSlice({
  name: "commonLocation",
  initialState,
  reducers: {
    // Reset cascading lists when needed
    resetStateList: (state) => {
      state.states = [];
      state.districts = [];
      state.cities = [];
    },
    resetDistrictList: (state) => {
      state.districts = [];
      state.cities = [];
    },
    resetCityList: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    // ✅ Country
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      state.loading = false;
      state.countries = action.payload ?? [];
    });
    builder.addCase(fetchStates.fulfilled, (state, action) => {
      state.loading = false;
      state.states = action.payload ?? [];
    });
    builder.addCase(fetchDistricts.fulfilled, (state, action) => {
      state.loading = false;
      state.districts = action.payload ?? [];
    });
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.loading = false;
      state.cities = action.payload ?? [];
    });
    
    

    // builder.addCase(
    //   fetchStates.fulfilled,
    //   (state, action: PayloadAction<KVPairListResultModel>) => {
    //     state.loading = false;
    //     state.states = action.payload ?? [];
    //   }
    // );
    // builder.addCase(fetchStates.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = String(action.payload || "Failed to fetch states");
    // });

    // builder.addCase(fetchDistricts.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(
    //   fetchDistricts.fulfilled,
    //   (state, action: PayloadAction<KVPairListResultModel>) => {
    //     state.loading = false;
    //     state.districts = action.payload ?? [];
    //   }
    // );
    // builder.addCase(fetchDistricts.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = String(action.payload || "Failed to fetch districts");
    // });

    // ✅ City
    // builder.addCase(fetchCities.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(
    //   fetchCities.fulfilled,
    //   (state, action: PayloadAction<KVPairListResultModel>) => {
    //     state.loading = false;
    //     state.cities = action.payload ?? [];
    //   }
    // );
    // builder.addCase(fetchCities.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = String(action.payload || "Failed to fetch cities");
    // });

    // // ✅ Status
    // builder.addCase(fetchStatusListCommon.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(
    //   fetchStatusListCommon.fulfilled,
    //   (state, action: PayloadAction<KVPairListResultModel>) => {
    //     state.loading = false;
    //     state.statusList = action.payload ?? [];
    //   }
    // );
    // builder.addCase(fetchStatusListCommon.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = String(action.payload || "Failed to fetch status list");
    // });
  },
});

export const { resetStateList, resetDistrictList, resetCityList } =
  commonLocationSlice.actions;

export default commonLocationSlice;
