/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AmountsDetailsListDto } from './AmountsDetailsListDto';
export type PriorAuthorizationRequestListResponseDto = {
    id?: string;
    patientName?: string | null;
    patientVisitId?: string;
    patientId?: string;
    uhid?: string | null;
    visitNo?: string | null;
    visitType?: string | null;
    patientCategory?: string | null;
    visit?: string | null;
    patientCompany?: string | null;
    associateCompanyName?: string | null;
    insuranceDetail?: string | null;
    insurancePolicyNumber?: string | null;
    preAuthNoCode?: string | null;
    sumInsuranceAmount?: number;
    modifiedOn?: string | null;
    modifiedby?: string | null;
    createdOn?: string | null;
    createdBy?: string | null;
    amounts?: Array<AmountsDetailsListDto> | null;
};

