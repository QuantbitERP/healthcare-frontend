/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type EmployeePolicySearchFilterRequestDto = {
    startDate?: string;
    endDate?: string;
    searchTerm?: string | null;
    categoryList?: Array<string> | null;
    subCategoryList?: Array<string> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    yearList?: Array<number> | null;
    isCurrentApplicable?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
};

