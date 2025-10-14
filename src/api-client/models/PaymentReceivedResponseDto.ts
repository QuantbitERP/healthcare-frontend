/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type PaymentReceivedResponseDto = {
    id?: string | null;
    companyId?: string | null;
    companyName?: string | null;
    amountReceived?: number;
    paymentDate?: string;
    referenceNo?: string | null;
    paymentModeId?: string | null;
    concessionAmount?: number;
    concessionPercentage?: number;
    concessionGivenById?: string | null;
    concessionGivenBy?: string | null;
    concessionRemark?: string | null;
    tdsAmount?: number;
    processingAmount?: number;
    disallowedAmount?: number;
    writeOffAmount?: number;
};

