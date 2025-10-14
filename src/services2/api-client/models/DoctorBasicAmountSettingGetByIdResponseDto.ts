/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PaymentAdjustmentDetailsDto } from './PaymentAdjustmentDetailsDto';
export type DoctorBasicAmountSettingGetByIdResponseDto = {
    id?: string;
    doctorName?: string | null;
    paymentId?: string;
    basicSalary?: number;
    accountTransfer?: number;
    paymentAdjustmentDetails?: Array<PaymentAdjustmentDetailsDto> | null;
};

