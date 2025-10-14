/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ConcessionCategoryListResponseDto } from './ConcessionCategoryListResponseDto';
import type { ValidationError } from './ValidationError';
export type ConcessionCategoryListResponseDtoResultModel = {
    data?: {
        items: Array<ConcessionCategoryListResponseDto>;
        metadata: {
            page: {
                currentPage: number,
                pageSize: number,
                totalPages: number
            }
        }
    }
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

