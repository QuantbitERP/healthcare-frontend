/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ServiceGroupByIdDto } from './ServiceGroupByIdDto';
import type { ValidationError } from './ValidationError';
export type ServiceGroupByIdDtoResultModel = {
    data?: ServiceGroupByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

