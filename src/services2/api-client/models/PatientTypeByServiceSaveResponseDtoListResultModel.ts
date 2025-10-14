/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatientTypeByServiceSaveResponseDto } from './PatientTypeByServiceSaveResponseDto';
import type { ValidationError } from './ValidationError';
export type PatientTypeByServiceSaveResponseDtoListResultModel = {
    data?: Array<PatientTypeByServiceSaveResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

