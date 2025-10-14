/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { InsertIPDBillConcession } from './InsertIPDBillConcession';
import type { InsertIPDBillGroupConcession } from './InsertIPDBillGroupConcession';
import type { InsertIPDBillService } from './InsertIPDBillService';
import type { InsertIPDReceiptPayment } from './InsertIPDReceiptPayment';
export type IPDBillSaveRequestDto = {
    existingDraftBillId?: string | null;
    existingBillId?: string | null;
    patientVisitid?: string;
    hospitalid?: string;
    refferaldoctorid?: string | null;
    billcompanyid?: string;
    services?: Array<InsertIPDBillService> | null;
    billConcession?: Array<InsertIPDBillConcession> | null;
    receiptPayments?: Array<InsertIPDReceiptPayment> | null;
    groupConcession?: Array<InsertIPDBillGroupConcession> | null;
    billGstId?: string | null;
    billGstAmount?: number;
    billRemark?: string | null;
    paidBy?: number;
    paidByName?: string | null;
    sponsoredbyName?: string | null;
};

