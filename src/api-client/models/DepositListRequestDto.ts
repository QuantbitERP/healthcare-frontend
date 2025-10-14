/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type DepositListRequestDto = {
    searchTerm?: string | null;
    depositType?: Array<string> | null;
    depositBlockingType?: Array<number> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    startDate?: string | null;
    endDate?: string | null;
    page?: number;
    pageSize?: number;
};

