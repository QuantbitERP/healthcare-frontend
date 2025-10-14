/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CappingRoomCategory } from './CappingRoomCategory';
import type { RoomCategory } from './RoomCategory';
export type ServiceDetail = {
    serviceId?: string;
    serviceCode?: string | null;
    baseHours?: number | null;
    cappingHours?: number | null;
    isCapping?: boolean;
    roomCategory?: Array<RoomCategory> | null;
    cappingRoomCategory?: Array<CappingRoomCategory> | null;
};

