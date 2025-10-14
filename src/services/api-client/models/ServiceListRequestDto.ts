/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type ServiceListRequestDto = {
    department?: Array<string> | null;
    subDepartment?: Array<string> | null;
    status?: Array<string> | null;
    codeType?: Array<string> | null;
    applicableHospitals?: Array<string> | null;
    operationCategory?: Array<string> | null;
    serviceGroups?: Array<string> | null;
    createdBy?: Array<string> | null;
    modifiedBy?: Array<string> | null;
    dailyAutoCharges?: boolean | null;
    oneTimeService?: boolean | null;
    fromDate?: string | null;
    toDate?: string | null;
    search?: string | null;
};

