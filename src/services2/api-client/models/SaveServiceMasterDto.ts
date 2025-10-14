/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ApplicableHospitalServices } from './ApplicableHospitalServices';
import type { CompositeServices } from './CompositeServices';
export type SaveServiceMasterDto = {
    id?: string;
    codeType?: string | null;
    serviceCode?: string | null;
    codeTypeId?: string | null;
    serviceName?: string | null;
    aliasName?: string | null;
    departmentId?: string;
    departmentName?: string | null;
    subDepartmentId?: string;
    subDepartmentName?: string | null;
    subSubDepartmentId?: string;
    subSubDepartmentName?: string | null;
    serviceGroupId?: string;
    serviceGroupName?: string | null;
    additionalServiceGroupId?: string;
    additionalServiceGroupName?: string | null;
    operationCategoryId?: string;
    operationCategoryName?: string | null;
    isComposite?: boolean;
    isProfile?: boolean;
    isPatientArrivalApplicable?: boolean;
    isShowLISDocument?: boolean;
    isSurgery?: boolean;
    isConsumable?: boolean;
    restrictionType?: string | null;
    restrictionId?: string;
    repeatableType?: string | null;
    repeatableTypeId?: string;
    timeValue?: number;
    timeUnit?: string | null;
    timeUnitId?: string;
    status?: string | null;
    modifiedOn?: string | null;
    modifiedBy?: string | null;
    createdBy?: string | null;
    createdOn?: string | null;
    deactive?: boolean;
    isAllHospital?: boolean | null;
    applicableHospitalServices?: Array<ApplicableHospitalServices> | null;
    compositeServices?: Array<CompositeServices> | null;
};

