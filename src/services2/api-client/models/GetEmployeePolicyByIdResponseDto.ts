/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { EmployeeDependentListDto } from './EmployeeDependentListDto';
export type GetEmployeePolicyByIdResponseDto = {
    id?: string;
    employeeCategoryId?: string;
    employeeSubCategoryId?: string | null;
    opdLimit?: number;
    ipdLimit?: number;
    allLimit?: number;
    totalLimit?: number;
    validFrom?: string;
    validTill?: string | null;
    dependentLists?: Array<EmployeeDependentListDto> | null;
};

