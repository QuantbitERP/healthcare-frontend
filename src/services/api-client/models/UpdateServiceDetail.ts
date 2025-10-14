/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UpdateCappingRoomCategory } from './UpdateCappingRoomCategory';
import type { UpdateRoomCategory } from './UpdateRoomCategory';
export type UpdateServiceDetail = {
    servicePercentageId?: string;
    serviceId?: string;
    serviceCode?: string | null;
    baseHours?: number;
    cappingHours?: number;
    isCapping?: boolean;
    roomCategory?: Array<UpdateRoomCategory> | null;
    cappingRoomCategory?: Array<UpdateCappingRoomCategory> | null;
};

