/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatientServiceDetails } from './PatientServiceDetails';
export type PatientIpdBillDetailsPrintDto = {
    ipid?: string | null;
    billNo?: string | null;
    uhidNo?: string | null;
    patientName?: string | null;
    age?: number | null;
    gender?: string | null;
    department?: string | null;
    primaryConsultant?: string | null;
    secondaryConsultant?: string | null;
    currentDoctor?: string | null;
    wardBed?: string | null;
    hospitalPANNo?: string | null;
    hospitalGSTIN?: string | null;
    tanNo?: string | null;
    billDateTime?: string | null;
    admissionDateTime?: string;
    dischargeDateTime?: string | null;
    nameOfCompany?: string | null;
    companyAddress?: string | null;
    companyGSTNo?: string | null;
    claimId?: string | null;
    associateCompany?: string | null;
    patientCategory?: string | null;
    patientServiceDetail?: Array<PatientServiceDetails> | null;
};

