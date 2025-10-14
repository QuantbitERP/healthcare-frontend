/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type ChargesEstimationListRequestDto = {
    searchTerm?: string | null;
    visitType?: Array<number> | null;
    patientCategory?: Array<string> | null;
    patientCompany?: Array<string> | null;
    estimationType?: Array<number> | null;
    patientType?: Array<number> | null;
    modifiedByList?: Array<string> | null;
    createdByList?: Array<string> | null;
    page?: number;
    pageSize?: number;
};

