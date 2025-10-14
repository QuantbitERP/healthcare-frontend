/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetServiceDetailsWithRate } from './GetServiceDetailsWithRate';
import type { ValidationError } from './ValidationError';
export type GetServiceDetailsWithRateListResultModel = {
    data?: Array<GetServiceDetailsWithRate> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

