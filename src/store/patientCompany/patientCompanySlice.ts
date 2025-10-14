import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { InsertPatientCompanyRequestDTO } from "@/services/api-client/models/InsertPatientCompanyRequestDTO";
import { savePatientCompany, fetchPatientCompanyById } from "./thunks";

// Custom interface that extends the API interface to handle hospitalIds and visitType as arrays
interface PatientCompanyData extends Omit<InsertPatientCompanyRequestDTO, 'hospitalIds' | 'visitType'> {
  hospitalIds: string[];
  visitType: string[];
}

type SchemeCompanyState = {
  data: PatientCompanyData;
  uploadData: any[];
  discountsData: any[];
  loading: boolean;
  error: string | null;
  saveSuccess: boolean;
  validationErrors: Record<string, string>;
  fetchedPatientCompany: any | null;
  fetchLoading: boolean;
  fetchError: string | null;
};

const initialSaveState: SchemeCompanyState = {
  uploadData: [],
  discountsData: [],
  data: {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    hospitalIds: [],
    name: "",
    schemeCompanyTypeId: "",
    scheduleOfChargesTypeId: "",
    shortName: "",
    isMediclaim: false,
    isExcludeFromDoctorProfessionalFee: false,
    isIPMaterial: false,
    isIPService: false,
    isOPMaterial: false,
    isOPService: false,
    associateSchemeCompanyIds: [],
    licenseNo: "",
    gstNumber: "",
    website: "",
    panNo: "",
    registrationNo: "",
    contactNo: "",
    mobileNo: "",
    faxNo1: "",
    emailAddress: "",
    fromDate: "2025-07-28T07:41:31.359Z",
    toDate: "2030-07-29T07:41:31.359Z",
    emergencyPercentage: 0,
    highRiskPercentage: 0,
    highSkillPercentage: 0,
    referralLetterValidityDays: 0,
    registrationValidityDays: 0,
    visitType: [],
    description: "",
    documents: [],
    countryId: "",
    districtId: "",
    stateId: "",
    cityId: "",
    areaId: "",
    pincode: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNo: "",
    exclusions: [],
    discountCategory: "",
    discountGivenBy: "",
    discounts: [],
    emergencyPackageApplicableDate: "",
    emergencyPackageApplicableTime: "00:00:00",
    emergencyPackagePercentage: 0,
    isBlock: false,
    departmentid: null,
  },
  loading: false,
  error: null,
  saveSuccess: false,
  validationErrors: {},
  fetchedPatientCompany: null,
  fetchLoading: false,
  fetchError: null,
};

export const schemeCompanySlice = createSlice({
  name: "schemeCompany",
  initialState: initialSaveState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{
        field: keyof PatientCompanyData;
        value: any;
      }>
    ) => {
      (state.data as any)[action.payload.field] = action.payload.value;
    },
    setAllFields: (
      state,
      action: PayloadAction<PatientCompanyData>
    ) => {
      state.data = { ...action.payload };
    },
    resetFields: () => initialSaveState,
    toggleArrayFieldItem: (
      state,
      action: PayloadAction<{
        field: keyof PatientCompanyData;
        value: string;
      }>
    ) => {
      const currentArray = state.data[action.payload.field] as string[];
      const value = action.payload.value;

      if (Array.isArray(currentArray)) {
        if (currentArray.includes(value)) {
          (state.data as any)[action.payload.field] = currentArray.filter(
            (item) => item !== value
          );
        } else {
          (state.data as any)[action.payload.field] = [...currentArray, value];
        }
      }
    },
    setValidationError: (
      state,
      action: PayloadAction<{ field: string; error: string }>
    ) => {
      state.validationErrors[action.payload.field] = action.payload.error;
    },
    clearValidationError: (state, action: PayloadAction<string>) => {
      delete state.validationErrors[action.payload];
    },
    clearAllValidationErrors: (state) => {
      state.validationErrors = {};
    },
    updateUploadData: (
      state,
      action: PayloadAction<any[]>
    ) => {
      state.uploadData = action.payload;
    },
    updateDiscountsData: (
      state,
      action: PayloadAction<any[]>
    ) => {
      state.discountsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePatientCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(savePatientCompany.fulfilled, (state) => {
        state.loading = false;
        state.saveSuccess = true;
      })
      .addCase(savePatientCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Save failed";
        state.saveSuccess = false;
      })
      // Fetch Patient Company by ID
      .addCase(fetchPatientCompanyById.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchPatientCompanyById.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.fetchedPatientCompany = action.payload;
        // Populate form data with fetched data
        if (action.payload?.data) {
          const apiData = action.payload.data;
         
          console.log(apiData.hospitalId?.map(x => x.hospitalGuId??""));
          state.data = {
            ...state.data,
            id: apiData.id || "",
            hospitalIds: apiData.hospitalId?.map(x => x.hospitalGuId).filter((id): id is string => Boolean(id)) || [],
            name: apiData.name || "",
            schemeCompanyTypeId: apiData.patientCategoryId || "",
            scheduleOfChargesTypeId: apiData.rateNameId || "",
            shortName: apiData.shortName || "",
            isMediclaim: apiData.ismediclaim || false,
            isExcludeFromDoctorProfessionalFee:
              apiData.isExcludeFromDoctorProfessionalFee || false,
            isBlock: apiData.isBlock || false,
            isIPMaterial: apiData.isIPMaterial || false,
            isIPService: apiData.isIPService || false,
            isOPMaterial: apiData.isOPMaterial || false,
            isOPService: apiData.isOPService || false,
            associateSchemeCompanyIds: (apiData.associateSchemeCompanyId
              ?.map((a) => a.associateSchemeCompanyGuId)
              .filter((id): id is string => Boolean(id)) || []) as string[],
            licenseNo: apiData.licenseno || "",
            registrationNo: apiData.registrationno || "",
            panNo: apiData.pan || "",
            gstNumber: apiData.gstNumber || "",
            mobileNo: apiData.mobileno || "",
            contactNo: apiData.contactno || "",
            faxNo1: apiData.fax || "",
            website: apiData.website || "",
            fromDate: apiData.fromDate || "",
            toDate: apiData.toDate || "",
            highSkillPercentage: apiData.highSkillPercentage || 0,
            highRiskPercentage: apiData.highRiskPercentage || 0,
            emergencyPercentage: apiData.emergencyPercentage || 0,
            referralLetterValidityDays: apiData.referraLetterValidityDays || 0,
            registrationValidityDays: apiData.registrationValidityDays || 0,
            visitType: apiData.visitType ? 
              (Array.isArray(apiData.visitType) 
                ? apiData.visitType.map(id => String(id))
                : [String(apiData.visitType)]
              ) : [],
            description: apiData.description || "",
            countryId: apiData.countryid || "",
            stateId: apiData.stateid || "",
            cityId: apiData.cityid || "",
            areaId: apiData.areaid || "",
            pincode: apiData.pincode || "",
            address: apiData.address || "",
            emergencyContactName: apiData.emergencycontactPersonname || "",
            emergencyContactNo: apiData.emergencycontactPersonno || "",
            exclusions: (apiData.exclusion || []).map((exclusion: any) => ({
              serviceId: exclusion.serviceid || null,
              departmentId: exclusion.departmentid || null,
              itemId: exclusion.itemid || null,
              itemCategoryId: exclusion.itemcategoryid || null,
            })),
            discountCategory: apiData.discountCategory || "",
            discountGivenBy: apiData.authorizedBy || "",
            emergencyPackageApplicableDate:
              apiData.emergencyPackageApplicableDate || "",
            emergencyPackageApplicableTime:
              apiData.emergencyPackageApplicableTime || "",
            emergencyPackagePercentage: apiData.emergencyPackagePercentage || 0,
            departmentid: null, // Not provided by API response
          };

          // Populate uploadData from API documents
          if (apiData.documentDetils && Array.isArray(apiData.documentDetils)) {
            state.uploadData = apiData.documentDetils.map((doc: any) => ({
              id: doc.id || Date.now().toString(),
              fileName: doc.fileName || "",
              fileDescription: doc.fileDescription || doc.fileName || "",
              filePath: doc.filePath || "",
              fileSize: doc.fileSize || 0,
              fileType: doc.fileType || "",
              uploadDate: doc.uploadDate || new Date().toISOString(),
            }));
          } else {
            state.uploadData = [];
          }

          // Populate discountsData from API discounts
          if (apiData.concessionDiscountRuleDetils && Array.isArray(apiData.concessionDiscountRuleDetils)) {
            state.discountsData = apiData.concessionDiscountRuleDetils.map((discount: any) => ({
              id: discount.id || Date.now().toString(),
              serviceId: discount.serviceid || "",
              serviceGroupId: discount.servicegroupid || "",
              serviceName: discount.serviceName || "",
              code: discount.code || "",
              serviceDepartmentName: discount.serviceDepartmentName || "",
              opDiscountPercentage: discount.opDiscountPrecentage || 0,
              maxOPDiscountPercentage: discount.maxOPDiscountPrecentage || 0,
              ipDiscountPercentage: discount.ipDiscountPrecentage || 0,
              maxIPDiscountPercentage: discount.maxIPDiscountPrecentage || 0,
              includeExclude: discount.isInclude ? 1 : 0,
            }));
          } else {
            state.discountsData = [];
          }
        }
      })
      .addCase(fetchPatientCompanyById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || "Failed to fetch patient company";
      });
  },
});

export const {
  updateField,
  setAllFields,
  resetFields,
  toggleArrayFieldItem,
  setValidationError,
  clearValidationError,
  clearAllValidationErrors,
  updateUploadData,
  updateDiscountsData,
} = schemeCompanySlice.actions;
