/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ValidateTokenResponse } from './ValidateTokenResponse';
import type { ValidationError } from './ValidationError';
export type ValidateTokenResponseResultModel = {
    data?: ValidateTokenResponse;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

