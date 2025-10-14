/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CoverLetterGetByIdDto } from './CoverLetterGetByIdDto';
import type { ValidationError } from './ValidationError';
export type CoverLetterGetByIdDtoResultModel = {
    data?: CoverLetterGetByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};
