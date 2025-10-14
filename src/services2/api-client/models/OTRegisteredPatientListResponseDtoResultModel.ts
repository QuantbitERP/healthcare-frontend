/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OTRegisteredPatientListResponseDto } from './OTRegisteredPatientListResponseDto';
import type { ValidationError } from './ValidationError';
export type OTRegisteredPatientListResponseDtoResultModel = {
    data?: OTRegisteredPatientListResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

