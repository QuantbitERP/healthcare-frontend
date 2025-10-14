/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type AssociateCompanyListRequestDto = {
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    hospitalId?: Array<string> | null;
    status?: Array<number> | null;
    searchTerm?: string | null;
    page?: number;
    pageSize?: number;
};

