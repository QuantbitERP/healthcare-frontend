/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type PriorAuthorizationRequestListRequestDto = {
    searchTerm?: string | null;
    status?: Array<number> | null;
    visitType?: Array<number> | null;
    patientCategoryList?: Array<string> | null;
    patientCompanyList?: Array<string> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    pageNumber?: number;
    pageSize?: number;
};

