/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PayoutAdjustmentdetailsUpdateDTO } from './PayoutAdjustmentdetailsUpdateDTO';
export type DoctorBasicAmountSettingUpdateRequestDTO = {
    doctorId?: string;
    paymentType?: string;
    basicSalary?: number;
    accountTransfer?: number;
    payoutAdjustmentdetailsUpdateDTO?: Array<PayoutAdjustmentdetailsUpdateDTO> | null;
};

