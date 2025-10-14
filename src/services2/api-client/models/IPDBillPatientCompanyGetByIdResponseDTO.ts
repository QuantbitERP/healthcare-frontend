/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AmountListResponse } from './AmountListResponse';
export type IPDBillPatientCompanyGetByIdResponseDTO = {
    ipdBillPatientCompanyDetailId?: string;
    companyName?: string | null;
    associateCompanyName?: string | null;
    insurancePolicyNo?: string | null;
    claimId?: string | null;
    amountlist?: Array<AmountListResponse> | null;
};

