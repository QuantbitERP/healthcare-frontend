/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { DependantEligibilityDto } from './DependantEligibilityDto';
export type EmployeePolicySaveDto = {
    employeeCategory?: string | null;
    subCategory?: string | null;
    opdLimit?: number;
    ipdLimit?: number;
    validFrom?: string;
    validTill?: string;
    dependants?: Array<DependantEligibilityDto> | null;
};

