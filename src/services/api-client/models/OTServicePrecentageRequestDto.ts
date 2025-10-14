/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ServiceDetail } from './ServiceDetail';
export type OTServicePrecentageRequestDto = {
    hospitalId?: string;
    categoryId?: string;
    rateNameId?: string;
    companyId?: string;
    departmentId?: string;
    percentage?: boolean;
    isCathlabApplicable?: boolean;
    servicesDetail?: Array<ServiceDetail> | null;
};

