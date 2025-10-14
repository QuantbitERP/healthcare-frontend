/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PriorAuthorizationSaveResponseDTO } from './PriorAuthorizationSaveResponseDTO';
import type { ValidationError } from './ValidationError';
export type PriorAuthorizationSaveResponseDTOResultModel = {
    data?: PriorAuthorizationSaveResponseDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

