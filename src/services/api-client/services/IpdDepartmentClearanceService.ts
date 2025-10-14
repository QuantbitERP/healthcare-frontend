/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

// Request and Response Types
export interface CreateNoDuesPendingRequest {
  model: {
    patientVisitId: string;
    departmentId: string;
    isApproved: boolean;
    hospitalID: string;
  };
}

export interface GetPatientClearanceRequest {
  hospId: string;
  visitId: string;
  departmentId: string;
}

export interface PatientClearanceResponse {
  id: string;
  service: string;
  requisitionNo: string;
  module: string;
  status: "Pending" | "Cleared";
  remark: string;
  departmentId: string;
  patientVisitId: string;
  hospitalId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoDuesPendingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface GetPatientClearanceResponse {
  success: boolean;
  message: string;
  data: PatientClearanceResponse[];
}

export class IpdDepartmentClearanceService {
  /**
   * Create No Dues Pending
   * @param version API version
   * @param tenant Tenant identifier
   * @param requestBody Request body containing patient visit and department details
   * @returns CreateNoDuesPendingResponse OK
   * @throws ApiError
   */
  public static createNoDuesPending(
    version: string,
    requestBody: CreateNoDuesPendingRequest,
    tenant?: string,
  ): CancelablePromise<CreateNoDuesPendingResponse> {
    const url = `/api/v{version}/NoDuesPending/createnoduespending`;
    console.log('IPD Department Clearance Service - createNoDuesPending called with:', {
      url,
      version,
      requestBody,
      tenant,
      openApiBase: process.env.NEXT_PUBLIC_BASEAPI_URL
    });
    
    return __request(OpenAPI, {
      method: 'POST',
      url: url,
      path: {
        'version': version,
      },
      headers: {
        'tenant': tenant,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Get Patient Clearance
   * @param version API version
   * @param tenant Tenant identifier
   * @param requestBody Request body containing hospital, visit and department details
   * @returns GetPatientClearanceResponse OK
   * @throws ApiError
   */
  public static getPatientClearance(
    version: string,
    requestBody: GetPatientClearanceRequest,
    tenant?: string,
  ): CancelablePromise<GetPatientClearanceResponse> {
    const url = `/api/v{version}/NoDuesPending/GetPatientClearance`;   
    return __request(OpenAPI, {
      method: 'POST',
      url: url,
      path: {
        'version': version,
      },
      headers: {
        'tenant': tenant,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
