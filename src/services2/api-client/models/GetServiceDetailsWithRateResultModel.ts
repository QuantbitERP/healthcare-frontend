/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetServiceDetailsWithRate } from './GetServiceDetailsWithRate';
import type { ValidationError } from './ValidationError';
export type GetServiceDetailsWithRateResultModel = {
    data?: GetServiceDetailsWithRate;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

