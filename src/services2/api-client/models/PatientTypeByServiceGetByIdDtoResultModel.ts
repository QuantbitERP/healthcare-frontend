/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatientTypeByServiceGetByIdDto } from './PatientTypeByServiceGetByIdDto';
import type { ValidationError } from './ValidationError';
export type PatientTypeByServiceGetByIdDtoResultModel = {
    data?: PatientTypeByServiceGetByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

