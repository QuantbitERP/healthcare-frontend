/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UploadDocumentByIdDto } from './UploadDocumentByIdDto';
import type { ValidationError } from './ValidationError';
export type UploadDocumentByIdDtoResultModel = {
    data?: UploadDocumentByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

