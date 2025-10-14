/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ServiceDetails } from './ServiceDetails';
export type OTServicePrecentageGetByidResponseDto = {
    id?: string;
    hospitalId?: string;
    categoryId?: string;
    otServiceNameId?: string;
    rateNameId?: string;
    companyId?: string;
    departmentId?: string;
    percentage?: boolean;
    isCathlabApplicable?: boolean;
    servicesDetails?: Array<ServiceDetails> | null;
};

