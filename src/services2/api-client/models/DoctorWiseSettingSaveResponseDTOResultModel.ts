/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorWiseSettingSaveResponseDTO } from './DoctorWiseSettingSaveResponseDTO';
import type { ValidationError } from './ValidationError';
export type DoctorWiseSettingSaveResponseDTOResultModel = {
    data?: DoctorWiseSettingSaveResponseDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

