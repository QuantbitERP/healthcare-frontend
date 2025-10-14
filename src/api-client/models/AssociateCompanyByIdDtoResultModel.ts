/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { AssociateCompanyByIdDto } from './AssociateCompanyByIdDto';
import type { ValidationError } from './ValidationError';
export type AssociateCompanyByIdDtoResultModel = {
    data?: AssociateCompanyByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

