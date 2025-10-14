/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OTRegisteredPatientResponseDto } from './OTRegisteredPatientResponseDto';
import type { ValidationError } from './ValidationError';
export type OTRegisteredPatientResponseDtoResultModel = {
    data?: OTRegisteredPatientResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

