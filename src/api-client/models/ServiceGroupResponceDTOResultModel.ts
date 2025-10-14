/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ServiceGroupResponceDTO } from './ServiceGroupResponceDTO';
import type { ValidationError } from './ValidationError';
export type ServiceGroupResponceDTOResultModel = {
    data?: ServiceGroupResponceDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

