import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistConfig from "./persistConfig";

// Slices
import {
  scoreSlice,
  policyTableSlice,
  filtersSlice,
} from "./employee_policies/slice";
import {
  transferTableSlice,
  fundTransferTableSlice,
  categoryChangeTableSlice,
  emplyeeTransfersFiltersSlice,
} from "./employee_transfers/slice";
import {
  scoreCardSlice,
  billsSlice,
  opdFiltersSlice,
  cancelReasonsSlice,
  cancelDraftOpdBillsSlice,
  cancelNonDraftOpdBillsSlice,
  opdExportSlice,
  opdBillDetailsByIdSlice,
  patientBillingSlice,
  packagesSlice,
  opdServiceRateSlice,
  opdDraftBillSlice,
  opdBillingSlice,
} from "./opd_bills/slice";
import { patientSlice } from "./patients/slice";
import patientReducer from "./slices/patientSlice";
import patientFormReducer from "./patientFormSlice";
import patientBillDetailsReducer from "./slices/patientBillDetailsSlice";
import opdFiltersReducer from "./slices/opdFiltersSlice";
import PackageBillConversionFiltersLogReducer from "./slices/packagebillconversionlogFilters";
import reportListReducer from "./slices/reportListSlice";
import reportFilterOptionsReducer from "./slices/reportFilterOptionsSlice";
import reportFilterReducer from "./slices/reportFilterSlice";
import refundSlice from "./slices/RefundSlice";
import refundScoreReducer from "./slices/RefundScoreSlice";
import RefundFilterOptionsSlice from "./slices/RefundFilterSlice";
import refundByIdReducer from "./slices/RefundByIdSlice";
import refundServiceDetail from "./slices/RefundServiceSlice";
import TaxFilterOptions from "./slices/TaxFilterSlice";
import taxListReducer from "./slices/TaxListSlice";
import taxByIdReducer from "./slices/taxByIdSlice";
import DoctorFilterReducer from "./slices/DoctorFilterSlice";
import DoctorList from "./slices/DoctorListSlice";
import DoctorById from "./slices/DoctorByIdSlice";
import DoctorDropDownReducer from "./slices/DoctorDropDownSlice";
import { filtersSlicePatientCompany } from "./patientCompanyFiltersSlice";
import { schemeCompanySlice } from "./patientCompany/patientCompanySlice";
import { paymentReceivedSlice } from "./payments_received/slice";
import {
  patientCompanySlice,
  dropdownSlice,
  hospitalSlice,
  commonLocationSlicePatient,
  deletePatientCompanySlice,
} from "./patientCompany/slice";
import { servicesSearchReducer, searchServiceOrServiceGroupReducer } from "./patientCompany/servicesSearchSlice";
import {
  paymentMetadataSlice,
  paymentDetailSlice,
  paymentsSlice,
  columnConfigSlice,
} from "./payments_received_old/slice";
// import { patientSlice } from "./patients/slice";
import serviceGroupSlice, {
  serviceGroupFiltersSlice,
} from "./service_groups/slice";
import { rateSlice } from "./rate_list/slice";
import {
  applicableHospitalListItemSlice,
  compositeServiceListSlice,
  createNewServiceItemListSlice,
  getServiceMasterByIdSlice,
  postServiceMasterSlice,
  serviceFiltersSlice,
  serviceSlice,
  updateServiceMasterSlice,
} from "./master_services/slice";
// import rateSlice from "./rateSlice";
// import servicesSlice from './serviceSlice'

import ratesReducer from "./rateSlice";
import serviceReducer from "./servicesSlice";
import commonReducer from "./commonSlice";
import otServicePercentageReducer from "./otServicePercentageSlice";
import rateSettingsReducer from "./rateSettingsSlice";
import {
  deleteRoomCategorySlice,
  fetchRoomCategoriesWithFiltersSlice,
  getRoomCategorySlice,
  roomCategoryAddNewSlice,
  roomCategoryFilterSlice,
  roomCategoryUpdateSlice,
  saveRoomCategorySlice,
} from "./room_category/slice";
import suggestedServiceReducer from "./suggestedServiceSlice";
import patientCategoryTypeSlice from "./patient_category_types/slice";
import { priorAuthReducer } from "./prior_auth/slice";
import {
  concessionSlice,
  concessionCategoryTypeByIdSlice,
} from "./slices/financeAuthority";
import scheduleofChargeTypeSlice from "./rate_names/slice";
import modeOfPaymentFilterSlice from "./slices/ModeOfPaymentFilterSlice";
import {
  modeOfPaymentSliceReducer,
  modeOfPaymentByIdSliceReducer,
} from "./slices/ModeOfPaymentSlice";
import financeAuthoritySlice from "./finance_authority/slice";
import concessionCategorySlice from "./concession_category/slice";
import depositTypeSlice from "./deposite_type/slice";
import emergencyChargeSettingsSlice from "./emergency_charge/slice";
import serviceheadcodeSlice from "./slices/serviceheadcodeSlice";
import associateSchemeCompanySlice from "./associateCompany/slice";
import commonLocationSlice from "./common/slice";
import {
  operationCategorySlice,
  operationCategoryListSlice,
  operationCategoryByIdSlice,
  operationCategoryCreateSlice,
  operationCategoryUpdateSlice,
  operationCategoryDeleteSlice,
} from "./operation_category/slice";
import hospitalClearanceSlice from "./hospital_Clearance/slice";
import { depositConversionSlice } from "./deposit_conversion/slice";
import claimCheckListSlice from "./slices/claimCheckListSlice";
import companyWiseClaimCheckListSlice from "./slices/companyWiseClaimCheckListSlice";
import depositSlice from "./deposit/slice";

import ipdBillDetailsSlice from "./ipd_bill_details/slice";
import ipdFiltersReducer from "./ipdBillsFiltersSlice";
// import DoctorProfessionFeesSettings from "@/sections/dr_professioan_fees_settings/list";
import DoctorProfessionFeesSettingsSlice from "./DoctorFeesSettings/slice";
import PackageBillConversionLogReducer from "./package_bill_conversion_log/slice"

import {coverLetterSlice} from "./cover_letter/slice";
import {wardReducer,genderReducer,createdByReducer,modifiedByReducer} from "./ipdFilters/slice";
import chargesEstimationReducer from "./charges_estimation/slice";
import patientCompanyMultiplayerReducer from "./patientCompanyMultiplayer/slice";
import invoicingReducer from "./invoicing/slice";
import invoicingFiltersReducer from "./slices/invoicingFiltersSlice";
const persistedReducers = {
  common: persistReducer(persistConfig("common"), commonReducer),
  // employeeTransferTable: persistReducer(
  //   persistConfig("employeeTransferTable"),
  //   transferTableSlice.reducer
  // ),
  // employeeFundTransferTable: persistReducer(
  //   persistConfig("employeeFundTransferTable"),
  //   fundTransferTableSlice.reducer
  // ),
  employeeCategoryChangeTable: persistReducer(
    persistConfig("employeeCategoryChangeTable"),
    categoryChangeTableSlice.reducer
  ),
  opdFiltersOptions: persistReducer(
    persistConfig("opdFiltersOptions"),
    opdFiltersSlice.reducer
  ),
  patientBillingState: persistReducer(
    persistConfig("patientBillingSlice"),
    patientBillingSlice.reducer
  ),
  packageSlice: persistReducer(
    persistConfig("packagesSlice"),
    packagesSlice.reducer
  ),
  opdServiceRate: persistReducer(
    persistConfig("opdServiceRate"),
    opdServiceRateSlice.reducer
  ),
  patientForm: persistReducer(
    persistConfig("patientForm"),
    patientFormReducer
  ),
};

const rootReducer = combineReducers({
  ...persistedReducers,
  patients: patientReducer,
  employeeTransferTable: transferTableSlice.reducer,
  employeeFundTransferTable: fundTransferTableSlice.reducer,
  opdScoreCard: scoreCardSlice.reducer,
  opdBillsList: billsSlice.reducer,
  opdCancelReasons: cancelReasonsSlice.reducer,
  opdCancelDraftBills: cancelDraftOpdBillsSlice.reducer,
  opdCancelNonDraftBills: cancelNonDraftOpdBillsSlice.reducer,
  opdExportBills: opdExportSlice.reducer,
  opdBillDetailsById: opdBillDetailsByIdSlice.reducer,
  opdDraftBill: opdDraftBillSlice.reducer,
  patientBillDetails: patientBillDetailsReducer,
  opdFiltersOptions: opdFiltersSlice.reducer,
  opdFilters: opdFiltersReducer,
  opdBillingClass: opdBillingSlice.reducer,
  paymentReceived: paymentReceivedSlice.reducer,
  employeeStats: scoreSlice.reducer,
  policyTable: policyTableSlice.reducer,
  employeePoliciesFilters: filtersSlice.reducer,
  employeeTransferFilters: emplyeeTransfersFiltersSlice.reducer,
  opdPatientList: patientSlice.reducer,
  patientForm: patientFormReducer,
  serviceGroups: serviceGroupSlice.reducer,
  serviceGroupFilter: serviceGroupFiltersSlice.reducer,
  patientCategoryType: patientCategoryTypeSlice.reducer,
  rates: ratesReducer,
  services: serviceReducer,
  reportFilter: reportFilterReducer,
  reportList: reportListReducer,
  reportFilterOptions: reportFilterOptionsReducer,
  roomCategoryList: roomCategoryAddNewSlice.reducer,
  roomCategoryFilter: roomCategoryFilterSlice.reducer,
  saveRoomCategory: saveRoomCategorySlice.reducer,
  deleteRoomCategory: deleteRoomCategorySlice.reducer,
  fetchRoomCategoriesWithFilters: fetchRoomCategoriesWithFiltersSlice.reducer,
  roomCategoryUpdate: roomCategoryUpdateSlice.reducer,
  getRoomCategoryById: getRoomCategorySlice.reducer,
  paymentMetadata: paymentMetadataSlice.reducer,
  payments: paymentsSlice.reducer,
  paymentDetail: paymentDetailSlice.reducer,
  columnConfig: columnConfigSlice.reducer,
  refundFilter: RefundFilterOptionsSlice,
  RefundData: refundSlice,
  refundScore: refundScoreReducer,
  refundById: refundByIdReducer,
  refundServiceInfo: refundServiceDetail,
  concessionGivenBy: concessionSlice.reducer,
  // concessionCategory: concessionCategorySlice.reducer,
  concessionCategoryTypeById: concessionCategoryTypeByIdSlice.reducer,
  scheduleofChargeType: scheduleofChargeTypeSlice.reducer,
  financeAuthority: financeAuthoritySlice.reducer,
  rateList: rateSlice.reducer,
  modeOfPaymentFilter: modeOfPaymentFilterSlice,
  ModeOfPaymentFilterSlice: modeOfPaymentFilterSlice,
  ModeOfPaymentSlice: modeOfPaymentSliceReducer,
  modeOfPaymentById: modeOfPaymentByIdSliceReducer,
  concessionCategory: concessionCategorySlice.reducer,
  depositType: depositTypeSlice.reducer,
  emergencyChargeSettings: emergencyChargeSettingsSlice.reducer,
  TaxFilterOptions: TaxFilterOptions,
  taxList: taxListReducer,
  service: serviceSlice.reducer,
  serviceFilters: serviceFiltersSlice.reducer,
  createNewServiceItemList: createNewServiceItemListSlice.reducer,
  postServiceMaster: postServiceMasterSlice.reducer,
  compositeServiceList: compositeServiceListSlice.reducer,
  applicableHospitalListItem: applicableHospitalListItemSlice.reducer,
  updateServiceMaster: updateServiceMasterSlice.reducer,
  getServiceMasterById: getServiceMasterByIdSlice.reducer,
  taxById: taxByIdReducer,
  serviceheadcode: serviceheadcodeSlice,
  modeOfPayment: modeOfPaymentSliceReducer,
  DoctorFilterOptions: DoctorFilterReducer,
  Doctorlist: DoctorList,
  doctorDropDown: DoctorDropDownReducer,
  DoctorById: DoctorById,
  associateSchemeCompany: associateSchemeCompanySlice.reducer,
  commonReducer: commonLocationSlice.reducer,
  patientCompanySliceList: patientCompanySlice.reducer,
  patientCompanyFilter: dropdownSlice.reducer,
  hospitalList: hospitalSlice.reducer,
  patientCompanyFiltersApply: filtersSlicePatientCompany.reducer,
  patientCompanySave: schemeCompanySlice.reducer,
  deletePatientCompany: deletePatientCompanySlice.reducer,
  commonDropdown: commonLocationSlicePatient.reducer,
  servicesSearch: servicesSearchReducer,
  searchServiceOrServiceGroup: searchServiceOrServiceGroupReducer,
  // Operation Category slices
  operationCategory: operationCategorySlice.reducer,
  operationCategoryList: operationCategoryListSlice.reducer,
  operationCategoryById: operationCategoryByIdSlice.reducer,
  operationCategoryCreate: operationCategoryCreateSlice.reducer,
  operationCategoryUpdate: operationCategoryUpdateSlice.reducer,
  operationCategoryDelete: operationCategoryDeleteSlice.reducer,
  hospitalClearance: hospitalClearanceSlice,
  depositConversion: depositConversionSlice.reducer,
  claimCheckList: claimCheckListSlice.reducer,
  companyWiseClaimCheckList: companyWiseClaimCheckListSlice.reducer,
  otServicePercentage: otServicePercentageReducer,
  rateSettings: rateSettingsReducer,
  deposit: depositSlice.reducer,
  ipdFilters: ipdFiltersReducer,
  ipdBillDetails: ipdBillDetailsSlice,
  doctorProfessionFeesSettings: DoctorProfessionFeesSettingsSlice.reducer,
  coverLetter: coverLetterSlice,
  suggestedService: suggestedServiceReducer,
  wards: wardReducer,
  genders: genderReducer,
  createdBy: createdByReducer,
  modifiedBy: modifiedByReducer,
  priorAuth: priorAuthReducer,
  packageBillConversionLog: PackageBillConversionLogReducer,
  packageBillConversionFilters: PackageBillConversionFiltersLogReducer,
  chargesEstimation: chargesEstimationReducer,
  patientCompanyMultiplayer: patientCompanyMultiplayerReducer,
  invoicing: invoicingReducer,
  invoicingFilters: invoicingFiltersReducer,
});


export default rootReducer;
