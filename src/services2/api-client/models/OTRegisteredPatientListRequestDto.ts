/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type OTRegisteredPatientListRequestDto = {
    searchTerm?: string | null;
    visitType?: Array<number> | null;
    ward?: string | null;
    room?: string | null;
    bed?: string | null;
    packagePatient?: boolean | null;
    modifiedByList?: Array<string> | null;
    createdByList?: Array<string> | null;
    page?: number;
    pageSize?: number;
};

