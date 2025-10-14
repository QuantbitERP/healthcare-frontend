/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetCompositRatesettingDetail } from './GetCompositRatesettingDetail';
import type { GetRatesettingRoomCategoryDetail } from './GetRatesettingRoomCategoryDetail';
export type RatesettingDetails = {
    serviceId?: string;
    serviceName?: string | null;
    doctorId?: string | null;
    doctorName?: string | null;
    serviceCode?: string | null;
    ratesettingRoomCategoryDetail?: Array<GetRatesettingRoomCategoryDetail> | null;
    compositRatesettingDetail?: Array<GetCompositRatesettingDetail> | null;
};

