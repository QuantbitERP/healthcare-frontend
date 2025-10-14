/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { BillAndDeposits } from './BillAndDeposits';
import type { RecordRefunds } from './RecordRefunds';
export type SaveRefundDto = {
    refundId?: string;
    documentDate?: string;
    billDocumentNumber?: string | null;
    billTime?: string | null;
    visitType?: number;
    visitTypeName?: string | null;
    abhaId?: string | null;
    approvedBy?: string | null;
    amounttoRefund?: number;
    refundstatus?: string | null;
    patientId?: string;
    patientMrn?: string | null;
    patientName?: string | null;
    patientGender?: string | null;
    patientAgeYears?: number;
    patientAgeMonths?: number;
    patientAgeDays?: number;
    patientMobileNo?: string | null;
    patientAddress?: string | null;
    patientRegistrationDate?: string;
    hospitalId?: string;
    referralDoctorId?: string;
    doctorName?: string | null;
    schemeCompanyId?: string;
    schemeCompanyTypeId?: string;
    schemeCompanyName?: string | null;
    schemeCompanyTypeName?: string | null;
    remark?: string | null;
    amountPaid?: number;
    deposits?: number;
    disountper?: number;
    discountamt?: number;
    billAndDeposits?: Array<BillAndDeposits> | null;
    recordRefunds?: Array<RecordRefunds> | null;
};

