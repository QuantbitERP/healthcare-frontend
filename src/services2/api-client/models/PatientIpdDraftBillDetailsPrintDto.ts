/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { BillConcessionDetails } from './BillConcessionDetails';
import type { PatientServiceDetails } from './PatientServiceDetails';
export type PatientIpdDraftBillDetailsPrintDto = {
    id?: string | null;
    billDocumentNumber?: string | null;
    patientid?: string;
    visitNo?: string | null;
    billNo?: string | null;
    uhid?: string | null;
    patientName?: string | null;
    patientAgeYears?: number | null;
    patientAgeMonths?: number | null;
    patientAgeDays?: number | null;
    patientMrn?: string | null;
    patientMobileno?: string | null;
    patientAddress?: string | null;
    gender?: string | null;
    department?: string | null;
    primaryConsultant?: string | null;
    secondaryConsultant?: string | null;
    currentDoctor?: string | null;
    wardBed?: string | null;
    hospitalid?: string;
    hospitalDoctorId?: string;
    hospitalPANNo?: string | null;
    hospitalGSTIN?: string | null;
    tanNo?: string | null;
    visitType?: number | null;
    billDate?: string;
    billTime?: string;
    admissionDateTime?: string;
    dischargeDateTime?: string | null;
    schemeCompanyId?: string;
    schemeCompanyName?: string | null;
    companyAddress?: string | null;
    companyGSTNo?: string | null;
    claimId?: string | null;
    associateCompany?: string | null;
    schemeCompanyTypeId?: string;
    schemeCompanyTypeName?: string | null;
    billReceiptDocumentNumber?: string | null;
    createdBy?: string | null;
    billTotalAmount?: number | null;
    billInsuranceAmount?: number | null;
    billReceiptAmount?: number | null;
    grossTotal?: number | null;
    gstAmount?: number | null;
    serviceDiscount?: number | null;
    billDiscount?: number | null;
    totalDiscount?: number | null;
    netBillAmount?: number | null;
    depositUtilized?: number | null;
    amountReceived?: number | null;
    outstandingAmount?: number | null;
    amountInWords?: string | null;
    finalBillAmount?: number | null;
    patientServiceDetail?: Array<PatientServiceDetails> | null;
    billConcessionDetails?: Array<BillConcessionDetails> | null;
};

