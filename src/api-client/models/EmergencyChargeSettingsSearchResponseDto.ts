/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { RoomCategoryDto } from './RoomCategoryDto';
export type EmergencyChargeSettingsSearchResponseDto = {
    id?: string | null;
    hospId?: string | null;
    hospitalName?: string | null;
    serivceID?: string | null;
    serivceGroup?: string | null;
    companyID?: string | null;
    companyName?: string | null;
    createById?: string | null;
    createBy?: string | null;
    createOn?: string;
    modifiedById?: string | null;
    modifiedBy?: string | null;
    modifiedOn?: string;
    percentage?: number | null;
    roomcategory?: Array<RoomCategoryDto> | null;
};

