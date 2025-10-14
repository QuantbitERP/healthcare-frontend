/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelOperationCategoryDto } from './CancelOperationCategoryDto';
import type { ValidationError } from './ValidationError';
export type CancelOperationCategoryDtoListResultModel = {
    data?: Array<CancelOperationCategoryDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

