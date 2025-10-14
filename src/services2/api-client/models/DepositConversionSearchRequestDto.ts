/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type DepositConversionSearchRequestDto = {
    startDate?: string;
    endDate?: string;
    searchTerm?: string | null;
    transferedToList?: Array<number> | null;
    depositeTypeList?: Array<string> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    pageNumber?: number;
    pageSize?: number;
};

