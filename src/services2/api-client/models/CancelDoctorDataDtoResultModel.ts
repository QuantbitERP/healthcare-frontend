/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelDoctorDataDto } from './CancelDoctorDataDto';
import type { ValidationError } from './ValidationError';
export type CancelDoctorDataDtoResultModel = {
    data?: CancelDoctorDataDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

