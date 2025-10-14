/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type IpdListRequestDto = {
    patientCategory?: Array<string> | null;
    patientCompany?: Array<string> | null;
    billingClass?: Array<string> | null;
    admittingDoctor?: Array<string> | null;
    ward?: Array<string> | null;
    billStatus?: Array<number> | null;
    paidStatus?: Array<number> | null;
    gender?: Array<number> | null;
    modifiedByList?: Array<string> | null;
    createdByList?: Array<string> | null;
    package?: boolean;
    surgeryDone?: boolean;
    showBilledAndDischargedPatients?: boolean;
    searchTerm?: string | null;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
    hospitalId?: string|null;
};

