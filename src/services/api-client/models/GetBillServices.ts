/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type GetBillServices = {
    billRequisiionDetailId?: string;
    patientVisitid?: string | null;
    billRequisitionDocumentDate?: string;
    billRequisitionTime?: string;
    serviceid?: string;
    internationalcode?: string | null;
    serviceName?: string | null;
    hospitaldoctorid?: string| null;
    rate?: number | null;
    quantity?: number | null;
    concessionPercent?: number | null;
    concessionAmount?: number | null;
    netamount?: number | null;
    remark?: string | null;
    mouDiscountAmount?: number;
    apportionConcession?: number;
    totalServiceDiscount?: number;
    concessionRemark?: string | null;
    serviceGstId?: string | null;
    serviceGstAmount?: number;
    editableServiceName?: string | null;
    isEmergency?: boolean;
    isBillLevelGSTApplicable?: boolean;
    allocatedReceiptAmount?: number;
    isprocessed?: boolean;
    conessionCategoryId?: string | null;
    applicationuserid?: string | null;
    includeInPackage?: number;
    outOfPackage?: number;
    cancelRemark?: string | null;
    billRequisitionNo?: string | null;
};

