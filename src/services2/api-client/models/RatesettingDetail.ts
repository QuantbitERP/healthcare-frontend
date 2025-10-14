/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CompositRatesettingDetail } from './CompositRatesettingDetail';
import type { RatesettingRoomCategoryDetail } from './RatesettingRoomCategoryDetail';
export type RatesettingDetail = {
    serviceId?: string;
    doctorId?: string | null;
    ratesettingRoomCategoryDetail?: Array<RatesettingRoomCategoryDetail> | null;
    compositRatesettingDetail?: Array<CompositRatesettingDetail> | null;
};

