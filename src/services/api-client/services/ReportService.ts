"use client";
import type { ServiceGroupListDto } from '../models/ServiceGroupListDto';
import type { KVPair } from '../models/KVPair';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ReportListRequestDto, ReportListResponseDto } from '@/store/slices/reportListSlice';

export class ReportService {
 /**
  * Fetches list of service groups
  * @returns ServiceGroupListDto[]
  */
 public static getApiV1RateListServiceGroup(): CancelablePromise<ServiceGroupListDto>{
  return __request(OpenAPI, {
    method: 'GET',
    url: '/api/v1/ServiceGroup/servicegroups',
    mediaType: 'application/json',
  });
}

 /**
  * Fetches list of service groups using the new API endpoint
  * @returns ServiceGroupListDto[]
  */
 public static getApiV1ServiceGroups(): CancelablePromise<ServiceGroupListDto>{
  return __request(OpenAPI, {
    method: 'GET',
    url: '/api/v1/ServiceGroup/serviceGroups',
    mediaType: 'application/json',
  });
}

 /**
     * @param version
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
 public static getApiVDepartmentsDepartmentKVlist(
  version: string,
  tenant?: string,
): CancelablePromise<Array<KVPair>> {
  return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/Departments/departmentKVlist',
      path: {
          'version': version,
      },
      headers: {
          'tenant': tenant,
      },
  });
}

  /**
   * Fetches list of individual services
   * @returns SaveServiceMasterDto[]
   */
  public static getApiV1ServiceMaster(): CancelablePromise<ServiceGroupListDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/ServiceMaster/services',
      mediaType: 'application/json',
    });
  }

  /**
   * Fetches list of billing classes9p 
   * @returns KVPair[]
   */
  public static getApiV1BillingClass(): CancelablePromise<Array<KVPair>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/IPD/billingClassList',
      mediaType: 'application/json',
    });
  }
  /**
   * Fetches list of company names
   * @returns KVPair[]
   */
  public static getApiVCompany(): CancelablePromise<ServiceGroupListDto>{
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/PatientCompanyMaster/patientcompanies', 
      mediaType: 'application/json',
    });
  }
 /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
 public static postApiV1BillReport(body: ReportListRequestDto): CancelablePromise<ReportListResponseDto> {
 
  return __request(OpenAPI, {
    method: 'POST',
    url: '/api/v1/ServicewiseBillReport/servicewisebillreport',
    body,
    mediaType: 'application/json',
   
  });
}

  public static getApiV1GrouBy(): CancelablePromise< {data:{items:Array<KVPair>}}> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/ServicewiseBillReport/groupby',
      mediaType: 'application/json',
    });
  }
}
