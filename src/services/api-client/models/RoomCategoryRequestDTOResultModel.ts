/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { RoomCategoryRequestDTO } from './RoomCategoryRequestDTO';
import type { ValidationError } from './ValidationError';
export type RoomCategoryRequestDTOResultModel = {
    data?: RoomCategoryRequestDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

