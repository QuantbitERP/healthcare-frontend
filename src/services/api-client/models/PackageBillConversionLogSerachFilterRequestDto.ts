/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type PackageBillConversionLogSerachFilterRequestDto = {
    patientVisitId?: string;
    sourcePackage?: Array<string> | null;
    targetPackage?: Array<string> | null;
    changeType?: Array<number> | null;
    modifiedByList?: Array<string> | null;
    searchTerm?: string | null;
    pageNumber?: number;
    pageSize?: number;
};

