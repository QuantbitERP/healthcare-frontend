/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DependencyEligibility } from './DependencyEligibility';
export type EmployeePolicySaveRequestDTO = {
    employeeCategory?: string;
    subCategory?: Array<string> | null;
    validFrom?: string;
    validTill?: string;
    opd?: number | null;
    ipd?: number | null;
    all?: number | null;
    eligibilityList?: Array<DependencyEligibility> | null;
};

