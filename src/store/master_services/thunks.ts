import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActiveDeactiveStatusService, AdditionalServiceGroupListDto, DepartmentListDto, DepartmentsService, HospitalService, IpdService, KVPair, KVPairListResultModelResultModel, OpdBillService, OperationCategoryListDto, OperationCategoryService, RepeatableTypeDto,RestrictionTypeDto, SaveServiceMasterDto, SaveServiceMasterRequestDto, ServiceCodeTypeDto,ServiceCountSummaryDto, ServiceGroupListDto, ServiceListRequestDto, ServiceMasterService, SubDepartmentListDto, UserService, VisitTypeEnumDtoListResultModelResultModel,  YearService } from '@/services/api-client';
import { ServiceStats } from './types';
import { AxiosError } from 'axios';

export const fetchServiceStats = createAsyncThunk<
  ServiceStats, 
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/fetchServiceStats',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response: ServiceCountSummaryDto = await ServiceMasterService.getApiVServiceMasterCountSummary(version, tenant);
    
      const serviceStats: ServiceStats = {
        total_count: response.totalServiceCount,
        active_count: response.activeServiceCount,
        deactive_count: response.deactiveServiceCount,
      };
      return serviceStats; 
    } catch (error: any) {
        console.log(error)
      return rejectWithValue('Failed to fetch service stats');
    }
  }
);

export const fetchServiceMasterList = createAsyncThunk<
  SaveServiceMasterDto[],
  { version: string; tenant?: string; requestBody?: ServiceListRequestDto } // args
>(
  'serviceMaster/fetchList',
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    console.log(requestBody,'req body list')
    try {
      const response = await ServiceMasterService.postApiVServiceMasterList(version, tenant, requestBody);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch data');
    }
  }
);

// //serviceGroup getApiVServiceMasterServiceGroups
// export const fetchServiceGroups = createAsyncThunk<
//   ServiceGroupListDto[],
//   { version: string; tenant?: string }
// >('service/fetchServiceGroups', async ({ version, tenant }, thunkAPI) => {
//   try {
//     const res = await ServiceMasterService.getApiVServiceMasterServiceGroups(version, tenant);
//     return res;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error?.message || 'Failed to fetch service groups');
//   }
// });


// // departments
// export const fetchDepartments = createAsyncThunk(
//   'departments/fetchDepartments',
//   async ({ version, tenant }: { version: string; tenant?: string }) => {
//     return await DepartmentsService.getApiVDepartmentsDepartments(version, tenant);
//   }
// );

// export const fetchSubDepartments = createAsyncThunk(
//   'departments/fetchSubDepartments',
//   async ({ version, tenant }: { version: string; tenant?: string }) => {
//     return await DepartmentsService.getApiVDepartmentsSubDepartments(version, tenant);
//   }
// );

//fetch all services filters
export const fetchAllServiceFilters = createAsyncThunk<
  {
    departments: DepartmentListDto[];
    subDepartments: SubDepartmentListDto[];
    serviceGroups: ServiceGroupListDto[];
    activeDeactiveStatus:any;
    applicableHospitals:any;
    operationCategories:OperationCategoryListDto[];
    createdByList:any;
    serviceTypes:ServiceCodeTypeDto[];
    modifiedByList:any
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/fetchAllServiceFilters',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [
        departments,
        subDepartments,
        serviceGroups,
        activeDeactiveStatus,
        applicableHospitals,
        operationCategories,
        createdByList,
        serviceTypes,
        modifiedByList

      ] = await Promise.all([
        DepartmentsService.getApiVDepartmentsDepartments(version, tenant),
        DepartmentsService.getApiVDepartmentsSubDepartments(version, tenant),
        ServiceMasterService.getApiVServiceMasterServiceGroups(version, tenant),
        ActiveDeactiveStatusService.getApiVActiveDeactiveStatusActiveDeactiveStatus(version, tenant),
        HospitalService.getApiVHospitalHospitals(version, tenant),
        OperationCategoryService.getApiVOperationCategoryOperationCategories(version,tenant),
        ServiceMasterService.getApiVServiceMasterCreatedByList(version,tenant),
        ServiceMasterService.getApiVServiceMasterServiceCodeTypes(version,tenant),
        UserService.getApiVUserModifiedByList(version,tenant)
      ]);

      return {
        departments,
        subDepartments,
        serviceGroups,
        activeDeactiveStatus,
        applicableHospitals: applicableHospitals?.data?.items || applicableHospitals,
        operationCategories,
        createdByList,
        serviceTypes,
        modifiedByList

      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch service filters');
    }
  }
);

//fetch all create new services list
export const fetchAllNewServiceList = createAsyncThunk<
  {
    departments: DepartmentListDto[];
    subDepartments: SubDepartmentListDto[];
    serviceGroups: ServiceGroupListDto[];
    applicableHospitals:any;
    operationCategories:OperationCategoryListDto[];
    serviceTypes:ServiceCodeTypeDto[];
    additionalServiceGroups:AdditionalServiceGroupListDto[];
    restrictionTypes:RestrictionTypeDto[];
    repeatableTypes:RepeatableTypeDto[];
    timeDaysList: any[];
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/fetchAllNewServiceList',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [
        departments,
        subDepartments,
        serviceGroups,
        applicableHospitals,
        operationCategories,
        serviceTypes,
        additionalServiceGroups,
        restrictionTypes,
        repeatableTypes,
        timeDaysList

      ] = await Promise.all([
        DepartmentsService.getApiVDepartmentsDepartments(version, tenant),
        DepartmentsService.getApiVDepartmentsSubDepartments(version, tenant),
        ServiceMasterService.getApiVServiceMasterServiceGroups(version, tenant),
        HospitalService.getApiVHospitalHospitals(version, tenant),
        OperationCategoryService.getApiVOperationCategoryOperationCategories(version,tenant),
        ServiceMasterService.getApiVServiceMasterServiceCodeTypes(version,tenant),
        ServiceMasterService.getApiVServiceMasterAdditionalServiceGroups(version,tenant),
        ServiceMasterService.getApiVServiceMasterRestrictionTypes(version,tenant),
        ServiceMasterService.getApiVServiceMasterRepeatableTypes(version,tenant),
        YearService.getApiVYearTimeDaysList(version,tenant)

      ]);

      return {
        departments,
        subDepartments,
        serviceGroups,
        applicableHospitals: applicableHospitals?.data?.items || applicableHospitals,
        operationCategories,
        serviceTypes,
        additionalServiceGroups,
        restrictionTypes,
        repeatableTypes,
        timeDaysList
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch service filters');
    }
  }
);

//post service master
export const postServiceMaster = createAsyncThunk(
  'serviceMaster/post',
  async (
    {
      version,
      tenant,
      requestBody,
    }: {
      version: string;
      tenant?: string;
      requestBody: SaveServiceMasterRequestDto;
    },
    thunkAPI
  ) => {
    try {
      const response = await ServiceMasterService.postApiVServiceMaster(
        version,
        tenant,
        requestBody
      );
      return response;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const compositeServiceList = createAsyncThunk<
  {
    compositeService: any;
    hospitals: any;
  },
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  'service/compositeServiceList',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [compositeService, hospitals] = await Promise.all([
        ServiceMasterService.getApiVServiceMasterCompositeServices(version, tenant),
        HospitalService.getApiVHospitalHospitals(version, tenant),
      ]);

      return {
        compositeService,
        hospitals: hospitals?.data?.items || hospitals,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch composite service list');
    }
  }
);

export const getApplicableHospitalsModalList = createAsyncThunk<
  {
    billingClassList: KVPair[];
    gstList: KVPairListResultModelResultModel;
    visitTypeList: VisitTypeEnumDtoListResultModelResultModel;
  },
  { version: string; tenant?: string }
>(
  'hospital/getApplicableHospitalsModalList',
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const [billingClassList, gstList, visitTypeList] = await Promise.all([
        IpdService.getApiVIpdBillingClassList(version, tenant),
        OpdBillService.getApiVOpdBillOpdbillsGstList(version, tenant),
        OpdBillService.getApiVOpdBillOpdbillsPatientVisitType(version, tenant),
      ]);

      return {
        billingClassList,
        gstList,
        visitTypeList,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch applicable hospitals modal list');
    }
  }
);

// GET ServiceMaster by ID
export const getServiceMasterById = createAsyncThunk<
  SaveServiceMasterDto,
  { id: string; version: string; tenant?: string }
>('serviceMaster/getById', async ({ id, version, tenant }, { rejectWithValue }) => {
  try {
    return await ServiceMasterService.getApiVServiceMaster(id, version, tenant);
  } catch (error) {
    return rejectWithValue(error);
  }
});

// PUT (update) ServiceMaster
export const updateServiceMaster = createAsyncThunk<
  any,
  { id: string; version: string; tenant?: string; requestBody?: SaveServiceMasterRequestDto }
>('serviceMaster/update', async ({ id, version, tenant, requestBody }, { rejectWithValue }) => {
  try {
    return await ServiceMasterService.putApiVServiceMaster(
      id,
      version,
      tenant,
      requestBody
    );
  } catch (error) {
    return rejectWithValue(error);
  }
});