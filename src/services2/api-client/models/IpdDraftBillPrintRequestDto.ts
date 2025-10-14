/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type IpdDraftBillPrintRequestDto = {
    patientId?: string;
    patientVisitId?: string;
    billId?: string | null;
    showProvisionalPrintInDetails?: boolean;
    printAdvancedDetails?: boolean;
    fromDate?: string;
    toDate?: string;
    plannedDischargeDateTime?: string | null;
};

