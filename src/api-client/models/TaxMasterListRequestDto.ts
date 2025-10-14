/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type TaxMasterListRequestDto = {
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    taxType?: Array<number> | null;
    status?: Array<number> | null;
    searchTerm?: string | null;
    page?: number;
    pageSize?: number;
};

