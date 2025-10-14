/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type FinanceAuthorityListRequestDto = {
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    searchTerm?: string | null;
    doctorList?: Array<string> | null;
    employeeList?: Array<string> | null;
    pageNumber?: number;
    pageSize?: number;
};

