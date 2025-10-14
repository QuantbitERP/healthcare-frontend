/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PaymentReceivedResponseDto } from './PaymentReceivedResponseDto';
import type { ValidationError } from './ValidationError';
export type PaymentReceivedResponseDtoResultModel = {
    data?: PaymentReceivedResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

