/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type DepositTypeListRequestDto = {
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    status?: number | null;
    searchTerm?: string | null;
    applicableForId?: Array<number> | null;
    page?: number;
    pageSize?: number;
};

