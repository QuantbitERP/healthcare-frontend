import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DoctorService } from "@/services/api-client/services/DoctorService";
import { CommonService, GenderDto, KVPair } from "@/api-client";
import { GenderService } from "@/services/api-client";

export interface LabelValue {
  label: string;
  value: string;
}

interface DoctorDropDownState {
  doctorPrefixList: LabelValue[];
  genderList: LabelValue[];
  followupChargesTypeList: LabelValue[];
  specializationList: LabelValue[];
  countryList: LabelValue[]; // Added countryList
  doctorAffiliationTypeList: LabelValue[]; // Add affiliation type list
  doctorRoleList: LabelValue[]; // Add doctor role list
  departmentList: LabelValue[]; // Add department list
  hospitalList: LabelValue[]; // Add hospital list
  loading: boolean;
  error: string | null;
}

const initialState: DoctorDropDownState = {
  doctorPrefixList: [],
  genderList: [],
  followupChargesTypeList: [],
  specializationList: [],
  countryList: [], // Initialize as empty array
  doctorAffiliationTypeList: [], // Initialize as empty array
  doctorRoleList: [], // Initialize as empty array
  departmentList: [], // Initialize as empty array
  hospitalList: [], // Initialize as empty array
  loading: false,
  error: null,
};

export const fetchDoctorDropDown = createAsyncThunk<
  {
    followupChargesTypeList: any;
    doctorPrefixList: LabelValue[];
    genderList: LabelValue[];
    specializationList: LabelValue[];
    countryList: LabelValue[]; // Add to thunk return type
    doctorAffiliationTypeList: LabelValue[]; // Add to thunk return type
    doctorRoleList: LabelValue[]; // Add to thunk return type
    departmentList: LabelValue[]; // Add to thunk return type
    hospitalList: LabelValue[]; // Add to thunk return type
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "doctorDropDown/fetchDoctorDropDown",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [doctorPrefixList, genderList, followupChargesTypeList, specializationList, countryList, doctorAffiliationTypeList, doctorRoleList, departmentList, hospitalList] = await Promise.all([
        DoctorService.getDoctorPrefix(version, tenant),
        GenderService.getApiVGenderList(version, tenant),
        DoctorService.getfollowupChargesType(version, tenant),
        DoctorService.getSpecialization(version, tenant),
        CommonService.postApiVCommonCountry(version,tenant,{}), // Fetch country list
        DoctorService.getDoctorAffiliationType(version, tenant), // Fetch affiliation type list
        DoctorService.getDoctorRole(version, tenant), // Fetch doctor role list
        DoctorService.getDepartmentKVlist(version, tenant), // Fetch department list
        DoctorService.getApiVHospitalHospitals(version, tenant), // Fetch hospital list
      ]);
      return (
        {
          doctorPrefixList: doctorPrefixList.data.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          genderList: genderList?.map((item: GenderDto) => ({
            value: item.genderId?.toString() ?? "",
            label: item.genderName ?? "",
          })) ?? [],
          followupChargesTypeList: followupChargesTypeList.data.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          specializationList: specializationList.data.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          countryList: countryList.data?.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          doctorAffiliationTypeList: doctorAffiliationTypeList.data?.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          doctorRoleList: doctorRoleList.data?.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          departmentList: departmentList.data?.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
          hospitalList: hospitalList.data?.items?.map((item: KVPair) => ({
            value: item.key ?? "",
            label: item.value ?? "",
          })) ?? [],
        }

      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch doctor prefix dropdown");
    }
  }
);

const DoctorDropDownSlice = createSlice({
  name: "doctorDropDown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDropDown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDropDown.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorPrefixList = action.payload.doctorPrefixList;
        state.genderList = action.payload.genderList;
        state.followupChargesTypeList = action.payload.followupChargesTypeList;
        state.specializationList = action.payload.specializationList;
        state.countryList = action.payload.countryList; // Set countryList
        state.doctorAffiliationTypeList = action.payload.doctorAffiliationTypeList; // Set affiliation type list
        state.doctorRoleList = action.payload.doctorRoleList; // Set doctor role list
        state.departmentList = action.payload.departmentList; // Set department list
        state.hospitalList = action.payload.hospitalList; // Set hospital list
      })
      .addCase(fetchDoctorDropDown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch doctor prefix dropdown";
      });
  },
});

export default DoctorDropDownSlice.reducer;

