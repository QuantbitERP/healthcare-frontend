/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type InsertIPDBillService = {
    billRequisitionDetailId?: string | null;
    hospitalServiceId?: string;
    hospitaldoctorid?: string | null;
    hospitalDepartmentId?: string | null;
    billingRoomCategoryId?: string;
    packageId?: string | null;
    requisitionDateTime?: string | null;
    rate?: number;
    quantity?: number;
    amount?: number;
    concessionPercent?: number;
    concessionAmount?: number;
    mouDiscountAmount?: number;
    mouDiscountPercent?: number;
    amountWithDiscount?: number;
    apportionConcessionAmount?: number;
    concessionRemark?: string | null;
    serviceGstId?: string | null;
    serviceGstAmount?: number;
    serviceCGstAmount?: number | null;
    serviceSGstAmount?: number | null;
    totalAmount?: number;
    inPackageAmount?: number;
    outPackageAmount?: number;
    editableServiceName?: string | null;
    isEmergency?: boolean;
    concessionCategory?: string | null;
    concessionGivenBy?: string | null;
    cancelRemark?: string | null;
    isForcedPackageConversion?: boolean | null;
    isBillWiseGstApplicable?: boolean | null;
    oldPackageId?: string | null;
    isServiceGroupConcession?: boolean | null;
    profileServiceId?: string | null;
    isProfileService?: boolean | null;
    isDeleted?: boolean | null;
};

