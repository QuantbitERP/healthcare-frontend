/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RatesettingDetail } from './RatesettingDetail';
export type RateSettingSaveRequestDto = {
    ratesettingId?: string | null;
    hospitalId?: string;
    scheduleOfChargeTypeId?: string;
    departmentId?: string;
    applicableFrom?: string;
    ratetypeId?: number;
    isDeactive?: boolean | null;
    ratesettingDetail?: Array<RatesettingDetail> | null;
};

