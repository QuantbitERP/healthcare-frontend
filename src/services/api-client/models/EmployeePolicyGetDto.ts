/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DependantEligibilityDto } from './DependantEligibilityDto';
export type EmployeePolicyGetDto = {
    id?: string;
    employeeCategory?: string | null;
    subCategory?: string | null;
    opdLimit?: number;
    ipdLimit?: number;
    validFrom?: string;
    validTill?: string;
    status?: string | null;
    dependants?: Array<DependantEligibilityDto> | null;
};

