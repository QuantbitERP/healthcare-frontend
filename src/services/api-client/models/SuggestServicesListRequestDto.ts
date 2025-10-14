/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type SuggestServicesListRequestDto = {
    searchTerm?: string | null;
    visitType?: Array<number> | null;
    patientCategory?: Array<string> | null;
    patientCompany?: Array<string> | null;
    ward?: Array<string> | null;
    rooms?: Array<string> | null;
    beds?: Array<string> | null;
    admittedDoctor?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    createdByList?: Array<string> | null;
    page?: number;
    pageSize?: number;
};

