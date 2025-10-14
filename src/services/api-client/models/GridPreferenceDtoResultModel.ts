/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GridPreferenceDto } from './GridPreferenceDto';
import type { ValidationError } from './ValidationError';
export type GridPreferenceDtoResultModel = {
    data?: GridPreferenceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

