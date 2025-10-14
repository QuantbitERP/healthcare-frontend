/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CappingRoomCategorys } from './CappingRoomCategorys';
import type { RoomCategorys } from './RoomCategorys';
export type ServiceDetails = {
    id?: string;
    serviceId?: string;
    serviceName?: string | null;
    serviceCode?: string | null;
    baseHours?: number;
    cappingHours?: number;
    isCapping?: boolean;
    roomCategorys?: Array<RoomCategorys> | null;
    cappingRoomCategorys?: Array<CappingRoomCategorys> | null;
};

