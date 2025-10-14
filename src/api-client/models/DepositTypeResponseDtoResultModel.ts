/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { DepositTypeResponseDto } from './DepositTypeResponseDto';
import type { ValidationError } from './ValidationError';
export type DepositTypeResponseDtoResultModel = {
    data?: DepositTypeResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

