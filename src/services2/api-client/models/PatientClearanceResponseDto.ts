/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ServiceList } from './ServiceList';
export type PatientClearanceResponseDto = {
    approvedOn?: string | null;
    approvedBY?: string | null;
    modifiedOn?: string | null;
    modifiedBy?: string | null;
    markAllPendingClearance?: boolean;
    serviceLists?: Array<ServiceList> | null;
};

