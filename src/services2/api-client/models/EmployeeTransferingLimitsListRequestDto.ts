/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type EmployeeTransferingLimitsListRequestDto = {
    startDate?: string;
    endDate?: string;
    searchTerm?: string | null;
    categoryList?: Array<string> | null;
    designationList?: Array<number> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    pageNumber?: number;
    pageSize?: number;
};

