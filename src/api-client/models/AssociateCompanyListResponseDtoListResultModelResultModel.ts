/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import { AssociateCompanyListResponseDto } from './AssociateCompanyListResponseDto';
import type { ValidationError } from './ValidationError';
export type AssociateCompanyListResponseDtoListResultModelResultModel = {
    data: {
        items: Array<AssociateCompanyListResponseDto> | null;
        metadata: {
            page: {
                currentPage: number;
                pageSize: number;
                totalPages: number;
            };
        };
    };
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

