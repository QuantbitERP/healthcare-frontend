/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type PriorAuthorizationSaveRequestDTO = {
    patientVisitId?: string;
    insuranceName?: string | null;
    schemeCompanyID?: string;
    insurancepolicyNumber?: string | null;
    claimId?: string | null;
    sumAssured?: number;
    approvalDateTime?: string | null;
    isApproved?: boolean;
    amountList?: Array<number> | null;
    remarks?: string | null;
};

