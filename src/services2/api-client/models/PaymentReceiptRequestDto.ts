/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type PaymentReceiptRequestDto = {
    companyId?: string;
    companyName?: string | null;
    amountReceived?: number;
    paymentDate?: string;
    referenceNo?: string | null;
    paymentModeId?: string;
    paymentModeName?: string | null;
    concessionCategoryId?: string;
    concessionCategoryName?: string | null;
    concessionAmount?: number;
    concessionPercent?: number;
    concessionGivenById?: string;
    concessionGivenByName?: string | null;
    concessionRemark?: string | null;
    tds?: number;
    processingAmount?: number;
    disallowedAmount?: number;
    writeOffAmount?: number;
    remarks?: string | null;
};

