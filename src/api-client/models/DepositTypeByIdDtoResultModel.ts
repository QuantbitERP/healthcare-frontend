/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { DepositTypeByIdDto } from './DepositTypeByIdDto';
import type { ValidationError } from './ValidationError';
export type DepositTypeByIdDtoResultModel = {
    data?: DepositTypeByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

