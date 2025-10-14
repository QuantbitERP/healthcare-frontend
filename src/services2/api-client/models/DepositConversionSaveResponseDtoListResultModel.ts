/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepositConversionSaveResponseDto } from './DepositConversionSaveResponseDto';
import type { ValidationError } from './ValidationError';
export type DepositConversionSaveResponseDtoListResultModel = {
    data?: Array<DepositConversionSaveResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

