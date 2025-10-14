/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SuggestServicesGetByIdDto } from './SuggestServicesGetByIdDto';
import type { ValidationError } from './ValidationError';
export type SuggestServicesGetByIdDtoResultModel = {
    data?: SuggestServicesGetByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

