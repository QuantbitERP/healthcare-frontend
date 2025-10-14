/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorWiseSettingDeleteResponseDTO } from './DoctorWiseSettingDeleteResponseDTO';
import type { ValidationError } from './ValidationError';
export type DoctorWiseSettingDeleteResponseDTOListResultModel = {
    data?: Array<DoctorWiseSettingDeleteResponseDTO> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

