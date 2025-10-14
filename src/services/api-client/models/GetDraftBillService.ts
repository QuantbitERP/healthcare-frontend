/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type GetDraftBillService = {
    serviceid?: string;
    billRequisiionDetailId?: string;
    hospitaldoctorid?: string |null;
    rate?: number;
    quantity?: number;
    concessionPercent?: number;
    concessionAmount?: number;
    internationalcode?: string | null;
    serviceName?: string | null;
    remark?: string | null;
    mouDiscount?: number;
    apportionConcession?: number;
    totalServiceDiscount?: number;
    concessionRemark?: string | null;
    serviceGstId?: string | null;
    serviceGstAmount?: number;
    finalServiceAmountWithGstAfterDicsount?: number;
    editableServiceName?: string | null;
    isEmergency?: boolean;
    isBillLevelGSTApplicable?: boolean;
    includeInPackage?: number;
    outOfPackage?: number;
    cancelRemark?: string | null;
};

