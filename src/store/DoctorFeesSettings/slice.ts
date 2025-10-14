import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDoctorBasicAmountSettings,
  fetchDoctorBasicAmountSettingById,
  fetchDoctorWiseSettings,
  fetchPayoutAdjustmentMaster,
  savePayoutAdjustmentMaster,
  fetchPayoutAdjustmentCreatedByList,
  fetchPayoutAdjustmentModifiedByList,
  fetchPayoutAdjustmentById,
  updatePayoutAdjustmentMaster,
  fetchDoctorTypeByService,
  fetchDoctorTypeByDepartment,
  fetchPatientTypeByBillType,
  fetchPatientTypeByService,
  fetchCategoryByDoctorType,
  fetchModifiedByList,
  fetchCreatedByList,
  fetchDepartmentList,
  fetchBillTypeList,
  fetchCategoryList,
  fetchAdjustmentRows,
  fetchCalculationModeOptions,
  fetchAdjustmentHeadOptions,
  fetchPaymentTypeOptions,
  fetchDoctorOptions,
  fetchDoctorListFromHospital,
  saveDoctorBasicAmountSettings,
  deleteDoctorBasicAmountSetting,
  fetchPatientTypeByServiceCreatedByList,
  fetchPatientTypeByServiceModifiedByList,
  fetchBillTypeEnum,
  fetchPatientTypeByBillTypeCreatedByList,
  fetchPatientTypeByBillTypeModifiedByList,
  fetchDepartmentKVList,
  fetchDoctorTypeByDepartmentCreatedByList,
  fetchDoctorTypeByDepartmentModifiedByList,
  fetchDoctorKVList,
  fetchServicesList,
  fetchServiceGroupsList,
  fetchDoctorTypeList,
  fetchServiceList,
  fetchPatientCategoryList,
  fetchDefinitionTypeList,
  createDoctorWiseSetting,
  fetchPaymentTypesFromModeOfPayment,
  fetchDoctorRoleList,
  createDoctorTypeByServiceExclusion,
  updateDoctorTypeByServiceExclusion,
  deleteDoctorTypeByServiceExclusion,
  createDoctorTypeByDepartmentExclusion,
  updateDoctorTypeByDepartmentExclusion,
  deleteDoctorTypeByDepartmentExclusion,
  fetchPatientCompaniesList,
  createPatientTypeByBillTypeExclusion,
  updatePatientTypeByBillTypeExclusion,
  deletePatientTypeByBillTypeExclusion,
  createPatientTypeByServiceExclusion,
  updatePatientTypeByServiceExclusion,
  deletePatientTypeByServiceExclusion,
  createCategoryByDoctorTypeExclusion,
  updateCategoryByDoctorTypeExclusion,
  deleteCategoryByDoctorTypeExclusion,
  fetchServiceGroupCategories,
  fetchModifiedByListForBasicAmount,
  fetchCreatedByListForBasicAmount,
  fetchAdjustmentHeadsForPayout,
  fetchStatusList,
  deletePayoutAdjustmentMaster,
  refreshProfessionalFeesData,
  refreshBasicAmountData,
  refreshPayoutAdjustmentData,
  refreshDoctorWiseSettingsData,
  refreshExclusionSettingsData,
  fetchDoctorTypeByServiceCreatedByList,
  fetchDoctorTypeByServiceModifiedByList,
  fetchCategoryByDoctorTypeCreatedByList,
  fetchCategoryByDoctorTypeModifiedByList,
} from "./thunk";

// 🔹 AlertMessage type
interface AlertMessage {
  name: string;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

interface DoctorState {
  loading: boolean;
  basicAmountSettings: any[];
  currentDoctorSetting: any | null;
  basicAmountPagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  paymentAdjustmentList: any[];
  currentPayoutAdjustment: any | null;
  paymentAdjustmentPagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  doctorWiseSettingsList: any[];
  doctorTypeByServiceList: any[];
  doctorTypeByServicePagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  doctorTypeByDepartmentList: any[];
  doctorTypeByDepartmentPagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  patientTypeByBillTypeList: any[];
  patientTypeByBillTypePagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  patientTypeByServiceList: any[];
  patientTypeByServicePagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  categoryByDoctorTypeList: any[];
  categoryByDoctorTypePagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  error: string | null;
  // Tab-specific errors
  basicAmountError: string | null;
  payoutAdjustmentError: string | null;
  doctorWiseSettingsError: string | null;
  exclusionSettingsError: string | null;
  modifiedByList: { label: string; value: string }[];
  createdByList: { label: string; value: string }[];
  departmentList: { label: string; value: string }[];
  billTypeList: { label: string; value: string }[];
  categoryList: { label: string; value: string }[];
  doctors: { label: string; value: string }[];
  paymentTypes: { label: string; value: string }[];
  adjustmentHeads: { label: string; value: string }[];
  calculationModes: { label: string; value: string }[];
  adjustmentRows: any[];
  doctorTypes: any[];
  services: any[];
  patientCategories: any[];
  definationTypes: any[];
  // Patient Type By Service specific filter options
  patientTypeByServiceCreatedByList: { label: string; value: string }[];
  patientTypeByServiceModifiedByList: { label: string; value: string }[];
  // Patient Type By Bill Type specific filter options
  patientTypeByBillTypeCreatedByList: { label: string; value: string }[];
  patientTypeByBillTypeModifiedByList: { label: string; value: string }[];
  // Bill Type Enum
  billTypeEnum: { label: string; value: string }[];
  // Doctor Type By Department specific filter options
  doctorTypeByDepartmentCreatedByList: { label: string; value: string }[];
  doctorTypeByDepartmentModifiedByList: { label: string; value: string }[];
  // Department KV List
  departmentKVList: { label: string; value: string }[];
  // Doctor KV List
  doctorKVList: { label: string; value: string }[];
  // Definition Names Lists
  servicesList: { label: string; value: string }[];
  serviceGroupsList: { label: string; value: string }[];
  departmentsList: { label: string; value: string }[];
  // Doctor Type by Service specific
  doctorRoles: { label: string; value: string }[];
  doctorTypeByServiceLoading: boolean;
  doctorTypeByServiceError: string | null;
  // Doctor Type by Department specific
  doctorTypeByDepartmentLoading: boolean;
  doctorTypeByDepartmentError: string | null;
  // Patient Type by Bill Type specific
  patientCompaniesList: { label: string; value: string }[];
  patientTypeByBillTypeLoading: boolean;
  patientTypeByBillTypeError: string | null;
  // Patient Type by Service specific
  patientTypeByServiceLoading: boolean;
  patientTypeByServiceError: string | null;
  // Category by Doctor Type specific
  categoryByDoctorTypeLoading: boolean;
  categoryByDoctorTypeError: string | null;
  // Service Group Categories
  serviceGroupCategories: { label: string; value: string }[];
  // Basic Amount Filter Data
  modifiedByListForBasicAmount: { label: string; value: string }[];
  createdByListForBasicAmount: { label: string; value: string }[];
  // Payout Adjustment Data
  adjustmentHeadsForPayout: { label: string; value: string }[];
  statusList: { label: string; value: string }[];
  // Doctor Type by Service Filter Data
  doctorTypeByServiceCreatedByList: { label: string; value: string }[];
  doctorTypeByServiceModifiedByList: { label: string; value: string }[];
  // Category by Doctor Type Filter Data
  categoryByDoctorTypeCreatedByList: { label: string; value: string }[];
  categoryByDoctorTypeModifiedByList: { label: string; value: string }[];
  alertMessage: AlertMessage; // ✅ added here
}

const initialState: DoctorState = {
  loading: false,
  basicAmountSettings: [],
  currentDoctorSetting: null,
  basicAmountPagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  paymentAdjustmentList: [],
  currentPayoutAdjustment: null,
  paymentAdjustmentPagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  doctorWiseSettingsList: [],
  doctorTypeByServiceList: [],
  doctorTypeByServicePagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  doctorTypeByDepartmentList: [],
  doctorTypeByDepartmentPagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  patientTypeByBillTypeList: [],
  patientTypeByBillTypePagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  patientTypeByServiceList: [],
  patientTypeByServicePagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  categoryByDoctorTypeList: [],
  categoryByDoctorTypePagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  error: null,
  // Tab-specific errors
  basicAmountError: null,
  payoutAdjustmentError: null,
  doctorWiseSettingsError: null,
  exclusionSettingsError: null,
  modifiedByList: [],
  createdByList: [],
  departmentList: [],
  billTypeList: [],
  categoryList: [],
  doctors: [],
  paymentTypes: [],
  adjustmentHeads: [],
  calculationModes: [],
  adjustmentRows: [],
  doctorTypes: [],
  services: [],
  patientCategories: [],
  definationTypes: [],
  patientTypeByServiceCreatedByList: [],
  patientTypeByServiceModifiedByList: [],
  patientTypeByBillTypeCreatedByList: [],
  patientTypeByBillTypeModifiedByList: [],
  billTypeEnum: [],
  doctorTypeByDepartmentCreatedByList: [],
  doctorTypeByDepartmentModifiedByList: [],
  departmentKVList: [],
  doctorKVList: [],
  servicesList: [],
  serviceGroupsList: [],
  departmentsList: [],
  doctorRoles: [],
  doctorTypeByServiceLoading: false,
  doctorTypeByServiceError: null,
  doctorTypeByDepartmentLoading: false,
  doctorTypeByDepartmentError: null,
  patientCompaniesList: [],
  patientTypeByBillTypeLoading: false,
  patientTypeByBillTypeError: null,
  patientTypeByServiceLoading: false,
  patientTypeByServiceError: null,
  categoryByDoctorTypeLoading: false,
  categoryByDoctorTypeError: null,
  serviceGroupCategories: [],
  modifiedByListForBasicAmount: [],
  createdByListForBasicAmount: [],
  adjustmentHeadsForPayout: [],
  statusList: [],
  doctorTypeByServiceCreatedByList: [],
  doctorTypeByServiceModifiedByList: [],
  categoryByDoctorTypeCreatedByList: [],
  categoryByDoctorTypeModifiedByList: [],
  alertMessage: {
    name: "",
    add: false,
    edit: false,
    delete: false,
  },
};

const DoctorProfessionFeesSettingsSlice = createSlice({
  name: "DoctorProfessionFees",
  initialState,
  reducers: {
   
    setAlertMessage: (state, action: PayloadAction<AlertMessage>) => {
      state.alertMessage = action.payload;
    },
   
    resetAlertMessage: (state) => {
      state.alertMessage = { name: "", add: false, edit: false, delete: false };
    },
    
    clearCurrentDoctorSetting: (state) => {
      state.currentDoctorSetting = null;
    },
    
    clearCurrentPayoutAdjustment: (state) => {
      state.currentPayoutAdjustment = null;
    },

    // Tab-specific error clearers
    clearBasicAmountError: (state) => {
      state.basicAmountError = null;
    },
    clearPayoutAdjustmentError: (state) => {
      state.payoutAdjustmentError = null;
    },
    clearDoctorWiseSettingsError: (state) => {
      state.doctorWiseSettingsError = null;
    },
    clearExclusionSettingsError: (state) => {
      state.exclusionSettingsError = null;
    },
    clearAllTabErrors: (state) => {
      state.basicAmountError = null;
      state.payoutAdjustmentError = null;
      state.doctorWiseSettingsError = null;
      state.exclusionSettingsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorBasicAmountSettings.pending, (state) => {
        state.loading = true;
        state.basicAmountError = null;
      })
      .addCase(fetchDoctorBasicAmountSettings.fulfilled, (state, action) => {
        state.basicAmountSettings = action.payload.items;
        state.basicAmountPagination = action.payload.pagination;
        state.loading = false;
        state.basicAmountError = null;
      })
      .addCase(fetchDoctorBasicAmountSettings.rejected, (state, action) => {
        state.basicAmountError = action.error.message || "Failed to fetch basic amount settings";
        state.loading = false;
      })
      .addCase(fetchDoctorBasicAmountSettingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorBasicAmountSettingById.fulfilled, (state, action) => {
        state.currentDoctorSetting = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctorBasicAmountSettingById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch doctor setting";
        state.loading = false;
      })
      .addCase(fetchPayoutAdjustmentMaster.pending, (state) => {
        state.loading = true;
        state.payoutAdjustmentError = null;
      })
      .addCase(fetchPayoutAdjustmentMaster.fulfilled, (state, action) => {
        state.paymentAdjustmentList = action.payload.items;
        state.paymentAdjustmentPagination = action.payload.pagination;
        state.loading = false;
        state.payoutAdjustmentError = null;
      })
      .addCase(fetchPayoutAdjustmentMaster.rejected, (state, action) => {
        state.payoutAdjustmentError = action.error.message || "Failed to fetch payout adjustment master";
        state.loading = false;
      })
      .addCase(savePayoutAdjustmentMaster.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePayoutAdjustmentMaster.fulfilled, (state, _action) => {
        state.loading = false;
        // Set alert message for successful save
        state.alertMessage = {
          name: "Payout Adjustment",
          add: true,
          edit: false,
          delete: false
        };
      })
      .addCase(savePayoutAdjustmentMaster.rejected, (state, action) => {
        state.error = action.error.message || "Failed to save payout adjustment master";
        state.loading = false;
      })
      .addCase(fetchPayoutAdjustmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayoutAdjustmentById.fulfilled, (state, action) => {
        state.currentPayoutAdjustment = action.payload;
        state.loading = false;
      })
      .addCase(fetchPayoutAdjustmentById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch payout adjustment";
        state.loading = false;
      })
      .addCase(updatePayoutAdjustmentMaster.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePayoutAdjustmentMaster.fulfilled, (state, _action) => {
        state.loading = false;
        // Set alert message for successful update
        state.alertMessage = {
          name: "Payout Adjustment",
          add: false,
          edit: true,
          delete: false
        };
      })
      .addCase(updatePayoutAdjustmentMaster.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update payout adjustment master";
        state.loading = false;
      })
      .addCase(fetchDoctorWiseSettings.pending, (state) => {
        state.loading = true;
        state.doctorWiseSettingsError = null;
      })
      .addCase(fetchDoctorWiseSettings.fulfilled, (state, action) => {
        state.doctorWiseSettingsList = action.payload;
        state.loading = false;
        state.doctorWiseSettingsError = null;
      })
      .addCase(fetchDoctorWiseSettings.rejected, (state, action) => {
        state.doctorWiseSettingsError = action.error.message || "Failed to fetch doctor wise settings";
        state.loading = false;
      })
      .addCase(fetchDoctorTypeByService.pending, (state) => {
        state.loading = true;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchDoctorTypeByService.fulfilled, (state, action) => {
        state.doctorTypeByServiceList = action.payload.items;
        state.doctorTypeByServicePagination = action.payload.pagination;
        state.loading = false;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchDoctorTypeByService.rejected, (state, action) => {
        state.exclusionSettingsError =
          action.error.message || "Failed to fetch doctor type by service";
        state.loading = false;
      })
      .addCase(fetchDoctorTypeByDepartment.pending, (state) => {
        state.loading = true;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchDoctorTypeByDepartment.fulfilled, (state, action) => {
        state.doctorTypeByDepartmentList = action.payload.items;
        state.doctorTypeByDepartmentPagination = action.payload.pagination;
        state.loading = false;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchDoctorTypeByDepartment.rejected, (state, action) => {
        state.exclusionSettingsError =
          action.error.message || "Failed to fetch doctor type by department";
        state.loading = false;
      })
      .addCase(fetchPatientTypeByBillType.pending, (state) => {
        state.loading = true;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchPatientTypeByBillType.fulfilled, (state, action) => {
        state.patientTypeByBillTypeList = action.payload.items;
        state.patientTypeByBillTypePagination = action.payload.pagination;
        state.loading = false;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchPatientTypeByBillType.rejected, (state, action) => {
        state.exclusionSettingsError =
          action.error.message || "Failed to fetch patient type by bill type";
        state.loading = false;
      })
      .addCase(fetchPatientTypeByService.pending, (state) => {
        state.loading = true;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchPatientTypeByService.fulfilled, (state, action) => {
        state.patientTypeByServiceList = action.payload.items;
        state.patientTypeByServicePagination = action.payload.pagination;
        state.loading = false;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchPatientTypeByService.rejected, (state, action) => {
        state.exclusionSettingsError =
          action.error.message || "Failed to fetch patient type by service";
        state.loading = false;
      })
      .addCase(fetchCategoryByDoctorType.pending, (state) => {
        state.loading = true;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchCategoryByDoctorType.fulfilled, (state, action) => {
        state.categoryByDoctorTypeList = action.payload.items;
        state.categoryByDoctorTypePagination = action.payload.pagination;
        state.loading = false;
        state.exclusionSettingsError = null;
      })
      .addCase(fetchCategoryByDoctorType.rejected, (state, action) => {
        state.exclusionSettingsError =
          action.error.message || "Failed to fetch category by doctor type";
        state.loading = false;
      })
      .addCase(fetchModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload;
      })
      .addCase(fetchCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload;
      })
      .addCase(fetchDepartmentList.fulfilled, (state, action) => {
        state.departmentList = action.payload;
      })
      .addCase(fetchBillTypeList.fulfilled, (state, action) => {
        state.billTypeList = action.payload;
      })
      .addCase(fetchCategoryList.fulfilled, (state, action) => {
        state.categoryList = action.payload;
      })
      .addCase(fetchPayoutAdjustmentCreatedByList.fulfilled, (state, action) => {
        state.createdByList = action.payload;
      })
      .addCase(fetchPayoutAdjustmentModifiedByList.fulfilled, (state, action) => {
        state.modifiedByList = action.payload;
      });

    // options
    builder.addCase(fetchDoctorOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorOptions.fulfilled, (state, action) => {
      console.log("action.payload", action.payload);
      state.loading = false;
      state.doctors = action.payload;
    });
    builder.addCase(fetchDoctorOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch doctor options";
    });

    // Payment types
    builder.addCase(fetchPaymentTypeOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPaymentTypeOptions.fulfilled, (state, action) => {
      state.loading = false;
      state.paymentTypes = action.payload;
    });
    builder.addCase(fetchPaymentTypeOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch payment type options";
    });

    // Adjustment heads
    builder.addCase(fetchAdjustmentHeadOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdjustmentHeadOptions.fulfilled, (state, action) => {
      state.loading = false;
      state.adjustmentHeads = action.payload;
    });
    builder.addCase(fetchAdjustmentHeadOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch adjustment head options";
    });

    // Calculation modes
    builder.addCase(fetchCalculationModeOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCalculationModeOptions.fulfilled, (state, action) => {
      state.loading = false;
      state.calculationModes = action.payload;
    });
    builder.addCase(fetchCalculationModeOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch calculation mode options";
    });

    // Adjustment rows
    builder.addCase(fetchAdjustmentRows.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdjustmentRows.fulfilled, (state, action) => {
      state.loading = false;
      state.adjustmentRows = action.payload;
    });
    builder.addCase(fetchAdjustmentRows.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch adjustment rows";
    });

    builder.addCase(fetchDoctorTypeList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorTypes = action.payload;
    });

    builder.addCase(fetchServiceList.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload;
    });

    builder.addCase(fetchPatientCategoryList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientCategories = action.payload;
    });

    builder.addCase(fetchDefinitionTypeList.fulfilled, (state, action) => {
      state.loading = false;
      state.definationTypes = action.payload;
    });

    // Patient Type By Service Created By List
    builder.addCase(fetchPatientTypeByServiceCreatedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientTypeByServiceCreatedByList = action.payload;
    });

    // Patient Type By Service Modified By List
    builder.addCase(fetchPatientTypeByServiceModifiedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientTypeByServiceModifiedByList = action.payload;
    });

    // Patient Type By Bill Type Created By List
    builder.addCase(fetchPatientTypeByBillTypeCreatedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientTypeByBillTypeCreatedByList = action.payload;
    });

    // Patient Type By Bill Type Modified By List
    builder.addCase(fetchPatientTypeByBillTypeModifiedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientTypeByBillTypeModifiedByList = action.payload;
    });

    // Bill Type Enum
    builder.addCase(fetchBillTypeEnum.fulfilled, (state, action) => {
      state.loading = false;
      state.billTypeEnum = action.payload;
    });

    // Doctor Type By Department Created By List
    builder.addCase(fetchDoctorTypeByDepartmentCreatedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorTypeByDepartmentCreatedByList = action.payload;
    });

    // Doctor Type By Department Modified By List
    builder.addCase(fetchDoctorTypeByDepartmentModifiedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorTypeByDepartmentModifiedByList = action.payload;
    });

    // Department KV List
    builder.addCase(fetchDepartmentKVList.fulfilled, (state, action) => {
      state.loading = false;
      state.departmentKVList = action.payload;
    });

    // Doctor KV List
    builder.addCase(fetchDoctorKVList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorKVList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorKVList = action.payload;
    });
    builder.addCase(fetchDoctorKVList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch doctor KV list';
      state.doctorKVList = []; // Ensure empty array on error
    });

    // Definition Names Lists
    builder.addCase(fetchServicesList.fulfilled, (state, action) => {
      state.loading = false;
      state.servicesList = action.payload;
    });

    // Service Groups List
    builder.addCase(fetchServiceGroupsList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceGroupsList.fulfilled, (state, action) => {
      state.loading = false;
      state.serviceGroupsList = action.payload;
    });
    builder.addCase(fetchServiceGroupsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch service groups list";
    });

    // Service Group Categories
    builder.addCase(fetchServiceGroupCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceGroupCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.serviceGroupCategories = action.payload;
    });
    builder.addCase(fetchServiceGroupCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch service group categories";
    });

    // Modified By List for Basic Amount
    builder.addCase(fetchModifiedByListForBasicAmount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchModifiedByListForBasicAmount.fulfilled, (state, action) => {
      state.loading = false;
      state.modifiedByListForBasicAmount = action.payload;
    });
    builder.addCase(fetchModifiedByListForBasicAmount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch modified by list for basic amount";
    });

    // Created By List for Basic Amount
    builder.addCase(fetchCreatedByListForBasicAmount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCreatedByListForBasicAmount.fulfilled, (state, action) => {
      state.loading = false;
      state.createdByListForBasicAmount = action.payload;
    });
    builder.addCase(fetchCreatedByListForBasicAmount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch created by list for basic amount";
    });

    // Doctor Type by Service Created By List
    builder.addCase(fetchDoctorTypeByServiceCreatedByList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorTypeByServiceCreatedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorTypeByServiceCreatedByList = action.payload;
    });
    builder.addCase(fetchDoctorTypeByServiceCreatedByList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch doctor type by service created by list";
    });

    // Doctor Type by Service Modified By List
    builder.addCase(fetchDoctorTypeByServiceModifiedByList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorTypeByServiceModifiedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorTypeByServiceModifiedByList = action.payload;
    });
    builder.addCase(fetchDoctorTypeByServiceModifiedByList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch doctor type by service modified by list";
    });

    // Category by Doctor Type Created By List
    builder.addCase(fetchCategoryByDoctorTypeCreatedByList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoryByDoctorTypeCreatedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.categoryByDoctorTypeCreatedByList = action.payload;
    });
    builder.addCase(fetchCategoryByDoctorTypeCreatedByList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch category by doctor type created by list";
    });

    // Category by Doctor Type Modified By List
    builder.addCase(fetchCategoryByDoctorTypeModifiedByList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoryByDoctorTypeModifiedByList.fulfilled, (state, action) => {
      state.loading = false;
      state.categoryByDoctorTypeModifiedByList = action.payload;
    });
    builder.addCase(fetchCategoryByDoctorTypeModifiedByList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch category by doctor type modified by list";
    });

    // Adjustment Heads for Payout
    builder.addCase(fetchAdjustmentHeadsForPayout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdjustmentHeadsForPayout.fulfilled, (state, action) => {
      state.loading = false;
      state.adjustmentHeadsForPayout = action.payload;
    });
    builder.addCase(fetchAdjustmentHeadsForPayout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch adjustment heads for payout";
    });
    // Fetch Status List
    builder.addCase(fetchStatusList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStatusList.fulfilled, (state, action) => {
      state.loading = false;
      state.statusList = action.payload;
    });
    builder.addCase(fetchStatusList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch status list";
    });

    // Delete Payout Adjustment Master
    builder.addCase(deletePayoutAdjustmentMaster.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePayoutAdjustmentMaster.fulfilled, (state, _action) => {
      state.loading = false;
      // Clear current payout adjustment if it was deleted
      state.currentPayoutAdjustment = null;
    });
    builder.addCase(deletePayoutAdjustmentMaster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete payout adjustment master";
    });

    // Doctor List from Hospital
    builder.addCase(fetchDoctorListFromHospital.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorListFromHospital.fulfilled, (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    });
    builder.addCase(fetchDoctorListFromHospital.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch doctor list from hospital";
    });

    // Save Doctor Basic Amount Settings
    builder.addCase(saveDoctorBasicAmountSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveDoctorBasicAmountSettings.fulfilled, (state, _action) => {
      state.loading = false;
      // Optionally update the current doctor setting or add to the list
      // You can customize this based on your needs
    });
    builder.addCase(saveDoctorBasicAmountSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to save doctor basic amount settings";
    });
    // Delete Doctor Basic Amount Setting
    builder.addCase(deleteDoctorBasicAmountSetting.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDoctorBasicAmountSetting.fulfilled, (state, _action) => {
      state.loading = false;
      // Clear current doctor setting if it was deleted
      state.currentDoctorSetting = null;
    });
    builder.addCase(deleteDoctorBasicAmountSetting.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete doctor basic amount setting";
    });
    // Create Doctor Wise Setting
    builder.addCase(createDoctorWiseSetting.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDoctorWiseSetting.fulfilled, (state, _action) => {
      state.loading = false;
      // Optionally add the new setting to the list or handle success
      // You can customize this based on your needs
    });
    builder.addCase(createDoctorWiseSetting.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create doctor wise setting";
    });

    // Fetch Payment Types from ModeOfPayment
    builder.addCase(fetchPaymentTypesFromModeOfPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPaymentTypesFromModeOfPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.paymentTypes = action.payload;
    });
    builder.addCase(fetchPaymentTypesFromModeOfPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch payment types";
    });

    // Doctor Role List
    builder.addCase(fetchDoctorRoleList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDoctorRoleList.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorRoles = action.payload;
    });
    builder.addCase(fetchDoctorRoleList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch doctor role list";
    });

    // Create Doctor Type by Service Exclusion
    builder.addCase(createDoctorTypeByServiceExclusion.pending, (state) => {
      state.doctorTypeByServiceLoading = true;
      state.doctorTypeByServiceError = null;
    });
    builder.addCase(createDoctorTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Service Exclusion",
        add: true,
        edit: false,
        delete: false,
      };
    });
    builder.addCase(createDoctorTypeByServiceExclusion.rejected, (state, action) => {
      state.doctorTypeByServiceLoading = false;
      state.doctorTypeByServiceError = action.error.message || "Failed to create doctor type by service exclusion";
    });

    // Update Doctor Type by Service Exclusion
    builder.addCase(updateDoctorTypeByServiceExclusion.pending, (state) => {
      state.doctorTypeByServiceLoading = true;
      state.doctorTypeByServiceError = null;
    });
    builder.addCase(updateDoctorTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Service Exclusion",
        add: false,
        edit: true,
        delete: false,
      };
    });
    builder.addCase(updateDoctorTypeByServiceExclusion.rejected, (state, action) => {
      state.doctorTypeByServiceLoading = false;
      state.doctorTypeByServiceError = action.error.message || "Failed to update doctor type by service exclusion";
    });

    // Delete Doctor Type by Service Exclusion
    builder.addCase(deleteDoctorTypeByServiceExclusion.pending, (state) => {
      state.doctorTypeByServiceLoading = true;
      state.doctorTypeByServiceError = null;
    });
    builder.addCase(deleteDoctorTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Service Exclusion",
        add: false,
        edit: false,
        delete: true,
      };
    });
    builder.addCase(deleteDoctorTypeByServiceExclusion.rejected, (state, action) => {
      state.doctorTypeByServiceLoading = false;
      state.doctorTypeByServiceError = action.error.message || "Failed to delete doctor type by service exclusion";
    });

    // Create Doctor Type by Department Exclusion
    builder.addCase(createDoctorTypeByDepartmentExclusion.pending, (state) => {
      state.doctorTypeByDepartmentLoading = true;
      state.doctorTypeByDepartmentError = null;
    });
    builder.addCase(createDoctorTypeByDepartmentExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Department Exclusion",
        add: true,
        edit: false,
        delete: false,
      };
    });
    builder.addCase(createDoctorTypeByDepartmentExclusion.rejected, (state, action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.doctorTypeByDepartmentError = action.error.message || "Failed to create doctor type by department exclusion";
    });

    // Update Doctor Type by Department Exclusion
    builder.addCase(updateDoctorTypeByDepartmentExclusion.pending, (state) => {
      state.doctorTypeByDepartmentLoading = true;
      state.doctorTypeByDepartmentError = null;
    });
    builder.addCase(updateDoctorTypeByDepartmentExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Department Exclusion",
        add: false,
        edit: true,
        delete: false,
      };
    });
    builder.addCase(updateDoctorTypeByDepartmentExclusion.rejected, (state, action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.doctorTypeByDepartmentError = action.error.message || "Failed to update doctor type by department exclusion";
    });

    // Delete Doctor Type by Department Exclusion
    builder.addCase(deleteDoctorTypeByDepartmentExclusion.pending, (state) => {
      state.doctorTypeByDepartmentLoading = true;
      state.doctorTypeByDepartmentError = null;
    });
    builder.addCase(deleteDoctorTypeByDepartmentExclusion.fulfilled, (state, _action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.alertMessage = {
        name: "Doctor Type by Department Exclusion",
        add: false,
        edit: false,
        delete: true,
      };
    });
    builder.addCase(deleteDoctorTypeByDepartmentExclusion.rejected, (state, action) => {
      state.doctorTypeByDepartmentLoading = false;
      state.doctorTypeByDepartmentError = action.error.message || "Failed to delete doctor type by department exclusion";
    });

    // Patient Companies List
    builder.addCase(fetchPatientCompaniesList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPatientCompaniesList.fulfilled, (state, action) => {
      state.loading = false;
      state.patientCompaniesList = action.payload;
    });
    builder.addCase(fetchPatientCompaniesList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch patient companies list";
    });

    // Create Patient Type by Bill Type Exclusion
    builder.addCase(createPatientTypeByBillTypeExclusion.pending, (state) => {
      state.patientTypeByBillTypeLoading = true;
      state.patientTypeByBillTypeError = null;
    });
    builder.addCase(createPatientTypeByBillTypeExclusion.fulfilled, (state, _action) => {
      state.patientTypeByBillTypeLoading = false;
      state.alertMessage = {
        name: "Patient Type by Bill Type Exclusion",
        add: true,
        edit: false,
        delete: false,
      };
    });
    builder.addCase(createPatientTypeByBillTypeExclusion.rejected, (state, action) => {
      state.patientTypeByBillTypeLoading = false;
      state.patientTypeByBillTypeError = action.error.message || "Failed to create patient type by bill type exclusion";
    });

    // Update Patient Type by Bill Type Exclusion
    builder.addCase(updatePatientTypeByBillTypeExclusion.pending, (state) => {
      state.patientTypeByBillTypeLoading = true;
      state.patientTypeByBillTypeError = null;
    });
    builder.addCase(updatePatientTypeByBillTypeExclusion.fulfilled, (state, _action) => {
      state.patientTypeByBillTypeLoading = false;
      state.alertMessage = {
        name: "Patient Type by Bill Type Exclusion",
        add: false,
        edit: true,
        delete: false,
      };
    });
    builder.addCase(updatePatientTypeByBillTypeExclusion.rejected, (state, action) => {
      state.patientTypeByBillTypeLoading = false;
      state.patientTypeByBillTypeError = action.error.message || "Failed to update patient type by bill type exclusion";
    });

    // Delete Patient Type by Bill Type Exclusion
    builder.addCase(deletePatientTypeByBillTypeExclusion.pending, (state) => {
      state.patientTypeByBillTypeLoading = true;
      state.patientTypeByBillTypeError = null;
    });
    builder.addCase(deletePatientTypeByBillTypeExclusion.fulfilled, (state, _action) => {
      state.patientTypeByBillTypeLoading = false;
      state.alertMessage = {
        name: "Patient Type by Bill Type Exclusion",
        add: false,
        edit: false,
        delete: true,
      };
    });
    builder.addCase(deletePatientTypeByBillTypeExclusion.rejected, (state, action) => {
      state.patientTypeByBillTypeLoading = false;
      state.patientTypeByBillTypeError = action.error.message || "Failed to delete patient type by bill type exclusion";
    });

    // Create Patient Type by Service Exclusion
    builder.addCase(createPatientTypeByServiceExclusion.pending, (state) => {
      state.patientTypeByServiceLoading = true;
      state.patientTypeByServiceError = null;
    });
    builder.addCase(createPatientTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.patientTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Patient Type by Service Exclusion",
        add: true,
        edit: false,
        delete: false,
      };
    });
    builder.addCase(createPatientTypeByServiceExclusion.rejected, (state, action) => {
      state.patientTypeByServiceLoading = false;
      state.patientTypeByServiceError = action.error.message || "Failed to create patient type by service exclusion";
    });

    // Update Patient Type by Service Exclusion
    builder.addCase(updatePatientTypeByServiceExclusion.pending, (state) => {
      state.patientTypeByServiceLoading = true;
      state.patientTypeByServiceError = null;
    });
    builder.addCase(updatePatientTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.patientTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Patient Type by Service Exclusion",
        add: false,
        edit: true,
        delete: false,
      };
    });
    builder.addCase(updatePatientTypeByServiceExclusion.rejected, (state, action) => {
      state.patientTypeByServiceLoading = false;
      state.patientTypeByServiceError = action.error.message || "Failed to update patient type by service exclusion";
    });

    // Delete Patient Type by Service Exclusion
    builder.addCase(deletePatientTypeByServiceExclusion.pending, (state) => {
      state.patientTypeByServiceLoading = true;
      state.patientTypeByServiceError = null;
    });
    builder.addCase(deletePatientTypeByServiceExclusion.fulfilled, (state, _action) => {
      state.patientTypeByServiceLoading = false;
      state.alertMessage = {
        name: "Patient Type by Service Exclusion",
        add: false,
        edit: false,
        delete: true,
      };
    });
    builder.addCase(deletePatientTypeByServiceExclusion.rejected, (state, action) => {
      state.patientTypeByServiceLoading = false;
      state.patientTypeByServiceError = action.error.message || "Failed to delete patient type by service exclusion";
    });
    
    // Create Category by Doctor Type Exclusion
    builder.addCase(createCategoryByDoctorTypeExclusion.pending, (state) => {
      state.categoryByDoctorTypeLoading = true;
      state.categoryByDoctorTypeError = null;
    });
    builder.addCase(createCategoryByDoctorTypeExclusion.fulfilled, (state, _action) => {
      state.categoryByDoctorTypeLoading = false;
      state.alertMessage = {
        name: "Category by Doctor Type Exclusion",
        add: true,
        edit: false,
        delete: false,
      };
    });
    builder.addCase(createCategoryByDoctorTypeExclusion.rejected, (state, action) => {
      state.categoryByDoctorTypeLoading = false;
      state.categoryByDoctorTypeError = action.error.message || "Failed to create category by doctor type exclusion";
    });

    // Update Category by Doctor Type Exclusion
    builder.addCase(updateCategoryByDoctorTypeExclusion.pending, (state) => {
      state.categoryByDoctorTypeLoading = true;
      state.categoryByDoctorTypeError = null;
    });
    builder.addCase(updateCategoryByDoctorTypeExclusion.fulfilled, (state, _action) => {
      state.categoryByDoctorTypeLoading = false;
      state.alertMessage = {
        name: "Category by Doctor Type Exclusion",
        add: false,
        edit: true,
        delete: false,
      };
    });
    builder.addCase(updateCategoryByDoctorTypeExclusion.rejected, (state, action) => {
      state.categoryByDoctorTypeLoading = false;
      state.categoryByDoctorTypeError = action.error.message || "Failed to update category by doctor type exclusion";
    });

    // Delete Category by Doctor Type Exclusion
    builder.addCase(deleteCategoryByDoctorTypeExclusion.pending, (state) => {
      state.categoryByDoctorTypeLoading = true;
      state.categoryByDoctorTypeError = null;
    });
    builder.addCase(deleteCategoryByDoctorTypeExclusion.fulfilled, (state, _action) => {
      state.categoryByDoctorTypeLoading = false;
      state.alertMessage = {
        name: "Category by Doctor Type Exclusion",
        add: false,
        edit: false,
        delete: true,
      };
    });
    builder.addCase(deleteCategoryByDoctorTypeExclusion.rejected, (state, action) => {
      state.categoryByDoctorTypeLoading = false;
      state.categoryByDoctorTypeError = action.error.message || "Failed to delete category by doctor type exclusion";
    });

    // ==================== REFRESH THUNKS ====================

    // Refresh Professional Fees Data
    builder.addCase(refreshProfessionalFeesData.fulfilled, (_, _action) => {
      // Data refreshed, no state changes needed
    });

    // Refresh Basic Amount Data
    builder.addCase(refreshBasicAmountData.fulfilled, (_, _action) => {
      // Data refreshed, no state changes needed
    });

    // Refresh Payout Adjustment Data
    builder.addCase(refreshPayoutAdjustmentData.fulfilled, (_, _action) => {
      // Data refreshed, no state changes needed
    });

    // Refresh Doctor Wise Settings Data
    builder.addCase(refreshDoctorWiseSettingsData.fulfilled, (_, _action) => {
      // Data refreshed, no state changes needed
    });

    // Refresh Exclusion Settings Data
    builder.addCase(refreshExclusionSettingsData.fulfilled, (_, _action) => {
      // Data refreshed, no state changes needed
    });
  },
});

export const {
  setAlertMessage,
  resetAlertMessage,
  clearCurrentDoctorSetting,
  clearCurrentPayoutAdjustment,
  clearBasicAmountError,
  clearPayoutAdjustmentError,
  clearDoctorWiseSettingsError,
  clearExclusionSettingsError,
  clearAllTabErrors
} = DoctorProfessionFeesSettingsSlice.actions;

export default DoctorProfessionFeesSettingsSlice;
