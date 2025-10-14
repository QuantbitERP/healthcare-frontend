/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepositTypeRequestDto } from './DepositTypeRequestDto';
import type { ValidationError } from './ValidationError';
export type DepositTypeRequestDtoResultModel = {
    data?: DepositTypeRequestDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

