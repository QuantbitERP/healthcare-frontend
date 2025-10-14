/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IPDBillPatientCompanyGetByIdResponseDTO } from './IPDBillPatientCompanyGetByIdResponseDTO';
import type { ValidationError } from './ValidationError';
export type IPDBillPatientCompanyGetByIdResponseDTOListResultModel = {
    data?: Array<IPDBillPatientCompanyGetByIdResponseDTO> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

