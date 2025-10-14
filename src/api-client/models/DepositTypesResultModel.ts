/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { DepositTypes } from './DepositTypes';
import type { ValidationError } from './ValidationError';
export type DepositTypesResultModel = {
    data?: DepositTypes;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

