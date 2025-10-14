import { AdditionalServiceGroupListDto, CompositeServiceDto, DepartmentListDto, HospitalListDto, KVPair, KVPairListResultModelResultModel, OperationCategoryListDto, RepeatableTypeDto, RestrictionTypeDto, SaveServiceMasterDto, ServiceCodeTypeDto, ServiceCreatedByDto, ServiceGroupListDto, SubDepartmentListDto, VisitTypeEnumDtoListResultModelResultModel } from "@/services/api-client";

export interface ServiceCountSummaryDto {
  total_count: number;
  active_count: number;
  deactive_count: number;
}

export interface ServiceStats {
  total_count: number|undefined;
  active_count: number|undefined;
  deactive_count: number|undefined;
}

export interface ServiceState {
  stats: ServiceStats | null;
  data: SaveServiceMasterDto[];
  loading: boolean;
  error: string | null;
}

// export interface ServiceMasterState {
  
//   loading: boolean;
//   error: string | null;
// }

export interface DepartmentsState {
  departments: DepartmentListDto[];
  subDepartments: SubDepartmentListDto[];
  loading: boolean;
  error: string | null;
}

export interface ActiveDeactiveStatusDto {
  activeDeactiveStatusId: string;
  activeDeactiveStatusValue: string;
}
export interface ServiceFilterState {
  loading: boolean;
  error: string | null;

  departments: DepartmentListDto[];
  subDepartments: SubDepartmentListDto[];
  serviceGroups: ServiceGroupListDto[];
  activeDeactiveStatus:ActiveDeactiveStatusDto[];
  applicableHospitals:HospitalListDto[];
  operationCategories:OperationCategoryListDto[];
  createdByList:ServiceCreatedByDto[];
  serviceTypes:ServiceCodeTypeDto[];
  modifiedByList:any
}

export interface newServiceItemListState{
   loading: boolean;
  error: string | null;
  departments: DepartmentListDto[];
  subDepartments: SubDepartmentListDto[];
  serviceGroups: ServiceGroupListDto[];
  applicableHospitals:HospitalListDto[];
  operationCategories:OperationCategoryListDto[];
  serviceTypes:ServiceCodeTypeDto[];
  restrictionTypes:RestrictionTypeDto[];
  additionalServiceGroups:AdditionalServiceGroupListDto[];
  repeatableTypes:RepeatableTypeDto[];
  timeDaysList:any
}

export interface ServiceMasterState {
  loading: boolean;
  error: unknown | null;
  response: any; 
}

export interface CompositeServiceState {
  loading: boolean;
  error: string | null;
  compositeService: CompositeServiceDto[];
  hospitals: HospitalListDto[];
}

export interface ApplicableHospitalListItemState {
  billingClassList: KVPair[];
  gstList: KVPairListResultModelResultModel | null;
  visitTypeList: VisitTypeEnumDtoListResultModelResultModel | null;
  loading: boolean;
  error: string | null;
}

export interface ServiceListRequestDto {
      department?: Array<string>;
    subDepartment?: Array<string>;
    status?: Array<string>;
    codeType?: Array<string>;
    applicableHospitals?: Array<string>;
    operationCategory?: Array<string>;
    createdBy?: Array<string>;
    modifiedBy?: Array<string>;
    dailyAutoCharges?: boolean;
    oneTimeService?: boolean;
    fromDate?: string;
    toDate?: string;
    search?: string;
    serviceGroups?:Array<string>
}

export interface smGetByIdInitialStateType {
  loading: boolean;
  error: string | null;
  data: SaveServiceMasterDto | null;
}

export interface UpdateServiceMasterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}