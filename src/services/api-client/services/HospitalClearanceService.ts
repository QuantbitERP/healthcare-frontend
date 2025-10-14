import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CommonResponse } from '@/services/api-client/models/DoctorDto';

export interface DepartmentClearanceRequest {
  hospiltalIdList: string[];
  pageNumber: number;
  pageSize: number;
  searchTerm:string;
}

export interface DepartmentClearanceItem {
  id?:string|number
  hospId: string;
  deptId: string;
  department: string;
  hospital: string;
  clearanceRequired: boolean;
  searchTerm:string;
}
export interface DepartmentClearancePutRequest   {
  model: DepartmentClearanceItem[]
  
}

export interface DepartmentClearanceResponse {
  data: {
    items: DepartmentClearanceItem[];
    metadata: {
      page: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    };
  };
  isError: boolean;
  errorMessage?: string;
  validationErrors?: Array<{ field: string; message: string }>;
  errorCode?: string;
}

export class HospitalClearanceService {
  /**
   * @param version API version string (e.g., '1')
   * @param request DepartmentClearanceRequest
   * @returns DepartmentClearanceResponse
   */
  public static getDepartmentClearanceList(
    version: string,
    request: DepartmentClearanceRequest
  ): CancelablePromise<DepartmentClearanceResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v{version}/DepartmentClearance/GetDepartmentClearanceList',
      path: {
        'version': version,
    },
      body: {
        hospiltalIdList: request.hospiltalIdList,
        pageNumber: request.pageNumber,
        pageSize: request.pageSize,
        searchTerm:request.searchTerm
      },
      mediaType: 'application/json',
    });
  }
  public static gethospitallist(
    version: string,
    tenant: string
  ): CancelablePromise<CommonResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v{version}/Hospital/hospitals',
      path: {
        'version': version,
      },
      headers: {
        'tenant': tenant,
      },
    });
  }
  public static PutDepartmentClearanceResponse(
    version:string,
    tenant: string,
    request: DepartmentClearancePutRequest
  )
  {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v{version}/DepartmentClearance/update',
      path: { 'version': version },
      headers: {
        'tenant': tenant,
      },
      body: request,
      mediaType: 'application/json',
      
    });
  }

  /**
   * Export Department Clearance data to Excel
   * @param version API version string (e.g., '1')
   * @param tenant Tenant string
   * @param hospitalIds Array of hospital IDs
   * @returns Blob response for Excel file download
   */
  public static async exportDepartmentClearanceToExcel(
    version: string,
    tenant: string,
    hospitalIds: string[]
  ): Promise<Blob> {
    try {
      const url = `${OpenAPI.BASE}/api/v${version}/DepartmentClearance/excel`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Type': 'application/json',
          'tenant': tenant,
        },
        body: JSON.stringify({
          hospitalIds: hospitalIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw error;
    }
  }

}