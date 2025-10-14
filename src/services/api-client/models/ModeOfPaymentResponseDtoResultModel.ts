/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ModeOfPaymentResponseDto } from './ModeOfPaymentResponseDto';
import type { ValidationError } from './ValidationError';
export type ModeOfPaymentResponseDtoResultModel = {
    data?: ModeOfPaymentResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

