/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { FinanceAuthorityDto } from './FinanceAuthorityDto';
import type { ValidationError } from './ValidationError';
export type FinanceAuthorityDtoResultModel = {
    data?: FinanceAuthorityDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

