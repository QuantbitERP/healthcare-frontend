/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorMasterSaveResponceDTO } from './DoctorMasterSaveResponceDTO';
import type { ValidationError } from './ValidationError';
export type DoctorMasterSaveResponceDTOResultModel = {
    data?: DoctorMasterSaveResponceDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

