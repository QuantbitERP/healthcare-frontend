/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type GetPriorAuthorizationRequestListRequestDto = {
    pageNumber: number;
    pageSize: number;
    searchTerm: string ;
    status?:  Array<number> | null;
    patientCategoryList?:  Array<string> | null;
    patientCompanyList?:  Array<string> | null;
    fromDate?: string | null;
    toDate?: string | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    visitType?: Array<number> | null;
};
