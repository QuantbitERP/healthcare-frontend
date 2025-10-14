/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { HospitalDepartmentCompositeServiceDto } from './HospitalDepartmentCompositeServiceDto';
export type HospitalServicesDto = {
    serviceId?: string;
    serviceName?: string | null;
    internationalCode?: string | null;
    isCompositeService?: boolean;
    compositeServices?: Array<HospitalDepartmentCompositeServiceDto> | null;
};

