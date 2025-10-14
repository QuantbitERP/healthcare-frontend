/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { LastVisitInformation } from './LastVisitInformation';
export type SuggestServicesGetByIdResponseDto = {
    id?: string;
    name?: string | null;
    uhid?: string | null;
    visitId?: string;
    visitNo?: string | null;
    age?: number;
    gender?: string | null;
    contactNumber?: string | null;
    aadhaarCard?: string | null;
    abhaid?: string | null;
    patientCategory?: string | null;
    patientCompany?: string | null;
    admittedBillingClass?: string | null;
    currentBillingClass?: string | null;
    visitType?: string | null;
    ward?: string | null;
    room?: string | null;
    bed?: string | null;
    registrationDate?: string;
    visitDate?: string;
    visitTime?: string;
    admittedDoctor?: string | null;
    consultingDoctor?: string | null;
    lastVisitInfo?: LastVisitInformation;
    patientCategoryId?: string | null;
    patientCompanyId?: string | null;
};

