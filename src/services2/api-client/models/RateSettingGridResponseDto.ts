/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RatesettingDetails } from './RatesettingDetails';
export type RateSettingGridResponseDto = {
    hospitalId?: string;
    departmentId?: string;
    applicableDate?: string | null;
    scheduleOfChargeTypeId?: string;
    deactive?: boolean | null;
    ratesettingDetails?: Array<RatesettingDetails> | null;
};

