/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ScheduleofChargeTypeResponseDto } from './ScheduleofChargeTypeResponseDto';
import type { metadata, ValidationError } from './ValidationError';
export type ScheduleofChargeTypeResponseDtoResultModel = {
    data?: {
       items: Array<ScheduleofChargeTypeResponseDto>;
       metadata:metadata;
    };
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

