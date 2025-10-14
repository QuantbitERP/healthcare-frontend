/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { InsertBillConcession } from './InsertBillConcession';
import type { InsertOpdBillService } from './InsertOpdBillService';
import type { InsertReceiptPayment } from './InsertReceiptPayment';
export type InsertNewOpdBill = {
    existingDraftBillNo?: string | null;
    existingBillId?: string | null;
    visittype?: number;
    patientid?: string;
    hospitalid?: string;
    refferaldoctorid?: string | null;
    billcompanyid?: string | null;
    services?: Array<InsertOpdBillService> | null;
    billConcession?: Array<InsertBillConcession> | null;
    receiptPayments?: Array<InsertReceiptPayment> | null;
    billDiscountPercent?: number;
    billDiscountAmount?: number;
    billGstId?: string | null;
    billGstAmount?: number;
    billRemark?: string | null;
    paidBy?: number;
    paidByName?: string | null;
    sponsoredbyName?: string | null;
};

