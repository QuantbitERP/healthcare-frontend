/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelRoomCategoryDto } from './CancelRoomCategoryDto';
import type { ValidationError } from './ValidationError';
export type CancelRoomCategoryDtoListResultModel = {
    data?: Array<CancelRoomCategoryDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

