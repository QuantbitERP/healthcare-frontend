/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UpdateDependencyEligibility } from './UpdateDependencyEligibility';
export type UpdateEmployeePolicyRequestDTO = {
    employeePolicyId?: string;
    employeeCategory?: string;
    subCategory?: string | null;
    validFrom?: string;
    validTill?: string;
    opd?: number | null;
    ipd?: number | null;
    all?: number | null;
    updateEligibilityList?: Array<UpdateDependencyEligibility> | null;
};

