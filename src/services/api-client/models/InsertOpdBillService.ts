/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type InsertOpdBillService = {
    visitId?: string | null;
    billRequisitionDetailId?: string | null;
    hospitalServiceId?: string;
    hospitaldoctorid?: string |null;
    rate?: number;
    quantity?: number;
    concessionPercent?: number;
    concessionAmount?: number;
    mouDiscountAmount?: number;
    mouDiscountPercent?: number;
    apportionConcession?: number;
    concessionRemark?: string | null;
    serviceGstId?: string | null;
    serviceGstAmount?: number;
    editableServiceName?: string | null;
    isEmergency?: boolean;
    isBillLevelGSTApplicable?: boolean;
    concessionCategory?: string | null;
    concessionGivenBy?: string | null;
    cancelRemark?: string | null;
    serviceRemark?: string | null;
    serviceBillingClass?: string | null;
};

