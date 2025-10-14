/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelServiceDetails } from './CancelServiceDetails';
import type { InsertReceiptPayment } from './InsertReceiptPayment';
import type { RefundAction } from './RefundAction';
export type CancelServiceRequestDto = {
    cancelServiceDetails?: Array<CancelServiceDetails> | null;
    cancelReason?: string;
    cancelRemark?: string | null;
    recordRefund?: RefundAction;
    receiptPayments?: Array<InsertReceiptPayment> | null;
    billId?: string;
    hospitalId?: string;
    user?: string | null;
};

