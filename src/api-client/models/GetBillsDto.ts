/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type GetBillsDto = {
    hospitalId?: string;
    startDate?: string;
    endDate?: string;
    billStatuses?: Array<number> | null;
    createdByList?: Array<string> | null;
    companyIds?: Array<string> | null;
    schemeCompanyTypeIds?: Array<string> | null;
    isCancelled?: boolean | null;
    searchTerm?: string | null;
    pageNumber?: number;
    pageSize?: number;
};

