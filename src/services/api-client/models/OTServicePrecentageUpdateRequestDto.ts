/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UpdateServiceDetail } from './UpdateServiceDetail';
export type OTServicePrecentageUpdateRequestDto = {
    otServicePercentageId?: string;
    hospitalId?: string;
    categoryId?: string;
    rateNameId?: string;
    companyId?: string;
    departmentId?: string;
    isPercentage?: boolean;
    isCathlabApplicable?: boolean;
    servicesDetail?: Array<UpdateServiceDetail> | null;
};

