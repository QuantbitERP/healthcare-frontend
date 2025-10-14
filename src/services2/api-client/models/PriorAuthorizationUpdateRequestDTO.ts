/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AmountList } from './AmountList';
export type PriorAuthorizationUpdateRequestDTO = {
    priorAuthorizationId?: string;
    insurancepolicyNumber?: string | null;
    claimId?: string | null;
    sumAssured?: number;
    approvalDateTime?: string | null;
    isApproved?: boolean;
    amountList?: Array<AmountList> | null;
    remarks?: string | null;
};

