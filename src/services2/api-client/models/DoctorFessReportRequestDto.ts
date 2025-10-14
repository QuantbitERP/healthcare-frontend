/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type DoctorFessReportRequestDto = {
    searchTerm?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    hospitalId?: string | null;
    hospitalDoctorIds?: Array<string> | null;
    billTypes?: Array<number> | null;
    patientCategories?: Array<string> | null;
    patientCompanies?: Array<string> | null;
    serviceGroups?: Array<string> | null;
    departmentIds?: Array<string> | null;
};

