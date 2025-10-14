/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { UpdateBillRecieptPaymentDetailsDTO } from './UpdateBillRecieptPaymentDetailsDTO';
export type UpdateRequestDepositBillRecieptDTO = {
    id?: string;
    depositBlockingFlag?: number;
    depositTypeId?: string | null;
    depositBankId?: string | null;
    blockingRemark?: string | null;
    totalamount?: number | null;
    patientid?: string | null;
    hospitalid?: string | null;
    updateBillRecieptPaymentDetailsDTO?: Array<UpdateBillRecieptPaymentDetailsDTO> | null;
};

