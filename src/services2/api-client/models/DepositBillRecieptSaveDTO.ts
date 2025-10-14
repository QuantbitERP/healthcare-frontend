/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { BillRecieptPaymentDetailsSaveDTO } from './BillRecieptPaymentDetailsSaveDTO';
export type DepositBillRecieptSaveDTO = {
    depositBlockingFlag?: number;
    depositTypeId?: string | null;
    depositBankId?: string | null;
    blockingRemark?: string | null;
    totalamount?: number | null;
    patientid?: string | null;
    patientvisitid?: string | null;
    hospitalid?: string | null;
    billRecieptPaymentDetailsDTO?: Array<BillRecieptPaymentDetailsSaveDTO> | null;
};

