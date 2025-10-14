/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type RateListRequestDto = {
    searchTerm?: string | null;
    hospitalId?: string;
    rateNameId?: string | null;
    departmentId?: string | null;
    rateTypeId?: number | null;
    serviceGroupId?: string | null;
    applicableFromDate?: string | null;
    statusIds?: Array<number> | null;
    billingClassIds?: Array<string> | null;
    startDate?: string | null;
    endDate?: string | null;
    currentApplicableRate?: boolean | null;
    page?: number;
    pageSize?: number;
};

