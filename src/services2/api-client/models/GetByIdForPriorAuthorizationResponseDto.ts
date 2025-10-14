/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AuthAmountsDetailsListDto } from './AuthAmountsDetailsListDto';
export type GetByIdForPriorAuthorizationResponseDto = {
    id?: string;
    patientVisitId?: string;
    insuranceName?: string | null;
    insurancePolicyNumber?: string | null;
    preAuthNo?: string | null;
    sumAssuredAmount?: number;
    amounts?: Array<AuthAmountsDetailsListDto> | null;
};

