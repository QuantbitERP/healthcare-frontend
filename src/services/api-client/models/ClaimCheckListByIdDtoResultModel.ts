/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ClaimCheckListByIdDto } from './ClaimCheckListByIdDto';
import type { ValidationError } from './ValidationError';
export type ClaimCheckListByIdDtoResultModel = {
    data?: ClaimCheckListByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

