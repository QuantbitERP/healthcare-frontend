/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { InsertReceiptPayment } from './InsertReceiptPayment';
import type { ReceiptActionType } from './ReceiptActionType';
import type { RefundAction } from './RefundAction';
export type CancelBillRequest = {
    billIds?: Array<string> | null;
    user?: string | null;
    cancelReason?: string;
    cancelRemark?: string | null;
    receiptAction?: ReceiptActionType;
    refundAction?: RefundAction;
    refundReceiptPayments?: Array<InsertReceiptPayment> | null;
    hospitalId?: string;
};

