/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type MetaData = {
    page?:{
    totalPages: number;
    pageSize: number;
    currentPage: number;
 
    }
}
import type { RoomCategoriesWithSearchAndFilterResponseDto } from './RoomCategoriesWithSearchAndFilterResponseDto';
import type { ValidationError } from './ValidationError';
export type RoomCategoriesWithSearchAndFilterResponseDtoResultModel = {
    data?:{items: RoomCategoriesWithSearchAndFilterResponseDto[], metadata: MetaData};
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

