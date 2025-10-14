/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { FinanceAuthorityRequestDto } from './FinanceAuthorityRequestDto';
import type { ValidationError } from './ValidationError';
export type FinanceAuthorityRequestDtoResultModel = {
    data?: FinanceAuthorityRequestDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

