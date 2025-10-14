export interface IpdBillDetailsResponse {
  data: IpdBillDetails;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
}

export interface IpdBillDetails {
  id: string;
  billDocumentNumber: string | null;
  patientid: string;
  visitNo: string;
  billNo: string;
  uhid: string;
  patientName: string;
  patientAgeYears: number;
  patientAgeMonths: number;
  patientAgeDays: number;
  patientMrn: string;
  patientMobileno: string;
  patientAddress: string;
  gender: string;
  department: string;
  primaryConsultant: string;
  secondaryConsultant: string;
  currentDoctor: string;
  wardBed: string;
  hospitalid: string;
  hospitalDoctorId: string;
  hospitalPANNo: string;
  hospitalGSTIN: string;
  tanNo: string;
  visitType: number;
  billDate: string;
  billTime: string;
  admissionDateTime: string;
  dischargeDateTime: string | null;
  schemeCompanyId: string;
  schemeCompanyName: string;
  companyAddress: string;
  companyGSTNo: string;
  claimId: string;
  associateCompany: string;
  schemeCompanyTypeId: string;
  schemeCompanyTypeName: string;
  billReceiptDocumentNumber: string;
  createdBy: string;
  billTotalAmount: number;
  billInsuranceAmount: number;
  billReceiptAmount: number;
  grossTotal: number;
  gstAmount: number;
  serviceDiscount: number;
  billDiscount: number;
  totalDiscount: number;
  netBillAmount: number;
  depositUtilized: number;
  amountReceived: number;
  outstandingAmount: number;
  amountInWords: string;
  finalBillAmount: number;
  patientServiceDetail: PatientServiceDetail[];
  billReceiptPaymentDetails: BillReceiptPaymentDetail[];
  billConcessionDetails: any[];
  beddetails: any[];
  depositDetails: DepositDetail[];
}

export interface PatientServiceDetail {
  billrequisitionId: string;
  billrequisitiondetailId: string;
  serviceid: string;
  servicesName: string;
  servicesGroup: string;
  servicesGroupId: string;
  packageName: string | null;
  requisitionNo: string;
  billRequisitionDocumentDate: string;
  billRequisitionTime: string;
  servicesCode: string;
  serviceDepartment: string;
  chargeBillingClass: string;
  rate: number;
  quantity: number;
  patientAmount: number;
  companyAmount: number;
  apportionConcession: number;
  concessionPercent: number;
  concessionAmount: number;
  doctorName: string | null;
  conessionGivenBy: string | null;
  rateLock: boolean;
  mouDiscountAmount: number;
  incloudeInPackage: boolean;
  outPackageAmount: number;
  editableSerivceName: string;
  concessioncategory: string | null;
  cancelRemark: string;
  serviceRemark: string | null;
  conessionRemark: string;
  grossAmount: number;
  totalAmount: number;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
  hospitalServiceId: string;
  hospitaldoctorid: string | null;
  hospitalDepartmentId: string;
  billingRoomCategoryId: string;
  packageId: string | null;
  isBillWiseGstApplicable: boolean;
  isServiceGroupConcession: boolean;
  profileId: string | null;
  isFree: boolean;
  defaultRate: number | null;
  inPackageAmount: number;
  isEmergency: boolean;
  serviceGstAmount: number;
  serviceCGstAmount: number;
  serviceSGstAmount: number;
  profileServices: any | null;
}

export interface BillReceiptPaymentDetail {
  bankname: string;
  receiptAmount: number;
  receiptDate: string;
  transactionnumber: string;
  receiptNo: string | null;
  modeOfPaymentId: string;
  modeOfPayment: string;
  chequeno: string;
  chequedate: string;
  branchname: string;
  approvalNumber: string;
  depositType: string | null;
  refundamount: number | null;
}

export interface SearchServicesResponse {
  data: {
    items: ServiceItem[];
    metadata: {
      page: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    };
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
}

export interface ServiceItem {
  hospitalServiceId: string;
  serviceName: string;
  serviceCode: string;
  isCompositeService: boolean;
  isProfile: boolean;
  departmentName: string;
}

export interface DepositDetail {
  depositType?: string | null;
  receiptDate?: string;
  receiptNo?: string | null;
  modeOfPaymentId?: string | null;
  modeOfPayment?: string | null;
  receiptAmount?: number | null;
  refundamount?: number | null;
}

// IPD Finalize API Types
export interface IpdFinalizeRequest {
  model: IpdFinalizeModel;
}

export interface IpdFinalizeModel {
  existingDraftBillId?: string;
  existingBillId?: string;
  patientVisitid: string;
  hospitalid: string;
  refferaldoctorid?: string;
  billcompanyid?: string;
  services: IpdFinalizeService[];
  billConcession: IpdFinalizeConcession[];
  receiptPayments: IpdFinalizeReceiptPayment[];
  groupConcession: IpdFinalizeGroupConcession[];
  billGstId?: string;
  billGstAmount: number;
  billRemark?: string;
  paidBy?: number;
  paidByName?: string;
  sponsoredbyName?: string;
  creditGivenBy?: string;
}

export interface IpdFinalizeService {
  billRequisitionId: string;
  billRequisitionDetailId: string;
  hospitalServiceId: string;
  hospitaldoctorid?: string;
  hospitalDepartmentId: string;
  billingRoomCategoryId: string;
  packageId?: string;
  requisitionDateTime: string;
  rate: number;
  quantity: number;
  amount: number;
  concessionPercent: number;
  concessionAmount: number;
  mouDiscountAmount: number;
  mouDiscountPercent: number;
  amountWithDiscount: number;
  apportionConcessionAmount: number;
  concessionRemark?: string;
  serviceGstId?: string;
  serviceGstAmount: number;
  serviceCGstAmount: number;
  serviceSGstAmount: number;
  totalAmount: number;
  inPackageAmount: number;
  outPackageAmount: number;
  editableServiceName?: string;
  isEmergency: boolean;
  concessionCategory?: string;
  concessionGivenBy?: string;
  cancelRemark?: string;
  isForcedPackageConversion: boolean;
  isBillWiseGstApplicable: boolean;
  oldPackageId?: string;
  isServiceGroupConcession: boolean;
  profileId?: string;
  isProfileParentService: boolean;
  isProfileChildService: boolean;
  isDeleted: boolean;
  isFree: boolean;
  isRateEdited: boolean;
  isRateLock: boolean;
  defaultRate: number;
  isBillingRoomCategoryUpdated: boolean;
  oldBillingRoomCategoryId?: string;
}

export interface IpdFinalizeConcession {
  concessioncategoryid: string;
  applicationuserid: string;
  concessionamount: number;
  concessionPercent: number;
  concessionremark?: string;
}

export interface IpdFinalizeReceiptPayment {
  billReceiptPaymentDetailId?: string;
  amount: number;
  receiptDate: string;
  paymentMode: string;
  transactionnumber?: string;
  bankname?: string;
  chequeno?: string;
  chequedate?: string;
  branchname?: string;
  approvalNumber?: string;
}

export interface IpdFinalizeGroupConcession {
  groupId: string;
  isPackageGroup: boolean;
  concessioncategoryid: string;
  concessionGivenById: string;
  concessionamount: number;
  concessionPercent: number;
  concessionremark?: string;
}

// Save Draft API Types
export interface IpdSaveDraftRequest {
  model: IpdSaveDraftModel;
}

export interface IpdSaveDraftModel {
  existingDraftBillId?: string;
  existingBillId?: string;
  patientVisitid?: string;
  hospitalid?: string;
  refferaldoctorid?: string;
  billcompanyid?: string;
  services: IpdFinalizeService[];
  billConcession: IpdFinalizeConcession[];
  receiptPayments: IpdFinalizeReceiptPayment[];
  groupConcession: IpdFinalizeGroupConcession[];
  billGstId?: string;
  billGstAmount?: number;
  billRemark?: string;
  paidBy?: number;
  paidByName?: string;
  sponsoredbyName?: string;
  creditGivenBy?: string;
}

// Patient Visit Details API Types
export interface PatientVisitDetailsResponse {
  data: PatientVisitDetails;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
}

export interface PatientVisitDetails {
  id: string;
  name: string;
  uhid: string;
  visitId: string;
  visitNo: string;
  age: number;
  gender: string;
  contactNumber: string;
  aadhaarCard: string;
  abhaid: string;
  patientCategory: string;
  patientCategoryId: string;
  patientCompany: string;
  patientCompanyId: string;
  admittedBillingClass: string;
  currentBillingClass: string;
  currentBillingClassId: string;
  visitType: string;
  ward: string;
  room: string;
  bed: string;
  registrationDate: string;
  visitDate: string;
  visitTime: string;
  admittedDoctor: string;
  consultingDoctor: string;
  isPackageApplied: boolean;
  isMlc: boolean;
  isInsured: boolean;
  lastVisitInfo: LastVisitInfo;
  insuranceInfo: any;
}

export interface LastVisitInfo {
  lastPatientVisitId: string;
  lastPatientVisitNo: string;
  visitDate: string;
  visitTime: string;
  visitRemark: string | null;
  visitType: string;
  consultingDoctor: string;
  billingClass: string;
  class: string;
  createdBy: string;
}
