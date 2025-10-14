/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ServiceRateAndMediclaimResponse } from './ServiceRateAndMediclaimResponse';
import type { ValidationError } from './ValidationError';
export type ServiceRateAndMediclaimResponseResultModel = {
    data?: ServiceRateAndMediclaimResponse;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

