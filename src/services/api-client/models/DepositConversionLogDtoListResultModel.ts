/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepositConversionLogDto } from './DepositConversionLogDto';
import type { ValidationError } from './ValidationError';
export type DepositConversionLogDtoListResultModel = {
    data?: Array<DepositConversionLogDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

