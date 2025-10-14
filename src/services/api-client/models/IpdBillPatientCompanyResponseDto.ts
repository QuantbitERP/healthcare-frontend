/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type IpdBillPatientCompanyResponseDto = {
    ipdBillPatientCompanyDetailId?: string;
    companyName?: string;
    associateCompanyName?: string;
    insurancePolicyNo?: string;
    claimId?: string;
    amountlist?: Array<{
        detailId?: string;
        amount?: number;
        status?: string;
        approvalDate?: string;
    }>;
};

export type IpdBillPatientCompanyListResponseDto = {
    data?: Array<IpdBillPatientCompanyResponseDto>;
    isError?: boolean;
    errorMessage?: string;
    validationErrors?: any;
    errorCode?: string;
};

export type IpdBillPatientCompanyListRequestDto = {
    patientVisitId?: string;
};
