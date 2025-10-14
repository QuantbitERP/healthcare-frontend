/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorTypeServiceGetByIdResponseDto } from './DoctorTypeServiceGetByIdResponseDto';
import type { ValidationError } from './ValidationError';
export type DoctorTypeServiceGetByIdResponseDtoListResultModel = {
    data?: Array<DoctorTypeServiceGetByIdResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

