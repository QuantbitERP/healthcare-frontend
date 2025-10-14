/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatientTypeByBillTypeSaveResponseDto } from './PatientTypeByBillTypeSaveResponseDto';
import type { ValidationError } from './ValidationError';
export type PatientTypeByBillTypeSaveResponseDtoListResultModel = {
    data?: Array<PatientTypeByBillTypeSaveResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

